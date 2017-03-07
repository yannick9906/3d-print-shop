/**
 * Created by yanni on 28.04.2016.
 */
let listTmplt;
let listTmpltMore;
let filaTmplt;
let filaListTmplt;
let mode = "AllNewOrders";
let lastmode = "AllNewOrders";
let autoUpdate = true;
let oldData;
const applicationServerPublicKey = 'BK6fuQbSiR92pPBwncgBVAO3a3-hFKQsFwBStwNyhqcZd_6DQ7gFIciJ2OOXc12bvoA4U-Xhs0oBn74fsymKiOs';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('/new/serviceworker.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
    pushButton.textContent = 'Push Not Supported';
}

function initialiseUI() {
    console.log(pushButton);
    pushButton.addEventListener('click', function() {
        pushButton.disabled = true;
        if (isSubscribed) {
            // TODO: Unsubscribe user
        } else {
            subscribeUser();
        }
    });

    // Set the initial subscription value
    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            updateSubscriptionOnServer(subscription);

            if (isSubscribed) {
                console.log('User IS subscribed.');
            } else {
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function(subscription) {
            console.log('User is subscribed.');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushButton.textContent = 'Push Messaging Blocked.';
        pushButton.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushButton.textContent = 'Benarichtigungen deaktivieren';
    } else {
        pushButton.textContent = 'Benarichtigungen aktivieren';
    }

    pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {


    const subscriptionJson = document.querySelector('.js-subscription-json');
    const subscriptionDetails =
        document.querySelector('.js-subscription-details');

    if (subscription) {
        subscriptionJson.textContent = JSON.stringify(subscription);
        subscriptionDetails.classList.remove('is-invisible');
    } else {
        subscriptionDetails.classList.add('is-invisible');
    }
}

navigator.serviceWorker.register('/new/serviceworker.js')
    .then(function(swReg) {
        console.log('Service Worker is registered', swReg);

        swRegistration = swReg;
        initialiseUI();
    })


$(document).ready(function () {
    filaTmplt = Handlebars.compile(`
        <option value='{{fID}}' class="circle left" data-icon="../new/pics/{{filamentcolorcode}}-1.png">{{price}} €/kg - {{filamentcolorname}} /{{active}}</option>
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
        <div class="col s12">
            <div class="card horizontal">
                <div class="card-image">
                    <img id="pic{{oID}}" src="{{pic}}" width="30%">
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
    listTmpltMore = Handlebars.compile(`
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
                            <i class="mddi mddi-account grey-text text-darken-1"></i><b> Account:</b> {{realname}} <span class="bg badge {{statecolor}}">{{statetext}}</span><br/>
                            <i class="mddi mddi-altimeter grey-text text-darken-1"></i> <b>Schichtdicke:</b> 0,{{precision}} mm<br/>
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
                        <a href="#" onclick="showAdmDetail({{oID}})">
                            <i class="mddi mddi-pencil"></i> Bearbeiten
                        </a>
                    </div>
                </div>
            </div>
        </div>
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
                let filaments = data["filaments"];
                console.log(data);
                $("#neworderfilament").html("<option value='' disabled selected>Wähle ein Material</option>");
                for(let i = 0; i < filaments.length; i++) {
                    let element = filaments[i]
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