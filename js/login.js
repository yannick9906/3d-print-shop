/**
 * Created by yanni on 28.04.2016.
 */

function switchToRegister() {
    $("#btnToLogin").show();
    $("#login").hide();
    $("#btnToRegister").hide();
    $("#register").show();
}

function switchToLogin() {
    $("#btnToLogin").hide();
    $("#login").show();
    $("#btnToRegister").show();
    $("#register").hide();
}

function login() {
    var usrname  = $("#l_usrname").val();
    var passwd1  = $("#l_passwd").val();

    var passwd = md5(passwd1);
    data = {
        usrname: usrname,
        passwd: passwd
    };
    $.post("userLogin.php?action=login", data, function(data) {
        data = JSON.parse(data);
        var field = $("#usrname");
        if(data["success"] == 1) {
            Materialize.toast('Login erfolgreich', 2000, 'green');
            window.location.href = data["forwardTo"];
        } else if(data["errorcode"] == 4) {
            Materialize.toast('Der Benutzername existiert nicht.', 4000, 'red');
        } else if(data["errorcode"] == 3) {
            Materialize.toast('Passwort falsch', 4000, 'red');
        } else if(data["errorcode"] == 5) {
            Materialize.toast('Der Account ist noch nicht freigeschalten.', 4000, 'red');
        } else {
            Materialize.toast('Es ist ein Fehler aufgetreten. Das tut uns leid :/', 4000, 'red');
        }

    });
}

function register() {
    var usrname  = $("#usrname").val();
    var passwd1  = $("#passwd").val();
    var passwd2  = $("#passwd2").val();
    var email    = $("#email").val();
    var realname = $("#realname").val();

    if(passwd1 == passwd2) {
        var passwd = md5(passwd1);
        data = {
            usrname: usrname,
            passwd: passwd,
            email: email,
            realname: realname
        };
        $.post("userLogin.php?action=register", data, function(data) {
            data = JSON.parse(data);
            var field = $("#usrname");
            if(data["success"] == 1) {
                Materialize.toast('Registrierung erfolgreich', 2000, 'green');
                Materialize.toast('Sobald dein Account aktiviert wurde,<br/>kannst du dich anmelden.', 10000, 'green');
                switchToLogin();
                field.removeClass("invalid");
                field.removeClass("valid");
            } else if(data["errorcode"] == 1) {
                Materialize.toast('Der Benutzername ist schon vergeben', 2000, 'red');
                field.addClass("invalid");
                field.removeClass("valid");
            } else if(data["errorcode"] == 2) {
                Materialize.toast('Es müssen alle Felder ausgefüllt sein', 2000, 'red');
            } else {
                Materialize.toast('Es ist ein Fehler aufgetreten. Das tut uns leid :/', 2000, 'red');
            }

        });
    } else {
        Materialize.toast('Passwörter stimmen nicht überein', 2000, 'red');
    }
}

function checkUsrname() {
    var field = $("#usrname");
    $.getJSON("userLogin.php?action=validateUsername&username="+field.val(), null, function(data) {
        if(field.val() == "") {
            field.removeClass("invalid");
            field.removeClass("valid");
        } else if(data["success"] == 1) {
            field.removeClass("invalid");
            field.addClass("valid");
        } else {
            field.addClass("invalid");
            field.removeClass("valid");
        }
    });
}