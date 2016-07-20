# JSON Selector: An angular directive to format and select elements from JSON
[![Build Status](https://travis-ci.org/31piy/json-selector.svg?branch=master)](https://travis-ci.org/31piy/json-selector)
[![Code Climate](https://codeclimate.com/github/31piy/json-selector/badges/gpa.svg)](https://codeclimate.com/github/31piy/json-selector)

This repository is inspired by https://github.com/mohsen1/json-formatter. It is customized for some specific usage.
Hence it adds the ability to select elements from the JSON, but lacks configuration via `JSONFormatterConfig`. Also,
`npm` packages are no longer supported.

![Screenshot](./screenshot.png)

## Usage

* Install via Bower

  ```bash
  bower install json-selector --save
  ```
* Add `jsonSelector` to your app dependencies

  ```js
  angular.module('MyApp', ['jsonSelector'])
  ```
* Use `<json-selector>` directive

  ```html
  <json-selector json="{my: 'json'}" open="1" selectable="true" allow-root-select="false" model="mymodel"></json-formatter>
  ```
  * `open` attribute accepts a number that indicated how many levels JSON should be open</p>
  * `json` attribute sets the JSON which needs to be rendered.</p>
  * `selectable` sets whether the nodes are selectable via checkboxes.</p>
  * `allow-root-select` allows/denies selecting of root element.</p>
  * `model` is an array of expressions which are selected.</p>
