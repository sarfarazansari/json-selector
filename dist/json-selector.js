/*!
 * jsonselector
 * 
 * Version: 1.0.0 - 2016-07-18T05:44:52.999Z
 * License: Apache-2.0
 */


angular.module("jsonSelector").run(["$templateCache", function($templateCache) {$templateCache.put("json-selector.html","<div ng-init=\"isOpen = open && open > 0\" class=\"json-selector-row\"><input class=\"selector-checkbox\" type=\"checkbox\" ng-click=\"toggleSelectElement()\" ng-if=\"elementsSelectable()\"> <a ng-click=\"toggleOpen()\"><span class=\"toggler {{isOpen ? \'open\' : \'\'}}\" ng-if=\"isObject()\"></span> <span class=\"key\" ng-if=\"hasKey\"><span class=\"key-text\">{{key}}</span><span class=\"colon\">:</span></span> <span class=\"value\"><span ng-if=\"isObject()\"><span class=\"constructor-name\">{{getConstructorName(json)}}</span> <span ng-if=\"isArray()\"><span class=\"bracket\">[</span><span class=\"number\">{{json.length}}</span><span class=\"bracket\">]</span></span></span> <span ng-if=\"!isObject()\" ng-click=\"openLink(isUrl)\" class=\"{{type}}\" ng-class=\"{date: isDate, url: isUrl}\">{{parseValue(json)}}</span></span> <span ng-if=\"showThumbnail()\" class=\"thumbnail-text\">{{getThumbnail()}}</span></a><div class=\"children\" ng-if=\"getKeys().length && isOpen\"><json-selector ng-repeat=\"key in getKeys() track by $index\" json=\"json[key]\" key=\"key\" open=\"childrenOpen()\" parent=\"$parent\" identifier=\"{{identifier}}\"></json-selector></div><div class=\"children empty object\" ng-if=\"isEmptyObject()\"></div><div class=\"children empty array\" ng-if=\"getKeys() && !getKeys().length && isOpen && isArray()\"></div></div>");}]);