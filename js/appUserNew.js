/**
 * Created by yanni on 02.05.2016.
 */

function updatePreview() {
    link = $("#neworderurl").val();
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
    title = $("#newordertitle").val();
    fila = $("#neworderfilament").val();
    url = $("#neworderurl").val();
    comment = $("#newordercomment").val();
    data = {title: title, fila: fila, url: url, comment: comment};
    console.log(data);
    if(fila != null) {
        if(title != "" && url != "" && comment != "") {
            $.post("orders.php?action=newOrder", data, function(data) {
                json = JSON.parse(data);
                if(json["success"]) {
                    Materialize.toast("Deine Bestellung wurde abgeschickt<br/>Du erhälst eine Email, sobald ein Preisvorschlag verfügbar ist", 5000, "green")
                    toNew();
                    $("#newOrderBtn").fadeIn();
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