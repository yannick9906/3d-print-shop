/**
 * Created by yanni on 02.05.2016.
 */

function updatePreview() {
    link = $("#neworderurl").val();
    if(link.contains("thingiverse")) {
        $("#preview").attr("src", "http://www.the-irf.com/assets/content/animation/loading2.gif");
        $.getJSON("orders.php?action=getThingiverseImg", {link: link}, function (data) {
            $("#preview").attr("src", data["link"]);
        });
    } else {
        $("#preview").attr("src", "http://www.the-irf.com/assets/content/animation/loading2.gif");
    }
}