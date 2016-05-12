/**
 * Created by yanni on 28.04.2016.
 */
var listTmplt;
var listTmpltMore;
var filaTmplt;
var filaListTmplt;
var mode = "AllNewOrders";
var lastmode = "AllNewOrders";
var autoUpdate = true;
var oldData;

$(document).ready(function () {
    filaTmplt = Handlebars.compile(`
        <option value='{{fID}}' class="circle left" data-icon="../new/pics/{{filamentcolorcode}}-1.png">{{price}} €/kg - {{filamentcolorname}}</option>
     `);
    filaListTmplt = Handlebars.compile(`
            <ul class="{{style}}">
                <li class="collection-item avatar {{style2}}">
                    <i class="circle mddi mddi-format-color-fill " style="background-color: #{{{filamentcolorcode}}};"></i>
                    <span class="title"><b>{{filamentcolorname}}</b></span>
                    <p>
                        <i class="mddi mddi-format-color-fill grey-text text-darken-1"></i> {{filamentcolorcode}}<br/>
                        <i class="mddi mddi-altimeter grey-text text-darken-1"></i> {{diameter}} mm<br/><span class="bg badge {{statecolor}}">{{statetext}}</span>
                    </p>
                    <span class="secondary-content">
                        <a href="#" onclick="showFila({{fID}})">
                            <i class="mddi mddi-information-outline grey-text text-darken-1"></i>
                        </a>
                        <span class="grey-text text-darken-1 light-bold" style="font-size: 22px; vertical-align: top; line-height: 26px;">{{price}}<i class="mddi mddi-currency-eur"></i></span>
                    </span>
                    {{{printing}}}
                </li>
            </ul>
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
                {{{printing}}}
            </li>
        </ul>
    `);
    listTmpltMore = Handlebars.compile(`
        <ul class="{{style}}">
            <li class="collection-item avatar {{style2}}">
                <i class="circle mddi mddi-{{{stateicon}}} {{statecolor}}"></i>
                <span class="title"><b>{{order_name}}</b></span>
                <p>
                    <i class="mddi mddi-account grey-text text-darken-1"></i> {{realname}} <br/><span class="bg badge {{statecolor}}">{{statetext}}</span>
                    <i class="mddi mddi-altimeter grey-text text-darken-1"></i> 0,{{precision}} mm<br/>
                    <i class="mddi mddi-format-color-fill grey-text text-darken-1"></i> {{filamentcolorname}}<br/>
                    <i class="mddi mddi-weight grey-text text-darken-1"></i> {{material_weight}} g<br/>
                    <i class="mddi mddi-clock-out  grey-text text-darken-1"></i> {{date_confirmed}}<br/>
                    <i class="mddi mddi-clock-fast grey-text text-darken-1"></i> {{date_completed}}<br/>
                </p>
                <span class="secondary-content">
                    <a href="#" onclick="showAdmDetail({{oID}})">
                        <i class="mddi mddi-information-outline grey-text text-darken-1"></i>
                    </a>
                    <span class="grey-text text-darken-1 light-bold" style="font-size: 22px; vertical-align: top; line-height: 26px;">{{complete_price}}<i class="mddi mddi-currency-eur"></i></span>
                </span>
                {{{printing}}}
            </li>
        </ul>
    `);
    String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
    updateSchedueler();
});

function toOlds() {
    oldData = [];
    lastmode = mode;
    mode = "OldOrders";
    autoUpdate = true;
    startFade();
    $("#sidenav-olds").addClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-allolds").removeClass("active");
    $("#sidenav-allnew").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#sidenav-filas").removeClass("active");
    $("#menu-back").fadeOut();
    $("#newFilaBtn").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#filaDetail").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#newOrderBtn").fadeIn();
        $("#lists").fadeIn("fast", endFade());
    });
}

function toNew() {
    oldData = [];
    lastmode = mode;
    mode = "NewOrders";
    autoUpdate = true;
    startFade();
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").addClass("active");
    $("#sidenav-allolds").removeClass("active");
    $("#sidenav-allnew").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#sidenav-filas").removeClass("active");
    $("#menu-back").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#newFilaBtn").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#filaDetail").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#newOrderBtn").fadeIn();
        $("#lists").fadeIn("fast", endFade());
    });
}

function toAll() {
    oldData = [];
    lastmode = mode;
    mode = "AllOrders";
    autoUpdate = true;
    startFade();
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-allolds").addClass("active");
    $("#sidenav-allnew").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#sidenav-filas").removeClass("active");
    $("#menu-back").fadeOut();
    $("#newFilaBtn").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#filaDetail").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#newOrderBtn").fadeIn();
        $("#lists").fadeIn("fast", endFade());
    });
}

function toAllNew() {
    oldData = [];
    lastmode = mode;
    mode = "AllNewOrders";
    autoUpdate = true;
    startFade();
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#sidenav-allolds").removeClass("active");
    $("#sidenav-allnew").addClass("active");
    $("#sidenav-filas").removeClass("active");
    $("#menu-back").fadeOut();
    $("#newFilaBtn").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#filaDetail").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#showDetail").fadeOut("fast", function() {
        update();
        $("#newOrderBtn").fadeIn();
        $("#lists").fadeIn("fast", endFade());
    });
}

function toUserSettings() {
    lastmode = mode;
    mode = "UserSettings";
    autoUpdate = false;
    startFade();
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-allolds").removeClass("active");
    $("#sidenav-allnew").removeClass("active");
    $("#sidenav-account").addClass("active");
    $("#sidenav-filas").removeClass("active");
    $("#menu-back").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#menu-norm").fadeIn();
    $("#newFilaBtn").fadeOut();
    $("#filaDetail").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#showDetail").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        update();
        $("#newOrderBtn").fadeIn();
        $("#userSettings").fadeIn("fast", endFade());

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
    startFade();
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#sidenav-allolds").removeClass("active");
    $("#sidenav-allnew").removeClass("active");
    $("#sidenav-filas").removeClass("active");
    $("#menu-back").fadeIn();
    $("#menu-back-d").fadeIn();
    $("#menu-norm").fadeOut();
    $("#newOrderBtn").fadeOut();
    $("#newFilaBtn").fadeOut();
    $("#filaDetail").fadeOut("fast");
    $("#userSettings").fadeOut("fast");
    $("#showDetail").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        update();
        $("#new").fadeIn("fast", endFade());

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

function toFilas() {
    oldData = [];
    lastmode = mode;
    mode = "Filas";
    autoUpdate = true;
    startFade();
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-allolds").removeClass("active");
    $("#sidenav-allnew").removeClass("active");
    $("#sidenav-account").removeClass("active");
    $("#sidenav-filas").addClass("active");
    $("#menu-back").fadeOut();
    $("#menu-back-d").fadeOut();
    $("#newOrderBtn").fadeOut("fast", function() {$("#newFilaBtn").fadeIn("fast")});
    $("#menu-norm").fadeIn();
    $("#userSettings").fadeOut("fast");
    $("#new").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#showDetail").fadeOut("fast");
    $("#filaDetail").fadeOut("fast", function() {
        update();
        $("#lists").fadeIn("fast", endFade());
    });   
}

function toLogout() {
    window.location.href = "appLogin.html#Logout";
}

function back() {
    if(mode == "NewOrder") $("#newOrderBtn").fadeIn();
    if(mode == "NewFila") $("#newFilaBtn").fadeIn();

    if(lastmode == "UserSettings") {
        toUserSettings();
    } else if(lastmode == "NewOrders") {
        toNew();
    } else if(lastmode == "AllOrders") {
        toAll();
    } else if(lastmode == "AllNewOrders") {
        toAllNew();
    } else if(lastmode == "Filas") {
        toFilas();
    } else {
        toOlds();
    }
}

function startFade() {
    $("body").css("overflow", "hidden");
}

function endFade() {
    $("body").css("overflow", "auto");
}