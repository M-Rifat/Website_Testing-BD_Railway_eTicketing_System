/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.625, "KoPercent": 1.375};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20357142857142857, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.55, 500, 1500, "https://railspaapi.shohoz.com/v1.0/web/handshake"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/"], "isController": false}, {"data": [0.3225, 500, 1500, "https://railspaapi.shohoz.com/v1.0/web/auth/sign-in"], "isController": false}, {"data": [0.1025, 500, 1500, "Login"], "isController": true}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/-6"], "isController": false}, {"data": [0.3275, 500, 1500, "https://eticket.railway.gov.bd/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/-2"], "isController": false}, {"data": [0.4275, 500, 1500, "https://eticket.railway.gov.bd/assets/i18n/common/en.json"], "isController": false}, {"data": [0.07, 500, 1500, "https://eticket.railway.gov.bd/-3"], "isController": false}, {"data": [0.035, 500, 1500, "https://eticket.railway.gov.bd/-4"], "isController": false}, {"data": [0.0, 500, 1500, "Home Page"], "isController": true}, {"data": [0.465, 500, 1500, "https://eticket.railway.gov.bd/-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2400, 33, 1.375, 15336.08791666669, 70, 103774, 3737.5, 49309.0, 53467.79999999999, 56428.96, 22.777313795459722, 6599.173365905684, 19.438439119324652], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://railspaapi.shohoz.com/v1.0/web/handshake", 400, 0, 0.0, 919.7749999999995, 70, 7484, 611.0, 2046.4, 2170.25, 4110.850000000003, 5.0016880697235315, 1.631409975866855, 5.709934915533993], "isController": false}, {"data": ["https://eticket.railway.gov.bd/", 200, 15, 7.5, 50805.33500000001, 23352, 103774, 51401.5, 56168.1, 57029.4, 90880.77000000009, 1.924168518678866, 3267.6754984498416, 6.799164084071733], "isController": false}, {"data": ["https://railspaapi.shohoz.com/v1.0/web/auth/sign-in", 200, 0, 0.0, 1658.459999999999, 501, 5097, 1202.0, 3422.0, 3679.3499999999995, 3741.99, 2.6289845547157413, 4.400468287873808, 1.3221943805455143], "isController": false}, {"data": ["Login", 200, 0, 0.0, 2019.1699999999998, 592, 5800, 1752.5, 3505.8, 3780.2, 5512.9200000000155, 2.625602247515524, 5.251204495031048, 5.853759698318302], "isController": true}, {"data": ["https://eticket.railway.gov.bd/-5", 200, 5, 2.5, 42059.37500000001, 7385, 64945, 45010.5, 53974.4, 54865.5, 56655.46, 3.076449776957391, 2526.619627629403, 1.5524955295339178], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-6", 200, 3, 1.5, 38820.09000000001, 6792, 77229, 41017.0, 52787.0, 54362.6, 61603.860000000044, 2.4519719984797774, 1484.1948375262057, 1.2429750044441994], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-1", 200, 1, 0.5, 2818.1, 103, 21028, 1837.5, 6742.400000000001, 8267.449999999997, 19286.510000000024, 4.581481651165987, 6.622120109268337, 2.288190586773262], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-2", 200, 2, 1.0, 23612.775, 3711, 53161, 21422.5, 40716.1, 44128.84999999999, 53084.68000000002, 3.5935675141496723, 801.9757602641272, 1.8413524166741533], "isController": false}, {"data": ["https://eticket.railway.gov.bd/assets/i18n/common/en.json", 200, 0, 0.0, 1633.0700000000004, 111, 10045, 1118.5, 3654.6000000000013, 5040.199999999999, 9636.750000000018, 2.483608185972581, 193.5419590080469, 0.9628832517881978], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-3", 200, 1, 0.5, 5171.565, 158, 30763, 3964.5, 11086.900000000001, 14253.449999999999, 21010.180000000015, 4.646948116824276, 17.81997958973257, 2.3931328998117984], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-4", 200, 6, 3.0, 11324.755000000005, 297, 103056, 7703.5, 22286.800000000003, 26830.6, 89959.42000000036, 1.9318631854492065, 62.881071332840705, 0.9735533966984458], "isController": false}, {"data": ["Home Page", 200, 15, 7.5, 53917.24499999997, 28620, 104561, 54621.0, 56827.4, 57520.1, 91650.19000000009, 1.9094719355362275, 3392.1409976453824, 8.550415802431713], "isController": true}, {"data": ["https://eticket.railway.gov.bd/-0", 200, 0, 0.0, 4289.9800000000005, 251, 41018, 1147.0, 12432.600000000004, 18301.449999999997, 31807.180000000022, 4.799500851911402, 51.08374979002184, 2.357567312999448], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 18, 54.54545454545455, 0.75], "isController": false}, {"data": ["Assertion failed", 15, 45.45454545454545, 0.625], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2400, 33, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 18, "Assertion failed", 15, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://eticket.railway.gov.bd/", 200, 15, "Assertion failed", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-5", 200, 5, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-6", 200, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-1", 200, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-2", 200, 2, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-3", 200, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://eticket.railway.gov.bd/-4", 200, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to eticket.railway.gov.bd:443 [eticket.railway.gov.bd/15.197.214.39] failed: Connection timed out: connect", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
