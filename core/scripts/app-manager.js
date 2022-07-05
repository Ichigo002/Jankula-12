class AppManager {
    #app_ext_list;

    constructor() {
        this.#app_ext_list = [];

        this.default_pos_x = 400;
        this.default_pos_Y = 500;
    }

    // set Default app to specific extension file
    // If file is clicked to open, default app will be opened with path to file
    // 
    // ext - which extension is handled by this app?        ex: "txt"
    // name_app - name of app                               ex: "Foo App"
    // app_file_caller - method to call app with file path. ex: "callFoo($posX$, $posY$, $path$)"
    // app_caller - method to call app without any file.    ex: "callFoo2($posX$, $posY$)"
    setDefaultAppFor(ext, name_app, icon_app, app_file_caller, app_caller) {
        ext = ext.toUpperCase();

        if(name_app == "" || name_app == undefined) {
            return new ERROR("AppManager -> setDefaultAppFor(...)", "ERROR_MISSING_DATA", `Not typed name of app to set.`);
        }
        if(icon_app == "" || icon_app == undefined) {
            icon_app = "default-icon";
        }
        if(app_file_caller == "" || app_file_caller == undefined) {
            return new ERROR("AppManager -> setDefaultAppFor(...)", "ERROR_MISSING_DATA", `Not typed app caller for files.`);
        }

        let l = this.#app_ext_list.push(new Linker(ext, name_app, icon_app, app_file_caller, app_caller));

        this.#app_ext_list[l]._posX = x;
        this.#app_ext_list[l]._posY = y;
    }

    callApp(name_app) {
        this.#app_ext_list.forEach(link => {
            if(link._name_app == name_app) {
                this.#execStdlyApp(link);
            }
        });
    }

    #execStdlyApp(link) {
        let caller = link._app_caller;

        caller = Utility.replaceHolder(caller, link._posX, "posX");
        if(ErrorHandler.check(caller)) { return throwErr(caller); }

        caller = Utility.replaceHolder(caller, link._posX, "posY");
        if(ErrorHandler.check(caller)) { return throwErr(caller); }

        eval(caller);
    }

    updatePosOfApp(name_app, x, y) {
        this.#app_ext_list.forEach(link => {
            if(link._name_app == name_app) {
                link._posX = x;
                link._posY = y;
            }
        });
    }
}

class Linker {
    constructor(ext, name_app, icon_app, app_file_caller, app_caller) {
        this._ext = ext;
        this._name_app = name_app;
        this._icon_app = icon_app;
        this._app_file_caller = app_file_caller;
        this._app_caller = app_caller;
        this._posX = undefined;
        this._posY = undefined;
    }
}