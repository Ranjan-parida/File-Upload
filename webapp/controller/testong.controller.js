handleUpload: function (oEvent) {
		var that = this;
		var oFile = oEvent.getParameter(“files”)[0];
		if (oFile && window.FileReader) {
			var reader = new FileReader();
			reader.onload = function (evt) {
				var strCSV = evt.target.result; //string in CSV
				that.csvJSON(strCSV);
			};
			reader.readAsText(oFile);
		}
	},
	csvJSON: function (csv) {
		var lines = csv.split(“\n”);
		var result = [];
		var headers = lines[0].split(“, ”);
		for (var i = 1; i < lines.length; i++) {
			var obj = {};
			var currentline = lines[i].split(“, ”);
			for (var j = 0; j < headers.length; j++) {
				obj[headers[j]] = currentline[j];
			}
			result.push(obj);
		}
		var oStringResult = JSON.stringify(result);
		var oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, “”));
		//return result; //JavaScript object

		this.getView().getModel(‘myResultModel’).setProperty(“/”, oFinalResult);
				this.generateTable();
			},

			generateTable: function () {
				var oTable = this.getView().byId(“testdata”);
				var oModel = this.getView().getModel(‘myResultModel’)
				var oModelData = oModel.getProperty(“/”);
						var oColumns = Object.keys(oModelData[0]);
						var oColumnNames = []; $.each(oColumns, function (i, value) {
							oColumnNames.push({
								Text: oColumns[i]
							});
						}); oModel.setProperty(“/columnNames”, oColumnNames);
							var oTemplate = new Column({
								header: new Label({
									text: “{
										Text
									}”
								})
							}); oTable.bindAggregation(“columns”, “/columnNames”, oTemplate);
								var oItemTemplate = new ColumnListItem();
								var oTableHeaders = oTable.getColumns(); $.each(oTableHeaders, function (j, value) {
									var oHeaderName = oTableHeaders[j].getHeader().getText();
									oItemTemplate.addCell(new Text({
										text: “{”+oHeaderName + “
										}”
									}));
								}); oTable.bindItems(“/”, oItemTemplate);
								},