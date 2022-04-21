
// Display Information window
// title - title of the window
// content - contents of information
// returns id at the wins list of created information
function xinfo(title, content) {
    wins.push(new Window(title, AUTO_RESIZE, AUTO_RESIZE, iter, "<i class='icon-win-info'></i>"));
    wins[iter].setPosition(100, 100);

    let cnt = "<i class='icon-win-info' style='float:left; font-size: 60px;'></i><p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>"
     + content + "</p> <p style='both:clear;'><button class='system-button' style='float:right; margin: 5px 15px 15px 5px; width: 90px;'>Ok</button></p>";

    wins[iter].setContent(cnt);
    wins[iter].static = true;
    wins[iter].setPositionResizePoint();
    $("#win-" + iter + " > .win-top > span > i.icon-maximize").remove();
    $("#win-" + iter + " > .win-top > span > i.icon-minimize").remove();
    iter++;

    return iter - 1;
}