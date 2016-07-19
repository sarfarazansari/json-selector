'use strict';

angular.module('jsonSelector', ['RecursionHelper'])

    .provider('JSONSelectorConfig', function JSONSelectorConfigProvider() {

      // Default values for hover preview config
      var hoverPreviewEnabled = false;
      var hoverPreviewArrayCount = 100;
      var hoverPreviewFieldCount = 5;

      // Default value for enable selection config
      var elementsSelectable = false;

      return {
        get hoverPreviewEnabled() {
          return hoverPreviewEnabled;
        },
        set hoverPreviewEnabled(value) {
          hoverPreviewEnabled = !!value;
        },

        get hoverPreviewArrayCount() {
          return hoverPreviewArrayCount;
        },
        set hoverPreviewArrayCount(value) {
          hoverPreviewArrayCount = parseInt(value, 10);
        },

        get hoverPreviewFieldCount() {
          return hoverPreviewFieldCount;
        },
        set hoverPreviewFieldCount(value) {
          hoverPreviewFieldCount = parseInt(value, 10);
        },

        get elementsSelectable() {
          return elementsSelectable;
        },
        set elementsSelectable(value) {
          elementsSelectable = value;
        },

        $get: function () {
          return {
            hoverPreviewEnabled: hoverPreviewEnabled,
            hoverPreviewArrayCount: hoverPreviewArrayCount,
            hoverPreviewFieldCount: hoverPreviewFieldCount,
            elementsSelectable: elementsSelectable
          };
        }
      };
    })

    // Proxy services for events as per http://stackoverflow.com/a/29537535
    .service('$jsonSelector', [function () {
      var listeners = [];

      var broadcastEvent = function (event, data) {
        listeners.forEach(function (callback) {
          if (angular.isFunction(callback)) {
            callback(event, data);
          }
        });
      };

      return {
        select: function (data) {
          broadcastEvent('element.select', data);
        },
        deselect: function (data) {
          broadcastEvent('element.deselect', data);
        },
        register: function (callback) {
          listeners.push(callback);
        }
      };
    }])

    .directive('jsonSelector', ['RecursionHelper', 'JSONSelectorConfig', '$jsonSelector',
      function (RecursionHelper, JSONSelectorConfig, $jsonSelector) {

        function escapeString(str) {
          return str.replace('"', '\"');
        }

        // From http://stackoverflow.com/a/332429
        function getObjectName(object) {
          if (object === undefined) {
            return '';
          }
          if (object === null) {
            return 'Object';
          }
          if (typeof object === 'object' && !object.constructor) {
            return 'Object';
          }
          var funcNameRegex = /function (.{1,})\(/;
          var results = (funcNameRegex).exec((object).constructor.toString());
          if (results && results.length > 1) {
            return results[1];
          } else {
            return '';
          }
        }

        function getType(object) {
          if (object === null) {
            return 'null';
          }
          return typeof object;
        }

        function getValuePreview(object, value) {
          var type = getType(object);

          if (type === 'null' || type === 'undefined') {
            return type;
          }

          if (type === 'string') {
            value = '"' + escapeString(value) + '"';
          }
          if (type === 'function') {

            // Remove content of the function
            return object.toString()
                    .replace(/[\r\n]/g, '')
                    .replace(/\{.*\}/, '') + '{…}';

          }
          return value;
        }

        function getPreview(object) {
          var value = '';
          if (angular.isObject(object)) {
            value = getObjectName(object);
            if (angular.isArray(object))
              value += '[' + object.length + ']';
          } else {
            value = getValuePreview(object, object);
          }
          return value;
        }

        function link(scope) {
          scope.isArray = function () {
            return angular.isArray(scope.json);
          };

          scope.isObject = function () {
            return angular.isObject(scope.json);
          };

          scope.getKeys = function () {
            if (scope.isObject()) {
              return Object.keys(scope.json).map(function (key) {
                if (key === '') {
                  return '""';
                }
                return key;
              });
            }
          };
          scope.type = getType(scope.json);
          scope.hasKey = typeof scope.key !== 'undefined';
          scope.getConstructorName = function () {
            return getObjectName(scope.json);
          };

          if (scope.type === 'string') {

            // Add custom type for date
            if ((new Date(scope.json)).toString() !== 'Invalid Date') {
              scope.isDate = true;
            }

            // Add custom type for URLs
            if (scope.json.indexOf('http') === 0) {
              scope.isUrl = true;
            }
          }

          scope.isEmptyObject = function () {
            return scope.getKeys() && !scope.getKeys().length &&
                scope.isOpen && !scope.isArray();
          };


          // If 'open' attribute is present
          scope.isOpen = !!scope.open;
          scope.toggleOpen = function () {
            scope.isOpen = !scope.isOpen;
          };
          scope.childrenOpen = function () {
            if (scope.open > 1) {
              return scope.open - 1;
            }
            return 0;
          };

          scope.openLink = function (isUrl) {
            if (isUrl) {
              window.location.href = scope.json;
            }
          };

          scope.parseValue = function (value) {
            return getValuePreview(scope.json, value);
          };

          scope.showThumbnail = function () {
            return !!JSONSelectorConfig.hoverPreviewEnabled && scope.isObject() && !scope.isOpen;
          };

          scope.getThumbnail = function () {
            if (scope.isArray()) {

              // if array length is greater then 100 it shows "Array[101]"
              if (scope.json.length > JSONSelectorConfig.hoverPreviewArrayCount) {
                return 'Array[' + scope.json.length + ']';
              } else {
                return '[' + scope.json.map(getPreview).join(', ') + ']';
              }
            } else {

              var keys = scope.getKeys();

              // the first five keys (like Chrome Developer Tool)
              var narrowKeys = keys.slice(0, JSONSelectorConfig.hoverPreviewFieldCount);

              // json value schematic information
              var kvs = narrowKeys
                  .map(function (key) {
                    return key + ':' + getPreview(scope.json[key]);
                  });

              // if keys count greater then 5 then show ellipsis
              var ellipsis = keys.length >= 5 ? '…' : '';

              return '{' + kvs.join(', ') + ellipsis + '}';
            }
          };

          scope.elementsSelectable = function () {
            if (!JSONSelectorConfig.elementsSelectable) {
              return false;
            } else if (angular.isDefined(scope.allowRootSelect) && !scope.allowRootSelect && scope.parent === undefined) {
              return false;
            }

            return true;
          };

          scope.isSelected = !!scope.selected;
          scope.toggleSelectElement = function () {
            var current = scope;
            var parent = current.parent;
            var expression = "";

            if (parent && parent.json) {
              do {
                if (angular.isArray(parent.json)) {
                  expression = "[" + current.key + "]" + expression;
                } else {
                  expression = "." + current.key + expression;
                }

                current = parent;
                parent = parent.parent;
              } while (parent !== undefined);
            }

            if (!scope.isSelected) {
              $jsonSelector.select({ expression: expression, identifier: scope.identifier });
            } else {
              $jsonSelector.deselect({ expression: expression, identifier: scope.identifier });
            }

            scope.isSelected = !scope.isSelected;
          };
        }

        return {
          templateUrl: 'json-selector.html',
          restrict: 'E',
          replace: true,
          scope: {
            json: '=',
            key: '=',
            open: '=',
            parent: '=',
            identifier: '@',
            allowRootSelect: '='
          },
          compile: function (element) {

            // Use the compile function from the RecursionHelper,
            // And return the linking function(s) which it returns
            return RecursionHelper.compile(element, link);
          }
        };
      }]);

// Export to CommonJS style imports. Exporting this string makes this valid:
// angular.module('myApp', [require('jsonSelector')]);
if (typeof module === 'object') {
  module.exports = 'jsonSelector';
}