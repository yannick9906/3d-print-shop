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
        $.post("users.php?action=register", data, function(data) {
            data = JSON.parse(data);
            var field = $("#usrname");
            if(data["success"] == 1) {
                Materialize.toast('Registrierung erfolgreich', 2000, 'green');
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
    $.getJSON("users.php?action=validateUsername&username="+field.val(), null, function(data) {
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