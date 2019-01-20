var options = [];
var test;
$(document).ready(function(){
    createAndAppendCards('breakfast');
    createAndAppendCards('lunch');
    createAndAppendCards('dinner');
    getMenuOptions(getCurrentDate());

});

function getMenuOptions(date){
    var additionalZeroDay = "";
    var additionalZeroMonth = ""
    if(date.getDate()<10){
        additionalZeroDay = "0";
    }
    if(date.getMonth()+1 < 10){
        additionalZeroMonth = "0";
    }
    var today = date.getFullYear()+'-'+additionalZeroMonth+(date.getMonth()+1)+'-'+additionalZeroDay+(date.getDate());
    var delayInMilliseconds = 1000; //1 second

    $.ajax({
        url: 'https://api.uwaterloo.ca/v2/foodservices/'+ date.getFullYear() +'/'+ (date.getWeek()+1) +'/menu.json?key=YOUR-API-KEY-HERE',
        success: function(result){
            console.log('https://api.uwaterloo.ca/v2/foodservices/'+ date.getFullYear() +'/'+ (date.getWeek()) +'/menu.json?key=YOUR-API-KEY-HERE');
            console.log(today);
            test = $('#dateSelect').val();
            $( "#myDIV" ).append( $( '<b><b></b>'+today+' options: </b> </p>' ) );

            if(test == ""){
                var requestedMenu = getFoodOptionsJSON(result, 'lunch', today);

            }

            else{
                var selectedDate= convertDateFormat(("menuSelect").val());
                var requestedMenu = getFoodOptionsJSON(result, 'lunch', selectedDate);
                for(var i = 0; i<requestedMenu.length; i++){
                    console.log(requestedMenu[i]);
                }
            }

        }
    });

}

function convertDateFormat(dateToBeFormatted){
    var reg = /(?:[^\/\n]|\/\/)+/.exec(dateToBeFormatted);
    var newDate = reg[2]+"-"+reg[1]+"-"+reg[0];
    return newDate;
}



function filterDescription(description){
    var arr = /Location:\s*([^\v]*)\s*Features:\s*([^\v]*)Payment accepted:([^\r\n]*)/.exec(description);

    try{
        var outletInfo = {
            "location": arr[1].replace(/(&nbsp;|<br>|<br \/>)/g, ''),
            "features": arr[2].replace(/(&nbsp;|<br>|<br \/>)/g, ''),
            "payment": arr[3].replace(/(&nbsp;|<br>|<br \/>)/g, '')
        };
    }
    catch(err){
        console.log("The description text has problems");
    }
    return outletInfo;
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function createCard(mealOption, index){
    var description = filterDescription(mealOption.outlets[index].description);
    if(!isEmpty(description)){
        const upperCasedDescription = description.features.charAt(0).toUpperCase() + description.features.substr(1, description.features.length);
        // outletNames.push(mealOption.outlets[index].outlet_name);

        var cardHtml =
            "<div class=\"column is-narrow \"style=\"width:350px\">\n" +
            "<div class=\"card \" id=\"#"+mealOption.outlets[index].outlet_name+"\">\n" +
            "  <div class=\"card-image is-flex is-horizontal-center\">\n" +
            "    <figure class=\"image is-128x128\">\n" +
            "      <img src="+ mealOption.outlets[index].logo +" alt=\"Placeholder image\">\n" +
            "    </figure>\n" +
            "  </div>\n" +
            "  <div class=\"card-content \">\n" +
            "    <div class=\"media\">\n" +
            "      <div class=\"media-content\">\n" +
            "        <p class=\"title is-4\">"+mealOption.outlets[index].outlet_name+"</p>\n" +
            "        <p class=\"subtitle is-6\">" +
            "           <span  class=\"icon is-small\" title ='"+description.location+"'><i  class=\"far fa-building\" aria-hidden=\"true\"></i></span>\n" +
            ""+mealOption.outlets[index].building+"</p>\n" +
            "      </div>\n" +
            "    </div>\n" +
            "\n" +
            "    <div class=\"content\">\n" + upperCasedDescription + "\n"+
            "      <a href=\"#\">#css</a> <a href=\"#\">#responsive</a>\n" +
            "      <br>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</div>"+
            "</div>";
        return cardHtml;
    }

}


function createAndAppendCards(type){
    getRelevantOutlets(type, function(relevantOutlets){
        var selector = '#'+type;
        for(var i = 0; i<relevantOutlets.outlets.length; i++){
            var card = createCard(relevantOutlets, i);
            $(selector).append(card); // insert the div you've just created
        }
    });
}


function getCurrentDate(){
    var today = new Date();
    console.log("hi");
    return today;
}

function getFoodOptionsJSON(result, type, date){
     options = [];
    console.log(result);
    for(var i = 0; i<result.data.outlets.length; i++){
        var obj0 = result.data.outlets[i];
        const outletName = Object.getOwnPropertyDescriptor(obj0, 'outlet_name');
        options["outlet_name"] = outletName.value;

            for(var j = 0; j<result.data.outlets[i].menu.length; j++) {
                var obj = result.data.outlets[i].menu[j];
                const menuDate = Object.getOwnPropertyDescriptor(obj, 'date');

                if (menuDate.value === date) {
                    var obj2 = result.data.outlets[i].menu[j].meals;
                    const mealType = Object.getOwnPropertyDescriptor(obj2, type);

                    for (var k = 0; k < result.data.outlets[i].menu[j].meals.lunch.length; k++) {
                        // console.log(mealType.value[k].product_name +" ("+outletName.value + ")");
                        displayMenu(mealType.value[k].product_name +" ("+outletName.value + ")");
                        // options.push(mealType.value[k].product_name +" ("+outletName.value + ")");

                    }
                }
            }

    }
    return options;
}

function displayMenu(options){
    $( "#myDIV" ).append( $( "<p>"+options+"</p>" ) );
}

function getRelevantOutlets(type, callback){

    $.ajax({
        url: 'https://
        
        
        .myjson.com/bins/fk7h8',
        success: function(result){
            var outletInfo = [];
            for(var i = 0, j=0; i<result.data.length; i++){
                var outlet = result.data[i];
                var compare = "has_"+type;
                if(result.data[i][compare]){
                    outletInfo[j++] = outlet.outlet_id;
                }
            }
            return getAdditionalOutletInfo(outletInfo, callback);
        }
    });
}

function getAdditionalOutletInfo(outletInfo, callback){
    $.ajax({url: 'https://api.myjson.com/bins/edc9o',
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
            callback(relevantOutlets);
            return relevantOutlets;
        }
    });
}


function openTab(evt, tabName, type) {
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


Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}
