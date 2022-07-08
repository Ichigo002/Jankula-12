var APPS_MANAGER_APP = "Manager of Apps";
class Win_AppManager extends Window {
    constructor(iter) {
        super(iter, Win_AppManager.getAppData().name, 600, 400, Win_AppManager.getAppData().icon_app, Win_AppManager.getAppData().style_icon);
    
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

    // Returns App data 
    static getAppData() {
        let description = "In the manager of apps you can open and change your default apps.";
        let sh_description = "Manage your apps";

        let d = new AppData(
        /*Name*/  APPS_MANAGER_APP,
        /*Icon app*/ "icon-app-apps-manager",
        /*Style*/ "color: #ff2c2c",
        /*Short Desc*/ sh_description,
        /*Long Desc*/  description,
        /*Version*/ "1.4.1v"
        );
        d.posX = 100;
        d.posY = 100;
        return d;
    }

    //Close window event
    onCloseEvent() {
        app_mng.updateResOfApp(APPS_MANAGER_APP, parseInt($('#win-' + this.id_win).css('width')), parseInt($('#win-' + this.id_win).css('height')));
        app_mng.updatePosOfApp(APPS_MANAGER_APP, parseInt($('#win-' + this.id_win).css('left')), parseInt($('#win-' + this.id_win).css('top')));
    }

    //OVERWRITTEN METHOD
    duplicate() {
        let id = app_mng.callApp(APPS_MANAGER_APP);

        wins[id].setPosition(
            parseInt($("#win-" + this.id_win).css("left")) + 40, 
            parseInt($("#win-" + this.id_win).css("top")) + 40);
    }

    // Retrieve data from app manager and display it
    retriveData() {
        let data = app_mng.__retrive__();
        data.sort(this._sortData_);

        data.forEach(elem => {
            if(elem.ext_list != undefined) {
                this.pushDefaultApp(elem);
            }
            this.pushApp(elem);
        });
    }

    _sortData_(x, y) {
        return x.name.localeCompare(y.name);
    }

    // push app to default apps with extensions
    pushDefaultApp(data) {
        let exts = "";

        data.ext_list.forEach(ext => {
            exts += ext.toUpperCase() + ', ';
        });

        let cnt = 
        `<div class="mng-defapp-option">
            <div class="mng-option-group">
                <i class="${data.icon_app}" style="${data.style_icon}"></i>
                <div class="mng-def-option-name">${data.name}</div>
            </div>
            <div class="mng-def-group">
                <div class="mng-def-option-ext">${exts}</div>
                <button onclick="">Change</button>
            </div>
        </div>`;

        $(`#win-${this.id_win} > .win-content > .mng-cnt > .mng-defapps-cnt`).append(cnt);
    }

    // push app to all category
    pushApp(data) {
        let cnt = 
        `<div class="mng-defapp-option">
            <div class="mng-option-group">
                <i class="${data.icon_app}" style="${data.style_icon}"></i>
                <div class="mng-def-option-name">${data.name}</div>
            </div>
            <div class="mng-def-group">
                <button onclick="app_mng.callApp('${data.name}')">Run App</button>
            </div>
        </div>`;

        $(`#win-${this.id_win} > .win-content > .mng-cnt > .mng-allapps-cnt`).append(cnt);
    }
}