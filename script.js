

function createCard(mealOption, index){

    var cardHtml =
        "<div class=\"column is-narrow \"style=\"width: 350px\">\n" +
        // "<div class=\"box\" style=\"width: 200px\">\n" +

        "<div class=\"card \">\n" +
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
        "           <span class=\"icon is-small\"><i class=\"far fa-building\" aria-hidden=\"true\"></i></span>\n" +
        ""+mealOption.outlets[index].building+"</p>\n" +
        "      </div>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"content\">\n" + mealOption.outlets[index].description + "<a>@bulmaio</a>.\n"+
        "      <a href=\"#\">#css</a> <a href=\"#\">#responsive</a>\n" +
        "      <br>\n" +
        "      <time datetime=\"2016-1-1\">11:09 PM - 1 Jan 2016</time>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>"+
        "</div>";

    return cardHtml;
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

$(document).ready(function(){

    createAndAppendCards('breakfast');
    createAndAppendCards('lunch');
    createAndAppendCards('dinner');


});



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