var outletNames = [];
$(document).ready(function(){
    createAndAppendCards('breakfast');
    createAndAppendCards('lunch');
    createAndAppendCards('dinner');
    getMenuOptions(3);






});

function getMenuOptions(date){
    //every time this fct runs, it should find all food options for outlets that are displayed and inject appropritate

    $.ajax({
        url: 'https://api.myjson.com/bins/rzygk',
        success: function(result){



            var test = $('#dateSelect').val();
            if(test == ""){
                var requestedMenu = getFoodOptionsJSON(result, 'lunch', "2019-01-08");
                for(var i = 0; i<requestedMenu.length; i++){
                    console.log(requestedMenu[i]);
                }
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
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate()-2);
    return date;
}

function getFoodOptionsJSON(result, type, date){
    var testObj = {};
    var options = [];
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
                        options.push(mealType.value[k].product_name +" ("+outletName.value + ")");

                    }
                }
            }

    }
    displayMenu(options);
    return options;
}

function displayMenu(options){

        for (var i = 0; i < options.length; i++) {
            $( "#myDIV" ).append( $( "<p>"+options[i]+"</p>" ) );
        }

}

function getRelevantOutlets(type, callback){

    $.ajax({
        url: 'https://api.myjson.com/bins/fk7h8',
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
    // var lol = '#'+type;
    // $(lol).style.display="block";


}