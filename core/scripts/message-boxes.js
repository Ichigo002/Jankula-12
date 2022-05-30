
// Display Information window
// title - title of the window
// content - contents of information
// returns id at the wins list of created information
function xinfo(title, content) {
    wins.push(new Window(iter, title, AUTO_RESIZE, AUTO_RESIZE, 'icon-win-info', 'color: #5686ff;'));

    let actionOk = 'wins[' + iter + '].action_close()';
    let cnt = "<i class='icon-win-info' style='color: #5686ff; float: left; font-size: 60px;'></i><p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>"
     + content + "</p> <p style='both:clear;'><button class='q-btns-yes' onclick='" + actionOk + "'style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Ok</button></p>";

    _defaultSettingsBox_(cnt);
    iter++;
    return iter - 1;
}

// Display warning window
// title - title of the window
// content - contents of warning
// returns id at the wins list of created warning
function xwarning(title, content) {
    wins.push(new Window(iter, title, AUTO_RESIZE, AUTO_RESIZE, 'icon-win-warning', 'color: yellow;'));
    wins[iter].setCenter();
    let actionOk = 'wins[' + iter + '].action_close()';
    let cnt = "<i class='icon-win-warning' style='color: yellow; float:left; font-size: 60px;'></i><p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>"
     + content + "</p> <p style='both:clear;'><button class='q-btns-yes' onclick='"+actionOk+"' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Ok</button></p>";

    _defaultSettingsBox_(cnt);
    iter++;
    return iter - 1;
}

// Display Information window
// title - title of the window
// content - contents of information
// returns id at the wins list of created information
function xerror(title, content) {
    wins.push(new Window(iter, title, AUTO_RESIZE, AUTO_RESIZE, 'icon-win-attention', 'color: #f70000;'));

    wins[iter].setCenter();

    let actionOk = 'wins[' + iter + '].action_close()';
    let cnt = "<i class='icon-win-attention' style='color:#f70000; float:left; font-size: 60px;'></i><p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>"
    + content + "</p> <p style='both:clear;'><button class='q-btns-yes' onclick='"+actionOk+"' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Ok</button></p>";

    _defaultSettingsBox_(cnt);
    iter++;
    return iter - 1;
}

// Display question window
// title - title of the window
// question - question to user
// action_accept - html action after accept
// action_decline - html action after decline or colse window
// Returns id at the wins list of created question
function xquestion(title, question, action_accept, action_decline) {
    wins.push(new Window(iter, title, AUTO_RESIZE, AUTO_RESIZE, 'icon-win-question', 'color: #1f2bff;'));

    wins[iter].setCenter();

    let cnt = "<i class='icon-win-question' style='color: #1f2bff; float:left; font-size: 60px;'></i><p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>"
    + question + "</p> <p style='both:clear;' onclick='wins["+iter+"].action_close()'><button class='q-btns-yes' onclick='" + action_accept + 
    "' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Yes</button><button onclick='" + action_decline + 
    "' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>No</button></p>";

    _defaultSettingsBox_(cnt);
    iter++;
    return iter - 1;
}

//TO DO: CLOSING AFTER CLICK ENTER KEY
// Display question window
// title - title of the window
// content - contents of information
// input_html - html code of your input
// action_accept - html action after accept
// action_decline - html action after decline or close window
// Returns id at the wins list of created input
function xinput(title, content, input_html, action_accept, action_decline) {
    wins.push(new Window(iter, title, 400, AUTO_RESIZE, 'icon-win-info', 'color: #1f2bff;'));
    wins[iter].setCenter();

    let cnt = "<i class='icon-win-info' style='color: #1f2bff; float:left; font-size: 60px;'></i><p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>"
    + content + "</p><p class='xinput-focus'>" + input_html + "</p><p style='both:clear;' class='q-btns' onclick='wins["+iter+"].action_close()'><button onclick='" + action_accept + 
    "' class='q-btns-yes' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Ok</button><button onclick='" + action_decline + 
    "' class='q-btns-no' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Cancel</button></p>";
 
    _defaultSettingsBox_(cnt);
    $(".xinput-focus > input").trigger("focus");
    iter++;
    return iter - 1;
}

function _keyboardEvent_(id) {
    $(window).keydown(function(e) {
        if($('#win-' + id).css('z-index') == z_index) {
            if(e.which == 13) { //enter
                $('#win-' + id + " > .win-content > p > .q-btns-yes").trigger("onclick");
                $('#win-' + id + " > .win-content > p").trigger("onclick");
            }
            if(e.which == 27) { //escape
                $('#win-' + id + " > .win-content > p").trigger("onclick");
            }
        }
    });
}

function _defaultSettingsBox_(cnt) {
    wins[iter].setStatic(true).setContent(cnt).setPositionResizePoint().setCenter().goTop();

    $("#win-" + iter + " > .win-top > span > i.icon-maximize").remove();
    $("#win-" + iter + " > .win-top > span > i.icon-minimize").remove();

    _keyboardEvent_(iter);
}