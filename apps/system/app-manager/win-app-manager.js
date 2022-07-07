var APPS_MANAGER_APP = "Manager of Apps";
class Win_AppManager extends Window {
    constructor(iter) {
        super(iter, APPS_MANAGER_APP, 600, 400, "icon-app-apps-manager", "color: #ff2c2c");
    
        let cnt = 
        `<div class="mng-cnt">
            <div class="mng-info-text">
                In this place you can edit easily default apps which opens file's extensions. Likewise under the Default Apps you find Other apps. Where you may run all apps on your Jankula-12.
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

        this.retriveData();

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

    // Retrieve data from app manager and display it
    retriveData() {
        let data = app_mng.__retrive__();
        data.sort(this._sortData_);

        data.forEach(elem => {
            if(elem._ext != undefined) {
                this.pushDefaultApp(elem);
            }
            this.pushApp(elem);
        });
    }

    _sortData_(x, y) {
        return x._name_app.localeCompare(y._name_app);
    }

    // push app to default apps with extensions
    pushDefaultApp(linker) {
        let cnt = 
        `<div class="mng-defapp-option">
            <div class="mng-option-group">
                <i class="${linker._icon_app}" style="${linker._style_icon}"></i>
                <div class="mng-def-option-name">${linker._name_app}</div>
            </div>
            <div class="mng-def-group">
                <div class="mng-def-option-ext">${linker._ext.toUpperCase()}</div>
                <button onclick="">Change</button>
            </div>
        </div>`;

        $(`#win-${this.id_win} > .win-content > .mng-cnt > .mng-defapps-cnt`).append(cnt);
    }

    // push app to all category
    pushApp(linker) {
        let cnt = 
        `<div class="mng-defapp-option">
            <div class="mng-option-group">
                <i class="${linker._icon_app}" style="${linker._style_icon}"></i>
                <div class="mng-def-option-name">${linker._name_app}</div>
            </div>
            <div class="mng-def-group">
                <button onclick="app_mng.callApp('${linker._name_app}')">Run App</button>
            </div>
        </div>`;

        $(`#win-${this.id_win} > .win-content > .mng-cnt > .mng-allapps-cnt`).append(cnt);
    }
}