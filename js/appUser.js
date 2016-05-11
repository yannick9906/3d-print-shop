/**
 * Created by yanni on 28.04.2016.
 */
var listTmplt;
var filaTmplt;
var mode = "NewOrders";
var lastmode = "NewOrders";
var autoUpdate = true;
var oldData;

$(document).ready(function () {
     filaTmplt = Handlebars.compile(`
        <option value='{{fID}}' class="circle left" data-icon="../new/pics/{{filamentcolorcode}}-1.png">{{price}} €/kg - {{filamentcolorname}}</option>
     `);
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

function toOlds() {
    lastmode = mode;
    mode = "OldOrders";
    autoUpdate = true;
    $("#sidenav-olds").addClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#menu-back").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
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
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#lists").fadeIn("fast");
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
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();

    $("#new").fadeOut("fast");
    $("#showDetail").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        update();
        $("#userSettings").fadeIn("fast");

        $.getJSON("users.php?action=getOwnUserData", null, function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else {
                var user = data["user"];
                $("#usrname").val(user["usrname"]);
                $("#realname").val(user["realname"]);
                $("#email").val(user["email"]);
                $("#recv-emails").prop("checked", user["emails"]);

                Materialize.updateTextFields();
            }
        });
    });
}

function toNewOrder() {
    lastmode = mode;
    mode = "NewOrder";
    autoUpdate = false;
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#menu-back").fadeIn();
    $("#menu-back-d").fadeIn();
    $("#menu-norm").fadeOut();
    $("#newOrderBtn").fadeOut();

    $("#userSettings").fadeOut("fast");
    $("#showDetail").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        update();
        $("#new").fadeIn("fast");

        $.getJSON("orders.php?action=getFilaments", null, function(data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else {
                var filaments = data["filaments"];
                console.log(data);
                $("#neworderfilament").html("<option value='' disabled selected>Wähle ein Material</option>");
                filaments.forEach(function (element, index, array) {
                    $("#neworderfilament").append(filaTmplt(element));
                });
                Materialize.updateTextFields();
                $('select').material_select();
            }
        });
    });
}

function toLogout() {
    window.location.href = "appLogin.html#Logout";
}

function back() {
    if(mode == "NewOrder") $("#newOrderBtn").fadeIn();

    if(lastmode == "UserSettings") {
        toUserSettings();
    } else if(lastmode == "NewOrders") {
        toNew();
    } else {
        toOlds();
    }
}