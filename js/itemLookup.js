var lookupVal = '';
$(function(){

    $('#itemLookupBtn').click(function(){
        $('#results').hide();
        $('#loaderImage').show();
        lookupVal = $('#modelSelect').val() + ' ' + $('#capacitySelect').val() + ' ' + $('#carrierSelect').val();
        if(lookupVal == '') return;
        $('#itemTitle').html('Apple ' + $('#modelSelect').val()+' - '+$('#capacitySelect').val()+' ('+$('#carrierSelect').val()+')');
        $('#itemDescription').html('Apple ' + $('#modelSelect').val()+' - '+$('#capacitySelect').val()+' ('+$('#carrierSelect').val()+')');
        $('#intro').hide();
        buildURLArray(filterarray);
        testER();
    })

})




var condition = {
    New : "1000",
    NewOther: "1500",
    NewDefects : "1750",
    ManRefurbished : "2000",
    SellerRefurbished : "2500",
    Used              : "3000",
    VeryGood          : "4000",
    Good              : "5000",
    Acceptable        : "6000",
    Broken            : "7000"
};
var cellPhonesCatID = "9355";

/////////////////////////

//////   CONFIGS (Percentages in decimal)/////////
var ebayFee = .10;
var paypalFee = .029; //PLUS $0.30
var shippingFee = 7;
var commission = .15;



function exist(title, token){
    if(title.search(token) != -1)
        return true;
    return false;
}

function skipItem(title, tokens){
    var filtered = 0;
    for(i = 0; i<tokens.length; i++){
        filtered = title.search(tokens[i]);
        if(filtered != -1)
            return true;
    }
    return false;
}

// Parse the response and build an HTML table to display search results
function completedListingCallback(root) {
    var totalPrice = 0;
    var items = root.findCompletedItemsResponse[0].searchResult[0].item || [];
    var Html = [];
    var minPrice = 100000;
    var maxPrice = 0;
    var totalCount = 0;
        Html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');
    for (var i = 0; i < items.length; ++i) {
        var item     = items[i];
        var title    = item.title.toString();
        var pic      = item.galleryURL;
        var viewitem = item.viewItemURL;
        var price    = item.sellingStatus[0].currentPrice[0].__value__;

        //filter results to not include "4s" if searching for "4"
         if(exist(lookupVal,"4") && (!exist(lookupVal,"4s") && !exist(lookupVal,"4S"))){
            var tokens = ["4s", "4S"];
            if (skipItem(title, tokens)){
                console.log("SKIP: " +title);
                continue;
            }
        }
        //filter results to not include "5s" if searching for "5"
        if(exist(lookupVal,"5") && (!exist(lookupVal,"5s") && !exist(lookupVal,"5S") && !exist(lookupVal,"5c") && !exist(lookupVal,"5C"))){
            var tokens = ["5s", "5S", "5c", "5C"];
            if (skipItem(title, tokens)){
                console.log("SKIP: " + title);
                continue;
            }
        }

        price = Number(price);
        totalCount++;
        totalPrice+=price;
        console.log(title+ " price: "+ price);
        if(minPrice>price)
            minPrice = price;
        if(maxPrice<price)
            maxPrice = price;

        if (null != title && null != viewitem) {
            Html.push('<tr><td>' + '<h1>$'+price+'</h1>'+ '<img src="' + pic + '" border="0">' + '</td>' +
                '<td><a  href="' + viewitem + '" target="_blank">' + title + '</a></td></tr>');
        }
    }
    var averagePrice = totalPrice/totalCount;

    var grossVal = totalPrice/totalCount;
    var beforeProfitVal = grossVal - ((grossVal*ebayFee) +  (grossVal*paypalFee) + .3 + shippingFee);
    var profit = beforeProfitVal * commission;
    var finalVal = beforeProfitVal - (profit);
    console.log("GROSS " + grossVal);
    console.log("BEFORE PROFIT " + beforeProfitVal);
    console.log("VALUE " + finalVal);
    console.log("PROFIT " + profit);
    Html.push('</tbody></table>');
    $('#loaderImage').hide();
    $('#tester').show();
    $('#results').fadeIn('slow');
    $('#avgPrice').html('$'+averagePrice.toFixed(2));
    $('#results h2').show();
}

// Create a JavaScript array of the item filters you want to use in your request
var filterarray = [
    {"name" : "Condition",
      "value" : condition.Used
    },
    {"name" : "SoldItemsOnly",
      "value" : "true"
    }
];

// Define global variable for the URL filter
var urlfilter = "";

// Generates an indexed URL snippet from the array of item filters
function  buildURLArray() {
    // Iterate through each filter in the array
    for(var i=0; i<filterarray.length; i++) {
        //Index each item filter in filterarray
        var itemfilter = filterarray[i];
        // Iterate through each parameter in each item filter
        for(var index in itemfilter) {
            // Check to see if the paramter has a value (some don't)
            if (itemfilter[index] !== "") {
                if (itemfilter[index] instanceof Array) {
                    for(var r=0; r<itemfilter[index].length; r++) {
                        var value = itemfilter[index][r];
                        urlfilter += "&itemFilter\(" + i + "\)." + index + "\(" + r + "\)=" + value ;
                    }
                }
                else {
                    urlfilter += "&itemFilter\(" + i + "\)." + index + "=" + itemfilter[index];
                }
            }
        }
    }
}


function testER(){
    //console.log("URL FILTER: " + urlfilter);

    var test = encodeURIComponent(lookupVal);
   // console.log(test);
    var urlCompleted ="http://svcs.ebay.com/services/search/FindingService/v1";
    urlCompleted +="?OPERATION-NAME=findCompletedItems";
    urlCompleted +="&SERVICE-VERSION=1.0.0";
    urlCompleted +="&SECURITY-APPNAME=CameronL-742c-44db-a4c4-3b21f26ad5a6";
    urlCompleted += "&GLOBAL-ID=EBAY-US";
    urlCompleted +="&RESPONSE-DATA-FORMAT=JSON";
    urlCompleted += "&callback=completedListingCallback";
    urlCompleted +="&REST-PAYLOAD";
    urlCompleted +="&keywords=" + test;
    urlCompleted +="&categoryId=" + cellPhonesCatID;
    urlCompleted +="&paginationInput.entriesPerPage=100";
    urlCompleted += urlfilter;
    // Submit the request
    $(document).find('body').append('<script src="'+urlCompleted+'"></script>');
}