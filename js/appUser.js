/**
 * Created by yanni on 28.04.2016.
 */
var listTmplt;
var mode = "NewOrders";
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
                    <a href="detail.php?id=$id">
                        <i class="mddi mddi-information-outline grey-text text-darken-1"></i>
                    </a>
                    <span class="grey-text text-darken-1 light-bold" style="font-size: 22px; vertical-align: top; line-height: 26px;">{{complete_price}}<i class="mddi mddi-currency-eur"></i></span>
                </span>
                {{printing}}
            </li>
        </ul>
    `);
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
    mode = "OldOrders";
    autoUpdate = true;
    $("#sidenav-olds").addClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").removeClass("active");
    update();
}

function toNew() {
    mode = "NewOrders";
    autoUpdate = true;
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").addClass("active");
    $("#sidenav-account").removeClass("active");
    udpate();
}

function showDetail(oid) {
    mode = "details";
    autoUpdate = false;
    update();
}

function toUserSettings() {
    mode = "NewOrders";
    autoUpdate = false;
    $("#sidenav-olds").removeClass("active");
    $("#sidenav-new").removeClass("active");
    $("#sidenav-account").addClass("active");
    update();
}