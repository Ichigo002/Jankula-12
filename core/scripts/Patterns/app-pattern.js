// Below PATTERN shouldn't be used. Recommend to duplicate this file or copy code below
// and then start making your own app. Editing this file you can destroy pattern.
// Pattern prepared by Wiktor B. to easy making next apps in the Jankula-12 system.

//DO NOT FORGET ADD YOUR APP TO TABLE OF CONTENTS IN THE start.js script

var NAME_APP = "Pattern"; // Rename to your own app variable
class AppPattern extends Window {
    constructor(iter) {
        super(iter, AppPattern.getAppData().name, 600, 400, AppPattern.getAppData().icon_app, AppPattern.getAppData().style_icon);
    }

    // Called by the AppManager script
    // x, y -> coordinates of window
    // rx. ry -> size of window
    // p -> path to file // DELETE 'p' value IF you make app with no extension support
    static caller(x, y, rx, ry, p) {
        wins.push(new AppPattern(iter));
        wins[iter].setPosition(x, y);
        wins[iter].resizeTo(rx, ry);

        if(p != undefined) {
            let file = file_system.readPath(p);
            // continue using file . . .
        }
        iter++;
    }

    // Returns App data 
    static getAppData() {
        let description = "";
        let sh_description = "";

        let d = new AppData(
        /*Name*/  NAME_APP,
        /*Icon app*/ "icon-app-example",
        /*Style*/ "",
        /*Short Desc*/ sh_description,
        /*Long Desc*/  description,
        /*Version*/ "1.0.0v",
        /*Ext list*/ ["txt", "txt2", "txt3"],
        /*Icon File*/ "icon-example"
        );

        //d.posX = ; // Default position X
        //d.posY = ; // Default position Y
        //d.resX = ; // Default Width
        //d.resY = ; // Default Height
        return d;
    }

    //Close window event
    onCloseEvent() {
                            //CHANGE APP_NAME
        app_mng.updateResOfApp(NAME_APP, parseInt($('#win-' + this.id_win).css('width')), parseInt($('#win-' + this.id_win).css('height')));
        app_mng.updatePosOfApp(NAME_APP, parseInt($('#win-' + this.id_win).css('left')), parseInt($('#win-' + this.id_win).css('top')));
    }
}