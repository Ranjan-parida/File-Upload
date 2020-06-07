/*global QUnit*/

sap.ui.define([
	"com/siemens/FileUpload/controller/File.controller"
], function (Controller) {
	"use strict";

	QUnit.module("File Controller");

	QUnit.test("I should test the File controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});