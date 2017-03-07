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
                for(let i = 0; i < data["orders"].length; i++) {
                    let element = data["orders"][i]

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
                for(let i = 0; i < data["orders"].length; i++) {
                    let element = data["orders"][i]

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
                }
                oldData = data;
            }
            $("#loading").fadeOut(100);
        });
    } else if(mode == "AllOrders") {
        $.getJSON("orders.php?action=getAllOrders",null,function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#loading").fadeIn(100);
                $("#orders").html("");
                for(let i = 0; i < data["orders"].length; i++) {
                    let element = data["orders"][i]

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
                        let html = listTmpltMore(element);
                        $("#orders").append(html);
                    }
                }
                oldData = data;
            }
            $("#loading").fadeOut(100);
        });
    } else if(mode == "AllNewOrders") {
        $.getJSON("orders.php?action=getAllNewOrders",null,function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#orders").html("");
                $("#loading").fadeIn(100);
                for(let i = 0; i < data["orders"].length; i++) {
                    let element = data["orders"][i]

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
                        let html = listTmpltMore(element);
                        $("#orders").append(html);
                    }
                }
                oldData = data;
            }
            $("#loading").fadeOut(100);
        });
    } else if(mode == "Filas") {
        $.getJSON("filaments.php?action=getAllFilaments",null,function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#orders").html("");
                $("#loading").fadeIn(100);
                for(let i = 0; i < data["filaments"].length; i++) {
                    let element = data["filaments"][i]

                    if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                    else {
                        html = filaListTmplt(element);
                        $("#orders").append(html);
                    }
                }
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
    window.setTimeout("updateSchedueler()", 3000);
}