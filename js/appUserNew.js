/**
 * Created by yanni on 02.05.2016.
 */

function updatePreview() {
    link = $("#neworderurl").val();
    if(link.contains("thingiverse")) {
        $.getJSON("orders.php?action=getThingiverseImg", {link: link}, function (data) {
            $("#preview").attr("src", data["link"]);
        });
    }
}