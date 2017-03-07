/**
 * Created by yanni on 02.05.2016.
 */

function updatePreview() {
    let link = $("#neworderurl").val();
    if(link.contains("thingiverse")) {
        $("#preview").attr("src", "http://www.the-irf.com/assets/content/animation/loading2.gif");
        $.getJSON("orders.php?action=getThingiverseImg", {link: link}, function (data) {
            if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
            else $("#preview").attr("src", data["link"]);
        });
    } else {
        $("#preview").attr("src", "http://www.the-irf.com/assets/content/animation/loading2.gif");
    }
}

function sendNewOrder() {
    let title = $("#newordertitle").val();
    let fila = $("#neworderfilament").val();
    let url = $("#neworderurl").val();
    let comment = $("#newordercomment").val();
    let data = {title: title, fila: fila, url: url, comment: comment};
    console.log(data);
    if(fila != null) {
        if(title != "" && url != "" && comment != "") {
            $.post("orders.php?action=newOrder", data, function(data) {
                let json = JSON.parse(data);
                if(json["success"]) {
                    Materialize.toast("Deine Bestellung wurde abgeschickt<br/>Du erhälst eine Email, sobald ein Preisvorschlag verfügbar ist", 5000, "green");
                    back();
                    $("#newordertitle").val("");
                    $("#neworderfilament").val("");
                    $("#neworderurl").val("");
                    $("#newordercomment").val("");
                } else {
                    if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                    else Materialize.toast("Es ist ein Fehler aufgetreten. Das tut uns leid :/", 5000, "red");
                }
            });
        } else {
            Materialize.toast("Bitte fülle alle Felder aus", 2000, "red");
        }
    } else {
        Materialize.toast("Bitte wähle ein Material", 2000, "red");
    }
}

function toNewFila() {
    lastmode = mode;
    mode = "newFila";
    autoUpdate = false;
    $("#btnSubmitEditFila").hide();
    $("#btnSubmitNewFila").show();
    $("#menu-back").fadeIn();
    $("#menu-back-d").fadeIn();
    $("#menu-norm").fadeOut();
    $("#showDetail").fadeOut("fast");
    $("#userSettings").fadeOut("fast");
    $("#admDetail").fadeOut("fast");
    $("#newFilaBtn").fadeOut("fast");
    $("#lists").fadeOut("fast", function() {
        $("#filaDetail").fadeIn("fast");
        $("#filaDiameter").val(0);
        $("#filaColor").val("000000");
        $("#filaName").val("");
        $("#filaActive").prop("checked", true);
        $("#filaPrice").val(0);
        $("#filaSellPrice").val(0);
        Materialize.updateTextFields();
    });
}

function sendNewFila() {
    let data = {
        diameter: $("#filaDiameter").val(),
        colorcode: $("#filaColor").val(),
        colorname: $("#filaName").val(),
        active: $("#filaActive").is(":checked"),
        price: $("#filaPrice").val(),
        saleprice: $("#filaSellPrice").val()
    };
    console.log(data);
    if(data["diameter"] != null && data["colorcode"] != null && data["colorname"] != null && data["price"] != null && data["saleprice"] != null) {
        $.post("filaments.php?action=newFilament", data, function(data) {
            let json = JSON.parse(data);
            if(json["success"]) {
                Materialize.toast("Material erstellt", 5000, "green");
                back();
            } else {
                if(data["error"] == "NoLogin") window.location.href = "appLogin.html";
                else Materialize.toast("Es ist ein Fehler aufgetreten. Das tut uns leid :/", 5000, "red");
            }
        });
    } else {
        Materialize.toast("Bitte fülle alle Felder aus", 2000, "red");
    }
}