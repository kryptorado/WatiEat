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

$(document).ready(function(){
    $.ajax({url: "https://api.uwaterloo.ca/v2/foodservices/2018/50/menu.json?key=ee79aceeb4e113659b786393ea153b35",
        success: function(result){
            var dora = getFoodOptionsJSON(result, 'lunch');
            // console.log(dora[0].product_name);
            for(var i = 0; i<dora.length; i++){
                $('#menu').append("<p>"+dora[i].product_name+"</p>");
                console.log(dora[i].product_name);
            }


        }});
});
