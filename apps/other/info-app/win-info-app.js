// Below PATTERN shouldn't be used. Recommend to duplicate this file or copy code below
// and then start making your own app. Editing this file you can destroy pattern.
// Pattern prepared by Wiktor B. to easy making next apps in the Jankula-12 system.

//DO NOT FORGET ADD YOUR APP TO TABLE OF CONTENTS IN THE start.js script

var INFO_APP = "A Piece Of Information"; // Rename to your own app variable
class Win_InfoApp extends Window {
    constructor(iter) {
        super(iter, Win_InfoApp.getAppData().name, 600, 400, Win_InfoApp.getAppData().icon_app, Win_InfoApp.getAppData().style_icon);

        let cnt = 
        ``;

        this.setContent($("#ifno").html());

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