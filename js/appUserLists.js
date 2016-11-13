/**
 * Created by yanni on 02.05.2016.
 */

function update() {
    if(mode == "NewOrders") {
        $.getJSON("orders.php?action=getOwnOrders",null,function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#loading").fadeIn(100);
                $("#orders").html("");
                data["orders"].forEach(function (element, index, array) {
                    if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                    else {
                        html = listTmplt(element);
                        $("#orders").append(html);
                    }
                });
                oldData = data;
            }
            $("#loading").fadeOut(100);
        });
    } else if(mode == "OldOrders") {
        $.getJSON("orders.php?action=getOwnOldOrders",null,function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#loading").fadeIn(100);
                $("#orders").html("");
                data["orders"].forEach(function (element, index, array) {
                    if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                    else {
                        html = listTmplt(element);
                        $("#orders").append(html);
                    }
                });
                oldData = data;
            }
            $("#loading").fadeOut(100);
        });
    }
}

function updateSchedueler() {
    if(autoUpdate == true) {
        update();
    }
    window.setTimeout("updateSchedueler()", 2500);
}