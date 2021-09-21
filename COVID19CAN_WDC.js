(function () {
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        // Schema for active cases data
        var active_cols = [{
            id: "active_cases",
            alias: "Active cases",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "active_cases_change",
            alias: "Active cases change",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "cumulative_cases",
            alias: "Cumulative cases",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "cumulative_deaths",
            alias: "Cumulative deaths",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "cumulative_recovered",
            alias: "Cumulative recovered",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "date_active",
            alias: "Date of active cases",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "date_active_str",
            alias: "Date of active cases (string)",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "province",
            alias: "Province",
            dataType: tableau.dataTypeEnum.string
        }];

        var activeTable = {
            id: "active",
            alias: "Active Cases Data",
            columns: active_cols
        };

        // Schema for vaccine administration data
        var avaccine_cols = [{
            id: "avaccine",
            alias: "Administered vaccine ",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "cumulative_avaccine",
            alias: "Cumulative administered vaccine",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "date_vaccine_administered",
            alias: "Date of vaccine administration",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "date_vaccine_administered_str",
            alias: "Date of vaccine administration (string)",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "province",
            alias: "Province",
            dataType: tableau.dataTypeEnum.string
        }];

        var avaccineTable = {
            id: "avaccine",
            alias: "Vaccine Administration",
            columns: avaccine_cols
        };

        // Schema for vaccine completion data
        var cvaccine_cols = [{
            id: "cvaccine",
            alias: "Completed vaccine",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "cumulative_cvaccine",
            alias: "Cumulative completed vaccine",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "date_vaccine_completed",
            alias: "Date of vaccine completion",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "date_vaccine_completed_str",
            alias: "Date of vaccine completion (string)",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "province",
            alias: "Province",
            dataType: tableau.dataTypeEnum.string
        }];

        var cvaccineTable = {
            id: "cvaccine",
            alias: "Vaccine Completion",
            columns: cvaccine_cols
        };

        // Schema for testing data
        var testing_cols = [{
            id: "testing",
            alias: "Testing",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "cumulative_testing",
            alias: "Cumulative testing",
            dataType: tableau.dataTypeEnum.int
        }, {
            id: "testing_info",
            alias: "Testing info",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "date_testing",
            alias: "Date of testing",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "date_testing_str",
            alias: "Date of testing (string)",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "province",
            alias: "Province",
            dataType: tableau.dataTypeEnum.string
        }];

        var testingTable = {
            id: "testing",
            alias: "Testing",
            columns: testing_cols
        };

        schemaCallback([activeTable, avaccineTable, cvaccineTable, testingTable]);
    };
    
    // Download data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://api.opencovid.ca/timeseries?ymd=true", function(resp) {
            var tableData = [];

            var i = 0;

            // Iterate over the JSON object according to table schema
            if (table.tableInfo.id == "active") {
                var feat = resp.active;
    
                for (i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "active_cases": feat[i].active_cases,
                        "active_cases_change": feat[i].active_cases_change,
                        "cumulative_cases": feat[i].cumulative_cases,
                        "cumulative_deaths": feat[i].cumulative_deaths,
                        "cumulative_recovered": feat[i].cumulative_recovered,
                        "date_active": new Date(feat[i].date_active), // strngely enough, this does not seem to work in Tableau...
                        "date_active_str": feat[i].date_active,
                        "province": feat[i].province
                    });
                }
            }

            if (table.tableInfo.id == "avaccine") {
                var feat = resp.avaccine;

                for (i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "avaccine": feat[i].avaccine,
                        "cumulative_avaccine": feat[i].cumulative_avaccine,
                        "date_vaccine_administered": new Date(feat[i].date_vaccine_administered), // idem
                        "date_vaccine_administered_str": feat[i].date_vaccine_administered, 
                        "province": feat[i].province
                    });
                }
            }

            if (table.tableInfo.id == "cvaccine") {
                var feat = resp.cvaccine;

                for (i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "cvaccine": feat[i].cvaccine,
                        "cumulative_cvaccine": feat[i].cumulative_cvaccine,
                        "date_vaccine_completed": new Date(feat[i].date_vaccine_completed), // idem
                        "date_vaccine_completed_str": feat[i].date_vaccine_completed, 
                        "province": feat[i].province
                    });
                }
            }

            if (table.tableInfo.id == "testing") {
                var feat = resp.testing;

                for (i = 0, len = feat.length; i < len; i++) {
                    tableData.push({
                        "testing": feat[i].testing,
                        "cumulative_testing": feat[i].cumulative_testing,
                        "testing_info": feat[i].testing_info,
                        "date_testing": new Date(feat[i].date_testing), // idem
                        "date_testing_str": feat[i].date_testing, 
                        "province": feat[i].province
                    });
                }
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    myConnector.init = function(initCallback) {
        initCallback();
        tableau.submit();
    };    
    
    tableau.registerConnector(myConnector);
})();

