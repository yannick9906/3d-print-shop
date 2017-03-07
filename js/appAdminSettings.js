/**
 * Created by yanni on 02.05.2016.
 */

function updatePasswd() {
    let passwd1  = $("#passwd1").val();
    let passwd2  = $("#passwd2").val();

    if(passwd1 == passwd2) {
        let passwd = md5(passwd1);
        let data = {
            passwd: passwd
        };
        $.post("users.php?action=updatePass", data, function(data) {
            data = JSON.parse(data);
            if(data["success"] == true) {
                Materialize.toast("Gespeichert", 2000, "green");
                toUserSettings();
            } else if(data["errorcode"] == 2) Materialize.toast('Es müssen alle Felder ausgefüllt sein', 2000, 'red');
            else {
                if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                else Materialize.toast('Es ist ein Fehler aufgetreten. Das tut uns leid :/', 2000, 'red');
            }
        });
    } else {
        Materialize.toast('Die Passwörter stimmen nicht überein', 2000, 'red');
    }
}

function updateEmail() {
    let email  = $("#email").val();
    let emails = $("#recv-emails").is(":checked");

    let data = {
        email: email,
        emails: emails
    };
    console.log(data);
    $.post("users.php?action=updateEmail", data, function(data) {
        data = JSON.parse(data);
        if(data["success"] == true) {
            Materialize.toast("Gespeichert", 2000, "green");
            toUserSettings();
        } else if(data["errorcode"] == 2) Materialize.toast('Es müssen alle Felder ausgefüllt sein', 2000, 'red');
        else {
            if (data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else Materialize.toast('Es ist ein Fehler aufgetreten. Das tut uns leid :/', 2000, 'red');
        }
    });
}

