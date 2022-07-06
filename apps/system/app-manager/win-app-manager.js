var APPS_MANAGER_APP = "Manager of Apps"; // Rename to your own app variable
class Win_AppManager extends Window {
    constructor(iter) {
        super(iter, APPS_MANAGER_APP, 600, 400, "icon-app-apps-manager", "color: #ff2c2c");
    }

    // Called by the AppManager script
    // x, y -> coordinates of window
    // rx. ry -> size of window
    static caller(x, y, rx, ry) {
        wins.push(new Win_AppManager(iter));
        wins[iter].setPosition(x, y);
        wins[iter].resizeTo(rx, ry);
        iter++;
    }

    //Close window event
    onCloseEvent() {
        app_mng.updateResOfApp(APPS_MANAGER_APP, parseInt($('#win-' + this.id_win).css('width')), parseInt($('#win-' + this.id_win).css('height')));
        app_mng.updatePosOfApp(APPS_MANAGER_APP, parseInt($('#win-' + this.id_win).css('left')), parseInt($('#win-' + this.id_win).css('top')));
    }
}