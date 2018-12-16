
function getCurrentDate(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-2);
    return date;
}

function getFoodOptionsJSON(result, type){
    var options = [];
    for(var i = 0; i<result.data.outlets.length; i++){
        for(var j = 0; j<result.data.outlets[i].menu.length; j++){
            var obj = result.data.outlets[i].menu[j];
            const menuDate = Object.getOwnPropertyDescriptor(obj, 'date');

            if(menuDate.value === getCurrentDate()){
                var obj2 = result.data.outlets[i].menu[j].meals;
                const menuDate2 = Object.getOwnPropertyDescriptor(obj2, type);

                for(var k = 0; k<result.data.outlets[i].menu[j].meals.lunch.length; k++){
                    options.push(menuDate2.value[k]);
                }
            }
        }
    }
    return options;
}

function getRelevantOutlets(type){

    $.ajax({
        url: 'http://api.uwaterloo.ca/v2/foodservices/outlets.json?key=ee79aceeb4e113659b786393ea153b35',
        success: function(result){
            var outletInfo = [];

            for(var i = 0, j=0; i<result.data.length; i++){
                var outlet = result.data[i];
                var compare = "has_"+type;
                if(result.data[i][compare]){
                    outletInfo[j++] = outlet.outlet_id;
                }

            }

            return getAdditionalOutletInfo(outletInfo);

        }
    });
}

function getAdditionalOutletInfo(outletInfo){
    $.ajax({url: 'https://api.uwaterloo.ca/v2/foodservices/locations.json?key=ee79aceeb4e113659b786393ea153b35',
        success: function(result){
        var relevantOutlets = {
            outlets: []
        };
        for(var i = 0; i<result.data.length; i++){
            for(var j = 0; j<outletInfo.length; j++){
                if(result.data[i].outlet_id === outletInfo[j]){
                    relevantOutlets.outlets.push(result.data[i])
                }
            }
        }
        console.log(relevantOutlets);
        return relevantOutlets;
    }
    });
}


function openTab(evt, tabName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("content-tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" is-active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " is-active";
}


$(document).ready(function(){
    $.ajax({url: "https://api.myjson.com/bins/1a7tf0",
        success: function(result){
            var dora = getFoodOptionsJSON(result, 'lunch');
            // console.log(dora[0].product_name);
            for(var i = 0; i<dora.length; i++){
                $('#WebDev').append("<div>"+dora[i].product_name+"</div>");
                console.log(dora[i].product_name);
            }

            getRelevantOutlets("breakfast");


        }});
});
