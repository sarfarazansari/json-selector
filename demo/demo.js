var app = angular.module('demo', ['ngSanitize', 'jsonSelector']);

app.controller('MainCtrl', function ($scope, $http, JSONSelectorConfig, $jsonSelector, $log) {

  $scope.hoverPreviewEnabled = JSONSelectorConfig.hoverPreviewEnabled;
  $scope.hoverPreviewArrayCount = JSONSelectorConfig.hoverPreviewArrayCount;
  $scope.hoverPreviewFieldCount = JSONSelectorConfig.hoverPreviewFieldCount;
  $scope.elementsSelectable = JSONSelectorConfig.elementsSelectable;
  $scope.mymodel = [];

  $scope.$watch('hoverPreviewEnabled', function (newValue) {
    JSONSelectorConfig.hoverPreviewEnabled = newValue;
  });
  $scope.$watch('hoverPreviewArrayCount', function (newValue) {
    JSONSelectorConfig.hoverPreviewArrayCount = newValue;
  });
  $scope.$watch('hoverPreviewFieldCount', function (newValue) {
    JSONSelectorConfig.hoverPreviewFieldCount = newValue;
  });
  $scope.$watch('elementsSelectable', function (newValue) {
    JSONSelectorConfig.elementsSelectable = newValue;
  });

  $jsonSelector.register(function (event, data) {
    $log.debug("Event: '" + event + "', data: " + JSON.stringify(data));

    if (data.identifier === "mymodel") {
      if (event === "element.select") {
        $scope.mymodel.push(data.expression);
      } else if (event === "element.deselect") {
        $scope.mymodel.splice($scope.mymodel.indexOf(data.expression), 1);
      }
    }

  });

  $scope.undef = undefined;
  $scope.textarea = '{}';
  $scope.complex = {
    numbers: [
      1,
      2,
      3
    ],
    boolean: true,
    'null': null,
    number: 123,
    anObject: {
      a: 'b',
      c: 'd',
      e: 'f\"'
    },
    string: 'Hello World',
    url: 'https://github.com/mohsen1/json-formatter',
    date: 'Sun Aug 03 2014 20:46:55 GMT-0700 (PDT)',
    func: function add(a, b) {
      return a + b;
    }
  };

  $scope.randArray1 = [null, null, null].map(function (r) {
    return { value: Math.random() };
  });

  $scope.randArray2 = [null, null, null].map(function (r) {
    return { value: Math.random() };
  });

  $scope.deep = { a: { b: { c: { d: {} } } } };

  $scope.fn = function fn(arg1, /*arg*/arg2) {
    return arg1 + arg2;
  };

  $scope.alternate1 = { o: 1, d: 'Alternate 1', b: [] };
  $scope.alternate2 = [1, 'Alternate 2', { b: {} }];

  $scope.fetchGiantJSON = function () {
    $scope.giant = 'Fetching...';
    $http.get('giant.json').then(function (json) {
      $scope.giant = json;
    });
  }

  function Person(name) {
    this.name = name;
  }

  $scope.person = new Person('Mohsen');

  $scope.$watch('textarea', function (str) {
    var result = {};

    try {
      $scope.textareaJson = JSON.parse(str);
    } catch (e) {
    }
  });
});
