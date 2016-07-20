'use strict';

angular.module('jsonSelector', ['RecursionHelper'])

  .directive('jsonSelector', ['RecursionHelper',
    function (RecursionHelper) {

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

        scope.elementSelectable = function () {
          if (!scope.selectable) {
            return false;
          } else if (angular.isDefined(scope.allowRootSelect) && !scope.allowRootSelect && scope.parent === undefined) {
            return false;
          }

          return true;
        };

        if (scope.selectable) {
          if (scope.parent === undefined) {

            if (!angular.isDefined(scope.model) || !angular.isArray(scope.model)) {
              scope.model = [];
            }

            scope.expression = "";
          } else {
            scope.model = scope.parent.model;
            scope.expression = (function () {
              var expression = scope.parent.expression;

              if (angular.isArray(scope.parent.json)) {
                expression += "[" + scope.key + "]";
              } else {
                expression += "." + scope.key;
              }

              return expression;
            })();
          }
        }

        scope.selection = function () {
          if (!scope.model) {
            return { selected: false };
          }

          return { selected: scope.model.indexOf(scope.expression) !== -1 };
        };

        scope.toggleSelectElement = function () {
          if (!scope.selection().selected) {
            scope.model.push(scope.expression);
          } else {
            scope.model.splice(scope.model.indexOf(scope.expression), 1);
          }
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
          allowRootSelect: '=?',
          selectable: '=?',
          model: '=?'
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
