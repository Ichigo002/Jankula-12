var APPS_MANAGER_APP = "Manager of Apps"; // Rename to your own app variable
class Win_AppManager extends Window {
    constructor(iter) {
        super(iter, APPS_MANAGER_APP, 600, 400, "icon-app-apps-manager", "color: #ff2c2c");
    
        let cnt = 
        `<div class="mng-cnt">
            <div class="mng-info-text">
                In this place you can edit easily default apps which opens file's extensions. Likewise under the Default Apps you find Other apps. Where you may see all apps on your Jankula-12.
            </div>
            <h2 style="letter-spacing: 1.5px;">Default Apps</h2>
            <div class="mng-defapps-cnt">
                
            </div>
            <h2 style="letter-spacing: 1.5px;">All Apps</h2>
            <div class="mng-allapps-cnt">
                
            </div>
        </div>`;

        this.setContent(cnt);

        $("#win-" + this.id_win + " > .win-content").css("overflow-y", "auto");

        this.pushDefaultApp("Kajungen", "icon-app-notebook", "color: green", "kjg", 0);
        this.pushDefaultApp("ffffff", "icon-app-calculator", "color: aqua", "cfg", 2);
        this.pushApp("WIKTOr", "icon-default", "");
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

    // OVERWRITTEN EVENT
    onResizeEvent() {
        $("#win-" + this.id_win + " > .win-content").css("height", parseInt($("#win-" + this.id_win).css("height")) - 29)
    }

    // push app to default apps with extensions
    pushDefaultApp(name, icon, style_icon, ext, id) {
        let cnt = 
        `<div class="mng-defapp-option">
            <i class="${icon}" style="${style_icon}"></i>
            <div class="mng-def-option-name">${name}</div>
            <div class="mng-def-group">
                <div class="mng-def-option-ext">${ext.toUpperCase()}</div>
                <button onclick="alert('Oh no we have lost the land! id of island: ' + ${id})">Change</button>
            </div>
        </div>`;

        $(`#win-${this.id_win} > .win-content > .mng-cnt > .mng-defapps-cnt`).append(cnt);
    }

    // push app to all category
    pushApp(name, icon, style_icon) {
        let cnt = 
        `<div class="mng-defapp-option">
            <i class="${icon}" style="${style_icon}"></i>
            <div class="mng-def-option-name">${name}</div>
        </div>`;

        $(`#win-${this.id_win} > .win-content > .mng-cnt > .mng-allapps-cnt`).append(cnt);
    }
}