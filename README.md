# JSON Selector: An angular directive to format and select elements from JSON
[![Build Status](https://travis-ci.org/31piy/json-selector.svg?branch=master)](https://travis-ci.org/31piy/json-selector)
[![Code Climate](https://codeclimate.com/github/31piy/json-selector/badges/gpa.svg)](https://codeclimate.com/github/31piy/json-selector)

This is a mirror of https://github.com/mohsen1/json-formatter. This directive extends the core functions by adding the
capability to select JSON elements by checkboxes.

![Screenshot](./screenshot.png)

## Usage

* Install via Bower or npm

  ```bash
  bower install json-selector --save
  ```
  ...or

  ```bash
  npm install jsonselector --save
  ```
* Add `jsonSelector` to your app dependencies

  ```js
  angular.module('MyApp', ['jsonSelector'])
  ```
* Use `<json-selector>` directive

  ```html
  <json-selector json="{my: 'json'}" open="1" model="mymodel"></json-formatter>
  ```
* `open` attribute accepts a number which indicates how many levels rendered JSON should be opened
* `model` is an optional attribute to link your model to json formatter. This model should be an array. It will be automatically updated when one more more element(s) are selected/deselected in the JSON.

#### Configuration

You can use `JSONSelectorConfig` provider to configure JSON Selector.

Available configurations

##### Hover Preview
* `hoverPreviewEnabled`: enable preview on hover
* `hoverPreviewArrayCount`: number of array items to show in preview Any array larger than this number will be shown as `Array[XXX]` where `XXX` is length of the array.
* `hoverPreviewFieldCount`: number of object properties to show for object preview. Any object with more properties that thin number will be truncated.
* `elementsSelectable`: enables selection of the JSON elements (using checkboxes)

Example using configuration

```js
app.config(function (JSONSelectorConfigProvider) {

  // Enable the hover preview feature
  JSONSelectorConfigProvider.hoverPreviewEnabled = true;
});
```

#### Events
Every selection/deselection of an element fires `element.select` and `element.deselect` events respectively.

If you want, you can use `$jsonSelector` service to register a listener to these events.

```js
app.controller('MainCtrl', function ($log, $jsonSelector) {
  // ... your code here

  $jsonSelector.register(function(event, data) {
    $log.debug("Event: '" + event + "', data: " + JSON.stringify(data));
  });

  // ... your code here

});
```

## Known Bugs
##### `hashKey`

If you are iterating in an array of objects using `ng-repeat`, make sure you are using `track by $index` to avoid adding extra `$$hashKey` to your objects.

## Browser Support
All modern browsers are supported. Lowest supported version of Internet Explorer is **IE9**.

## License

Apache 2.0

See [LICENSE](./LICENSE.md)
