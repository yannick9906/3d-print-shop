/**
 * Created by yanni on 28.04.2016.
 */
let listTmplt;
let filaTmplt;
let mode = "NewOrders";
let lastmode = "NewOrders";
let autoUpdate = true;
let oldData;

$(document).ready(function () {
     filaTmplt = Handlebars.compile(`
        <option value='{{fID}}' class="circle left" data-icon="../new/pics/{{filamentcolorcode}}-1.png">{{price}} €/kg - {{filamentcolorname}}</option>
     `);
     listTmplt = Handlebars.compile(`
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-image" style="max-width: 35%; width: 35%;">
                    <img id="pic{{oID}}" src="{{pic}}">
                </div>
                <div class="card-stacked">
                    <div class="card-content">
                        <span class="orange-text text-darken-2" style="font-size: 16px;"><b>{{order_name}}</b></span>
                        <span class="grey-text text-darken-1 light-bold right" style="font-size: 22px; vertical-align: top; line-height: 26px;">{{complete_price}}<i class="mddi mddi-currency-eur"></i></span>
                        <p style="margin-top: 5px;">
                            <i class="mddi mddi-altimeter grey-text text-darken-1"></i> <b>Schichtdicke:</b> 0,{{precision}} mm<span class="bg badge {{statecolor}}">{{statetext}}</span><br/>
                            <i class="mddi mddi-format-color-fill grey-text text-darken-1"></i> <b>Material:</b> {{filamentcolorname}}<br/>
                            <i class="mddi mddi-weight grey-text text-darken-1"></i> <b>Gewicht:</b> {{material_weight}} g<br/>
                            <i class="mddi mddi-clock-out  grey-text text-darken-1"></i> <b>Angenommen am</b> {{date_confirmed}}<br/>
                            <i class="mddi mddi-clock-fast grey-text text-darken-1"></i> <b>Voraus. fertig am</b> {{date_completed}}<br/>
                        </p>
                        {{{printing}}}
                    </div>
                    <div class="card-action">
                        <a href="#" onclick="showDetail({{oID}})">
                            <i class="mddi mddi-information-outline"></i> Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `);
    $("#menu-back-d").hide();
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
    $("#newOrderBtn").fadeIn();
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
    $("#newOrderBtn").fadeIn();
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
                let user = data["user"];
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
                let filaments = data["filaments"];
                console.log(data);
                $("#neworderfilament").html("<option value='' disabled selected>Wähle ein Material</option>");
                for(let i = 0; i < filaments.length; i++) {
                    let element = filaments[i]
                    $("#neworderfilament").append(filaTmplt(element));
                }
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