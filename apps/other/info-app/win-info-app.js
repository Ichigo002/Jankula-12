// Below PATTERN shouldn't be used. Recommend to duplicate this file or copy code below
// and then start making your own app. Editing this file you can destroy pattern.
// Pattern prepared by Wiktor B. to easy making next apps in the Jankula-12 system.

//DO NOT FORGET ADD YOUR APP TO TABLE OF CONTENTS IN THE start.js script

var INFO_APP = "A Piece Of Information"; // Rename to your own app variable
class Win_InfoApp extends Window {
    constructor(iter) {
        super(iter, Win_InfoApp.getAppData().name, 600, 400, Win_InfoApp.getAppData().icon_app, Win_InfoApp.getAppData().style_icon);

        let cnt = 
        `<div class="info-main-header">Hey, Welcome in the system</div>
        <div class="info-name-sys info-bold">JANKULA-12</div>
        <p style="margin-bottom: 80px;">
            <i class="icon-down-arrow" style="font-size: 21px; margin-right: -12px;"></i>
            <span style="font-size: 35px;">However you've gotta know</span>
            <i class="icon-down-arrow" style="font-size: 21px;"></i>
        </p>
        <p>System has been written only by one person and he keeps developing it. He's started making this since April 8, 2022.</p>
        <p>Jankula-12 is free open-source system for everyone, so if you'd like to see code, you'll find it <a class="info-link" href="https://github.com/Ichigo002/Jankula-12.git" target="_blank">here</a></p>

        <p>I'm sure you've already noticed all system is enough quite inspired Windows 11 because my system is the competition. That's why Jankula 12 contains the '12' in the name</p>

        <p class="info-link" style="cursor: pointer;" onclick="app_mng.callApp(APPS_MANAGER_APP);">Run Manager Run for fun!</p>

        <p style="margin-bottom: 80px;">
            <i class="icon-down-arrow" style="font-size: 21px; margin-right: -12px;"></i>
            <span style="font-size: 35px;">Tutorial for stubborn</span>
            <i class="icon-down-arrow" style="font-size: 21px;"></i>
        </p>
        <p>On the bottom of desktop you can see the taskbar, There are showed up all apps currnetly running or apps pinned to it.</p>
        <p>In the center obviously is your working area with windows.</p>
        <p>Windows are movable, so if you'd like to move window, you'll have to hold the dark bar on the top of that one. Also resizing is possible. Only need to hold and move the light-gray point on the grey edge in the right-bootom side to resize.</p>
        <p style="color: #84ab44">This short tutorial must be enough for you because I'm to lazy to write more.</p>`;

        this.setContent(cnt);

        $("#win-" + this.id_win + " > .win-content").addClass("info-cnt");
    }

    // Called by the AppManager script
    // x, y -> coordinates of window
    // rx. ry -> size of window
    static caller(x, y, rx, ry) {
        wins.push(new Win_InfoApp(iter));
        wins[iter].setPosition(x, y);
        wins[iter].resizeTo(rx, ry);
        iter++;
    }

    // Returns App data 
    static getAppData() {
        let description = "In this app you get a lot of information and important links :)";
        let sh_description = "Get more info";

        let d = new AppData(
        /*Name*/  INFO_APP,
        /*Icon app*/ "icon-search",
        /*Style*/ "color: #0d7df9",
        /*Short Desc*/ sh_description,
        /*Long Desc*/  description,
        /*Version*/ "1.0.0v",
        );

        d.posX = 400; // Default position X
        d.posY = 160; // Default position Y
        d.resX = 1050; // Default Width
        d.resY = 565; // Default Height
        return d;
    }

    //Close window event
    onCloseEvent() {
                            //CHANGE APP_NAME
        app_mng.updateResOfApp(INFO_APP, parseInt($('#win-' + this.id_win).css('width')), parseInt($('#win-' + this.id_win).css('height')));
        app_mng.updatePosOfApp(INFO_APP, parseInt($('#win-' + this.id_win).css('left')), parseInt($('#win-' + this.id_win).css('top')));
    }

    duplicate() {
        let id = app_mng.callApp(INFO_APP);

        wins[id].setPosition(
            parseInt($("#win-" + this.id_win).css("left")) + 40, 
            parseInt($("#win-" + this.id_win).css("top")) + 40);
    }
}