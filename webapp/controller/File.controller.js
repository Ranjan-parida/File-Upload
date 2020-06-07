sap.ui.define(
	["sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/util/Export",
		"sap/ui/core/util/ExportTypeCSV"
	],
	function (Controller, JSONModel, Export, ExportTypeCSV) {
		return Controller.extend("com.siemen.controller.File", {
			
			// onInit function for Initializing of Model as globally and set to the Application Level
			onInit: function () {
				var oModel = new JSONModel();
				sap.ui.getCore().setModel(oModel, "myFinalResult");
			},
			
			// onUpload Function is used to Upload and Export after Modifying the CSV data 
			onUpload: function (e) {
				var oModel = new JSONModel();
				var fU = this.getView().byId("idfileUploader");
				var domRef = fU.getFocusDomRef();
				var file = domRef.files[0];
				// Create a File Reader object
				var reader = new FileReader();
				var oFinalResult = {};
				//reader.onload function is used here as Modifying the csv data and again export as a CSV file.
				reader.onload = function (e) {
					var strCSV = e.target.result;
					var lines = strCSV.split("\n");
					var result = [];
					var headers = lines[0].split(",");
					//here concat function is used to add a new Column
					// headers = headers.concat("INT_EXT");
					// headers = headers.concat("count");
					// headers = headers.concat("Reported_by_Name");
					// headers = headers.concat("Reported_by_Depart");
					// headers = headers.concat("Reported_by_GID");
					
					var oCol = ["INT_EXT" , "count" , "Reported_by_Name" , "Reported_by_Depart" , "Reported_by_GID"];
					var oCol1 = {};
					for(var k=0; k < oCol.length; k++){
						
						headers.push(oCol[k]);
						
					}
					
					for (var i = 1; i < lines.length - 1; i++) {
						var obj = {};
						var currentline = lines[i].split(",");
						//here also we are using concat to add deafult value to the row
						currentline = currentline.concat("");
						currentline = currentline.concat("");
						currentline = currentline.concat("");
						currentline = currentline.concat("");
						currentline = currentline.concat("");
						
						// for (var l = 0 ; l<oCol.length; i++){
							
						// 	currentline.push("l");
						// }
						
						//this for loop is for reading one cell data from CSV file
						for (var j = 0; j < headers.length; j++) {
							if (headers[j] === "count") {
								currentline[j] = "1";
							}
							if (headers[j] === "Reported By") {
								if (currentline[j] !== "") {
									var oFirst = currentline[j].split("(")[0];
									var oSecond = currentline[j].split("(")[1].split("/")[0];
									var oThird = currentline[j].split("(")[1].split("/")[1].replace(")", "");
								}else{
									
									oFirst = "";
									oSecond = "";
									oThird = "";
								}
								
								

							}
							if (headers[j] === "Reported_by_Name") {
								currentline[j] = oFirst;
							} else if (headers[j] === "Reported_by_Depart") {
								currentline[j] = oSecond;
							} else if (headers[j] === "Reported_by_GID") {
								currentline[j] = oThird;
							}
							if (headers[j] === "FITS ticket") {
								var oFitsTicket = currentline[j];
							}
							if (currentline[j] !== "") {
								currentline[j] = currentline[j].replace("/ D-", "");
								currentline[j] = currentline[j].replace("/", "");
								obj[headers[j]] = currentline[j];
							} else {
								if (headers[j] === "INT_EXT") {
									if (oFitsTicket !== "") {
										currentline[j] = "E";
									} else {
										currentline[j] = "I";
									}
								}
								obj[headers[j]] = currentline[j];
							}
						}
						// here push function is used to push the one row data from the CSV file to obj
						result.push(obj);
					}
					
					//The JSON.stringify() method converts a JavaScript object or value to a JSON string, 
					// optionally replacing values if a replacer function is specified or optionally including 
					// only the specified properties if a replacer array is specified.
					var oStringResult = JSON.stringify(result);
					
					// The JSON.parse() method parses a JSON string, constructing the JavaScript value or object 
					// described by the string. An optional reviver function can be provided to perform a transformation 
					// on the resulting object before it is returned.
					oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ""));
                    
                    //binding with the Table Control
					sap.ui.getCore().getModel("myFinalResult").setProperty("/", oFinalResult);
					
					//oExport is used to export the Final Result into a CSV File
					var oExport = new Export({

						exportType: new ExportTypeCSV({
							fileExtension: "csv",
							separatorChar: ","
						}),

						models: oModel,

						rows: {
							path: "/"
						},
						columns: [{
							name: "ID",
							template: {
								content: "{ID}"
							}
						}, {
							name: "Priority",
							template: {
								content: "{Priority}"
							}
						}, {
							name: "Status",
							template: {
								content: "{Status}"
							}
						}, {
							name: "Description",
							template: {
								content: "{Description}"
							}
						}, {
							name: "Created_On",
							template: {
								content: "{Created On}"
							}
						}, {
							name: "Message_Processor",
							template: {
								content: "{Message Processor}"
							}
						}, {
							name: "Support_Team",
							template: {
								content: "{Support Team}"
							}
						}, {
							name: "Last_changed_by",
							template: {
								content: "{Last Changed By}"
							}
						}, {
							name: "FITS ticket",
							template: {
								content: "{FITS ticket}"
							}
						}, {
							name: "INT_EXT",
							template: {
								content: "{INT_EXT}"
							}
						}, {
							name: "Reported_by_Name",
							template: {
								content: "{Reported_by_Name}"
							}
						}, {
							name: "Reported_by_Depart",
							template: {
								content: "{Reported_by_Depart}"
							}
						}, {
							name: "Reported_by_GID",
							template: {
								content: "{Reported_by_GID}"
							}
						}, {
							name: "count",
							template: {
								content: "{count}"
							}
						}, {
							name: "Contact_Person",
							template: {
								content: "{Contact Person}"
							}
						}, {
							name: "Last_Changed_on",
							template: {
								content: "{Last Changed on}"
							}
						}]
					});
					
					//saveFile() is used to save the data into a CSV or Excell file
					oExport.saveFile().catch(function (oError) {

					}).then(function () {
						oExport.destroy();
					});

				}; 
				oModel = sap.ui.getCore().getModel("myFinalResult");
				reader.readAsBinaryString(file);
			}

		});
	});