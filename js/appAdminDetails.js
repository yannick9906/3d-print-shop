/**
 * Created by yanni on 02.05.2016.
 */
var currDetail = 0;

function showDetail(oid) {
    lastmode = mode;
    mode = "details";
    autoUpdate = false;
    currDetail = oid;
    $("#menu-back").fadeIn();
    $("#menu-norm").fadeOut();
    $("#detail_img").attr("src", "http://www.the-irf.com/assets/content/animation/loading2.gif");
    $("#detail_img").css("padding", "30%");
    $("#userSettings").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        $("#showDetail").fadeIn("fast");
        $.getJSON("orders.php?action=orderDetails&oID="+oid, null, function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else {
                $(".detail-title").html(data["order"]["order_name"]);
                $("#detail-content").html(data["order"]["comment"]);
                $("#detail-state").html(data["order"]["statetext"]);
                $("#detail-precision").html(data["order"]["precision"]);
                $("#detail-color").html(data["order"]["filamentcolorname"]);
                $("#detail-weight").html(data["order"]["material_weight"]);
                $("#detail-printtime").html(data["order"]["printtime"]);
                $("#detail-date-created").html(data["order"]["date_created"]);
                $("#detail-date-confirmed").html(data["order"]["date_confirmed"]);
                $("#detail-date-completed").html(data["order"]["date_completed"]);
                $("#detail-material-cost").html(data["order"]["material_price"]);
                $("#detail-energy-cost").html(data["order"]["energy_price"]);
                $("#detail-length").html(data["order"]["material_length"]);
                $("#detail-per-kg").html(data["order"]["filamentprice"]);
                $("#detail-total-cost").html(data["order"]["complete_price"]);
                $("#detail-additional-cost").html(data["order"]["fix_price"]);
                setButtonsForState(parseInt(data["order"]["state"]));
                var link = data["order"]["order_link"];
                if (link.contains("thingiverse")) {
                    detail_link = $("#detail_link");
                    detail_link.html("Thingiverse");
                    detail_link.attr("href", link);
                    $.getJSON("orders.php?action=getThingiverseImg", {link: link}, function (data) {
                        if (data["error"] == "NoLogin") window.location.href = "appLogin.html";
                        else {
                            $("#detail_img").fadeOut(400, function () {
                                $("#detail_img").attr("src", data["link"]).css("padding", "0");
                            }).fadeIn(400);
                        }
                    });
                } else {
                    $("#detail_img").attr("src", "http://www.lazerhorse.org/wp-content/uploads/2013/08/3D-Printing-Fail-Beautiful-Error.jpg");
                    $("#detail_img").css("padding", "0");
                    detail_link = $("#detail_link");
                    detail_link.html("Link zum Objekt");
                    detail_link.attr("href", link);
                }
            }
        });
    });
}

function showAdmDetails(oid) {

}

function setButtonsForState(state) {
    console.log(state);
    switch(state) {
        case -2:
            setButton(1, 0, 1, 0, 0);
            break;
        case -1:
            setButton(1, 0, 1, 0, 0);
            break;
        case 0:
            setButton(1, 0, 0, 0, 0);
            break;
        case 1:
            setButton(1, 1, 1, 0, 0);
            break;
        case 2:
            setButton(0, 0, 1, 0, 0);
            break;
        case 3:
            setButton(0, 0, 1, 0, 0);
            break;
        case 4:
            setButton(0, 0, 1, 0, 0);
            break;
        case 5:
            setButton(0, 0, 1, 1, 1);
            break;
        case 6:
            setButton(1, 0, 1, 0, 1);
            break;
        case 7:
            setButton(0, 0, 1, 0, 1);
            break;
        case 8:
            setButton(0, 0, 1, 0, 0);
            break;
    }
}

function setButton(deleteBtn, order, reorder, arrived, warranty) {
    if(deleteBtn == 1) $("#btn-delete").show();   else $("#btn-delete").hide();
    if(order == 1)     $("#btn-order").show();    else $("#btn-order").hide();
    if(reorder == 1)   $("#btn-reorder").show();  else $("#btn-reorder").hide();
    if(arrived == 1)   $("#btn-arrived").show();  else $("#btn-arrived").hide();
    if(warranty == 1)  $("#btn-warranty").show(); else $("#btn-warranty").hide();
}

function runAction(action) {
    $.getJSON("orders.php?action=completeOrderAction&oID="+currDetail+"&todo="+action, null, function (data) {
        if (data["error"] == "NoLogin") window.location.href = "appLogin.html";
        else if(data["success"]) {
            if(action == "order") {
                Materialize.toast("Bestellt.", 1000, "green");
                showDetail(currDetail);
            } else if(action == "arrived") {
                Materialize.toast("Zustellung angenommen.", 1000, "green");
                showDetail(currDetail);
            } else if(action == "warranty") {
                Materialize.toast("Garantie beansprucht.", 1000, "orange");
                showDetail(currDetail);
            } else if(action == "delete") {
                Materialize.toast("Gelöscht", 1000, "red");
                toNew();
            } else if(action == "reorder") {
                Materialize.toast("Bestellung erneut bestellt", 1000, "green");
                toNew();
            } else {
                Materialize.toast("Keine Aktion ausgeführt", 1000, "red");
            }
        } else {
            Materialize.toast("Es ist ein Fehler aufgetreten<br/>das tut uns leid :/", 3000, "red");
        }
    });
}

function arrived() {
    runAction("arrived");
}

function orderCurr() {
    runAction("order");
}

function reorderCurr() {
    runAction("reorder");
}

function warranty() {
    runAction("warranty");
}

function deleteCurr() {
    runAction("delete");
}