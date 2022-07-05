// Below PATTERN shouldn't be used. Recommend to duplicate this file or copy code below
// and then start making your own app. Editing this file you can destroy pattern.

// Pattern prepared by Wiktor B. to easy making next apps in the Jankula-12 system

//DO NOT FORGET ADD YOUR APP TO TABLE OF CONTENTS IN THE start.js script

var APP_NAME = "App Pattern Jankula-12"; // Rename to your own app variable

class AppPattern extends Window {
    constructor(iter) {
        super(iter, "PATTERN", 600, 400, "icon-default-icon", "");
    }

    // Called by the AppManager script
    // x, y -> coordinates of window
    // p -> path to file // DELETE 'p' value IF you make app with no extension support
    static caller(x, y, p) {
        wins.push(new AppPattern(iter));
        wins[iter].setPosition(x, y);
        if(p != undefined) {
            let file = file_system.readPath(p);
            // continue using file . . .
        }
        

        iter++;
    }

    //Close window event
    onCloseEvent() {
                                                 //CHANGE APP_NAME
        ErrorHandler.throwIf( app_mng.updatePosOfApp(APP_NAME, parseInt($('#win-' + this.id_win).css('left')), parseInt($('#win-' + this.id_win).css('top'))));
    }
}