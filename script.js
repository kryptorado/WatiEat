

function createCard(mealOption, index){

    var cardHtml = "<div class=\"card\">\n" +
        "  <div class=\"card-image\">\n" +
        "    <figure class=\"image is-4by3\">\n" +
        "      <img src="+ mealOption.outlets[index].logo +" alt=\"Placeholder image\">\n" +
        "    </figure>\n" +
        "  </div>\n" +
        "  <div class=\"card-content\">\n" +
        "    <div class=\"media\">\n" +
        "      <div class=\"media-left\">\n" +
        "        <figure class=\"image is-48x48\">\n" +
        "          <img src=\"https://bulma.io/images/placeholders/96x96.png\" alt=\"Placeholder image\">\n" +
        "        </figure>\n" +
        "      </div>\n" +
        "      <div class=\"media-content\">\n" +
        "        <p class=\"title is-4\">John Smith</p>\n" +
        "        <p class=\"subtitle is-6\">@johnsmith</p>\n" +
        "      </div>\n" +
        "    </div>\n" +
        "\n" +
        "    <div class=\"content\">\n" +
        "      Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n" +
        "      Phasellus nec iaculis mauris. <a>@bulmaio</a>.\n" +
        "      <a href=\"#\">#css</a> <a href=\"#\">#responsive</a>\n" +
        "      <br>\n" +
        "      <time datetime=\"2016-1-1\">11:09 PM - 1 Jan 2016</time>\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>"
    return cardHtml;


}
$(document).ready(function(){
    // $.when(ajax1(), ajax2(), ajax3(), ajax4()).done(function(a1, a2, a3, a4){
    //     // the code here will be executed when all four ajax requests resolve.
    //     // a1, a2, a3 and a4 are lists of length 3 containing the response text,
    //     // status, and jqXHR object for each of the four ajax calls respectively.
    // });
    //
    //
        getRelevantOutlets("dinner", function(relevantOutlets){
        // console.log("yes"+relevantOutlets.outlets[0]);
            for(var i = 0; i<relevantOutlets.outlets.length; i++){
                var card = createCard(relevantOutlets, i);
                $('#breakfast').append(card); // insert the div you've just created

            }

    });
    // $(document).ajaxStop(function () {

    // });






    // $.ajax({url: "https://api.myjson.com/bins/1a7tf0",
    //     success: function(result){
    //         var dora = getFoodOptionsJSON(result, 'lunch');
    //         // console.log(dora[0].product_name);
    //         for(var i = 0; i<dora.length; i++){
    //             $('#WebDev').append("<div>"+dora[i].product_name+"</div>");
    //             console.log(dora[i].product_name);
    //         }
    //
    //         getRelevantOutlets("breakfast");
    //
    //
    //     }});
});

/*
$.ajax({
    url : "url",
    type : "GET or POST", // whichever you like
    contentType:"application/json",
    success : function(list)
    {
        var divCol  = "<div class='col-sm-4 col-md-4'>";
        var divWell = "<div class='well'>";
        var divClose= "</div>";

        list.forEach(function(obj, index) {

            var title     = "<h5>"      + obj.title    + "</h5>";
            var linkStart = "<a href='" + obj.filePath + "' target='_blank'>";
            var image     = "<img data-toggle='tooltip' data-placement='left' title='Click to open data' src='" + obj.imagePath + "' height='100%' width='100%'/>"
            var linkEnd   = "</a>";

            var div = divCol    +
                divWell     +
                title       +
                linkStart       +
                image       +
                linkEnd +
                divClose +
                divClose;

            $('.col-sm-12').append(div); // insert the div you've just created

        })
    }
});

*/


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
            console.log("i added the outets");
            console.log("proof"+relevantOutlets.outlets[0]);
            callback(relevantOutlets);
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