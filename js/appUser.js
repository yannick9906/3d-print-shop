/**
 * Created by yanni on 28.04.2016.
 */
var listTmplt;
var mode = "NewOrders";
var lastmode = "NewOrders";
var autoUpdate = true;
var oldData;

$(document).ready(function () {
     listTmplt = Handlebars.compile(`
        <ul class="{{style}}">
            <li class="collection-item avatar {{style2}}">
                <i class="circle mddi mddi-{{{stateicon}}} {{statecolor}}"></i>
                <span class="title"><b>{{order_name}}</b></span>
                <p>
                    <i class="mddi mddi-altimeter grey-text text-darken-1"></i> 0,{{precision}} mm<br/><span class="bg badge {{statecolor}}">{{statetext}}</span>
                    <i class="mddi mddi-format-color-fill grey-text text-darken-1"></i> {{filamentcolorname}}<br/>
                    <i class="mddi mddi-weight grey-text text-darken-1"></i> {{material_weight}} g<br/>
                    <i class="mddi mddi-clock-out  grey-text text-darken-1"></i> {{date_confirmed}}<br/>
                    <i class="mddi mddi-clock-fast grey-text text-darken-1"></i> {{date_completed}}<br/>
                </p>
                <span class="secondary-content">
                    <a href="#" onclick="showDetail({{oID}})">
                        <i class="mddi mddi-information-outline grey-text text-darken-1"></i>
                    </a>
                    <span class="grey-text text-darken-1 light-bold" style="font-size: 22px; vertical-align: top; line-height: 26px;">{{complete_price}}<i class="mddi mddi-currency-eur"></i></span>
                </span>
                {{printing}}
            </li>
        </ul>
    `);
    String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
    updateSchedueler();
});

function update() {
    if(mode == "NewOrders") {
        $.getJSON("orders.php?action=getOwnOrders",null,function(data) {
            if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#orders").html("");
                data["orders"].forEach(function (element, index, array) {
                    html = listTmplt(element);
                    $("#orders").append(html);
                });
                oldData = data;
            }
        });
    } else if(mode == "OldOrders") {
        $.getJSON("orders.php?action=getOwnOldOrders",null,function(data) {
            if(!(JSON.stringify(oldData) == JSON.stringify(data))) {
                $("#orders").html("");
                data["orders"].forEach(function (element, index, array) {
                    html = listTmplt(element);
                    $("#orders").append(html);
                });
                oldData = data;
            }
        });
    }
}

function updateSchedueler() {
    if(autoUpdate == true) {
        update();
    }
    window.setTimeout("updateSchedueler()", 1000);
}

function toOlds() {
    lastmode = mode;
    mode = "OldOrders";
    autoUpdate = true;
    $("#sidenav-olds").addClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#menu-back").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#lists").fadeIn("fast");
    });
}

function toNew() {
    lastmode = mode;
    mode = "NewOrders";
    autoUpdate = true;
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").addClass("active");
    $("#sidenav-account").removeClass("active");
    $("#menu-back").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#lists").fadeIn("fast");
    });
}

function showDetail(oid) {
    lastmode = mode;
    mode = "details";
    autoUpdate = false;
    $("#menu-back").fadeIn();
    $("#menu-norm").fadeOut();
    $("#detail_img").attr("src", "http://www.the-irf.com/assets/content/animation/loading2.gif");
    $("#detail_img").css("padding", "30%");
    $("#userSettings").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        $("#showDetail").fadeIn("fast");
        $.getJSON("orders.php?action=orderDetails&oID="+oid, null, function(data) {
            $(".detail-title")         .html(data["order"]["order_name"]);
            $("#detail-content")       .html(data["order"]["comment"]);
            $("#detail-state")         .html(data["order"]["statetext"]);
            $("#detail-precision")     .html(data["order"]["precision"]);
            $("#detail-color")         .html(data["order"]["filamentcolorname"]);
            $("#detail-weight")        .html(data["order"]["material_weight"]);
            $("#detail-printtime")     .html(data["order"]["printtime"]);
            $("#detail-date-created")  .html(data["order"]["date_created"]);
            $("#detail-date-confirmed").html(data["order"]["date_confirmed"]);
            $("#detail-date-completed").html(data["order"]["date_completed"]);
            $("#detail-material-cost") .html(data["order"]["material_price"]);
            $("#detail-energy-cost")   .html(data["order"]["energy_price"]);
            $("#detail-length")        .html(data["order"]["material_length"]);
            $("#detail-per-kg")        .html(data["order"]["filamentprice"]);
            $("#detail-total-cost")    .html(data["order"]["complete_price"]);
            setButtonsForState(parseInt(data["order"]["state"]));
            var link = data["order"]["order_link"];
            if(link.contains("thingiverse")) {
                detail_link = $("#detail_link");
                detail_link.html("Thingiverse");
                detail_link.attr("href", link);
                $.getJSON("orders.php?action=getThingiverseImg", {link: link}, function(data) {
                    $("#detail_img").fadeOut(400, function() {
                        $("#detail_img").attr("src", data["link"]).css("padding", "0");
                    }).fadeIn(400);
                });
            } else {
                $("#detail_img").attr("src", "http://www.lazerhorse.org/wp-content/uploads/2013/08/3D-Printing-Fail-Beautiful-Error.jpg");
                $("#detail_img").css("padding", "0");
                detail_link = $("#detail_link");
                detail_link.html("Link zum Objekt");
                detail_link.attr("href", link);
            }
        });
    });
}

function toUserSettings() {
    lastmode = mode;
    mode = "UserSettings";
    autoUpdate = false;
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").addClass("active");
    $("#menu-back").fadeOut();
    $("#menu-norm").fadeIn();

    $("#showDetail").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        update();
        $("#userSettings").fadeIn("fast");
        
        $.getJSON("users.php?action=getOwnUserData", null, function(data) {
            var user = data["user"];
            $("#usrname").val(user["usrname"]);
            $("#realname").val(user["realname"]);
            $("#email").val(user["email"]);
            $("#recv-emails").prop("checked", user["emails"]);

            Materialize.updateTextFields();
        });
    });
}

function back() {
    if(lastmode == "UserSettings") {
        toUserSettings();
    } else if(lastmode == "NewOrders") {
        toNew();
    } else {
        toOlds();
    }
}

function updatePasswd() {
    var passwd1  = $("#passwd1").val();
    var passwd2  = $("#passwd2").val();

    if(passwd1 == passwd2) {
        var passwd = md5(passwd1);
        data = {
            passwd: passwd
        };
        $.post("users.php?action=updatePass", data, function(data) {
            data = JSON.parse(data);
            if(data["success"] == true) {
                Materialize.toast("Gespeichert", 2000, "green");
                toUserSettings();
            } else if(data["errorcode"] == 2) {
                Materialize.toast('Es müssen alle Felder ausgefüllt sein', 2000, 'red');
            } else {
                Materialize.toast('Es ist ein Fehler aufgetreten. Das tut uns leid :/', 2000, 'red');
            }
        });
    } else {
        Materialize.toast('Die Passwörter stimmen nicht überein', 2000, 'red');
    }
}

function updateEmail() {
    var email  = $("#email").val();
    var emails = $("#recv-emails").is(":checked");

        data = {
            email: email,
            emails: emails
        };
        $.post("users.php?action=updateEmail", data, function(data) {
            data = JSON.parse(data);
            if(data["success"] == true) {
                Materialize.toast("Gespeichert", 2000, "green");
                toUserSettings();
            } else if(data["errorcode"] == 2) {
                Materialize.toast('Es müssen alle Felder ausgefüllt sein', 2000, 'red');
            } else {
                Materialize.toast('Es ist ein Fehler aufgetreten. Das tut uns leid :/', 2000, 'red');
            }
        });
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
            setButton(1, 0, 1, 0, 0);
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