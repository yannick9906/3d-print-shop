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
                        let link = element.order_pic;
                        let todisplay = "";
                        if(link.toLowerCase().contains(".png") || link.toLowerCase().contains(".jpg") || link.toLowerCase().contains(".jpeg")) {
                            todisplay = link;
                        } else {
                            todisplay = "https://www.lazerhorse.org/wp-content/uploads/2013/08/3D-Printing-Fail-Beautiful-Error.jpg"
                        }
                        element.pic = todisplay;
                        let html = listTmplt(element);
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
                        let link = element.order_pic;
                        let todisplay = "";
                        if(link.toLowerCase().contains(".png") || link.toLowerCase().contains(".jpg") || link.toLowerCase().contains(".jpeg")) {
                            todisplay = link;
                        } else {
                            todisplay = "https://www.lazerhorse.org/wp-content/uploads/2013/08/3D-Printing-Fail-Beautiful-Error.jpg"
                        }
                        element.pic = todisplay;
                        let html = listTmplt(element);
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