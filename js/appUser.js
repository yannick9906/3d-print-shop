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
                    <i class="mddi mddi-information-outline grey-text text-darken-1"></i> {{statetext}}<br/>
                    <i class="mddi mddi-altimeter grey-text text-darken-1"></i> 0,{{precision}} mm<br/>
                    <i class="mddi mddi-format-color-fill grey-text text-darken-1"></i> {{filamentcolorname}}<br/>
                    <i class="mddi mddi-weight grey-text text-darken-1"></i> {{material_weight}} g<br/>
                    <i class="mddi mddi-clock-in  grey-text text-darken-1"></i> {{date_confirmed}}<br/>
                    <i class="mddi mddi-clock-out grey-text text-darken-1"></i> {{date_completed}}<br/>
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
    $("#xxx").fadeOut("fast");
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
    $("#xxx").fadeOut("fast");
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
    $("#lists").fadeOut("fast", function() {
        $("#showDetail").fadeIn("fast");
        $.getJSON("orders.php?action=orderDetails&oID="+oid, null, function(data) {
            $(".detail-title").html(data["order"]["order_name"]);
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
                //$("#detail_img").attr("src", "http://www.lazerhorse.org/wp-content/uploads/2013/08/3D-Printing-Fail-Beautiful-Error.jpg");
                //$("#detail_img").css("padding", "0");
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
        $("#xxx").fadeIn("fast");
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