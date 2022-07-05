class AppManager {
    #app_ext_list;

    constructor() {
        this.#app_ext_list = [];

        this.default_pos_x = 400;
        this.default_pos_y = 300;
    }

    // set Default app to specific extension file
    // If file is clicked to open, default app will be opened with path to file
    // you can overwrite old app with extension
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
        let found = false;
        let l;
        let i_;
        for (let i = 0; i < this.#app_ext_list.length; i++) {
            if(this.#app_ext_list.at(i)._ext.toUpperCase() == ext) {
                found = true;
                i_ = i;
            }
        }

        if(found) {
            this.#app_ext_list[i_].change(ext, name_app, icon_app, app_file_caller, app_caller);
            l = i_ + 1;
        } else {
            l = this.#app_ext_list.push(new Linker(ext, name_app, icon_app, app_file_caller, app_caller));
        }


        this.#app_ext_list[l-1]._posX = this.default_pos_x;
        this.#app_ext_list[l-1]._posY = this.default_pos_y;
    }

    // COMPLETE // EXTENSION CHANGE TO NAME APP LOOK FOR IN THE LOOP
    addStdApp(name_app, icon_app, app_caller) {
        if(name_app == "" || name_app == undefined) {
            return new ERROR("AppManager -> setDefaultAppFor(...)", "ERROR_MISSING_DATA", `Not typed name of app to set.`);
        }
        if(icon_app == "" || icon_app == undefined) {
            icon_app = "default-icon";
        }
        let found = false;
        let l;
        let i_;
        for (let i = 0; i < this.#app_ext_list.length; i++) {
            if(this.#app_ext_list.at(i)._ext.toUpperCase() == ext) {
                found = true;
                i_ = i;
            }
        }

        if(found) {
            this.#app_ext_list[i_].change(ext, name_app, icon_app, app_file_caller, app_caller);
            l = i_ + 1;
        } else {
            l = this.#app_ext_list.push(new Linker(ext, name_app, icon_app, app_file_caller, app_caller));
        }


        this.#app_ext_list[l-1]._posX = this.default_pos_x;
        this.#app_ext_list[l-1]._posY = this.default_pos_y;
    }

    // Call app by name or extension
    callApp(search) {
        let r;
        this.#app_ext_list.forEach(link => {
            if(link._name_app.toUpperCase() == search.toUpperCase()) {
                r = this.#execStdlyApp(link);
            }
        });
        if(r == undefined) {
            this.#app_ext_list.forEach(link => {
                if(link._ext.toUpperCase() == search.toUpperCase()) {
                    r = this.#execStdlyApp(link);
                }
            });
        }
        if(r == undefined) {
            r = new ERROR("AppManager -> callAppByName(...)", "ERRO_NOT_FOUND", `Cannot find app with name or extension: '${search}'`);
        }
        return r;
        
    }

    // Open file by default app
    openByApp(path) {
        let f = file_system.readPath(path);
        let r;

        if(f != undefined) {
            f = f.ext();
            this.#app_ext_list.forEach(link => {
                if(link._ext.toUpperCase() == f.toUpperCase()) {
                    r = this.#execStdlyApp(link);
                }
            });
        }
        if(r == undefined) {
            r = new ERROR("AppManager -> openByApp(...)", "ERRO_NOT_FOUND", `Cannot find app with extension: '${f}'`);
        }

        return r;
    }

    #execStdlyApp(link) {
        let caller = link._app_caller;

        caller = Utility.replaceHolder(caller, link._posX.toString(), "posX");
        if(ErrorHandler.check(caller)) { return throwErr(caller); }

        caller = Utility.replaceHolder(caller, link._posY.toString(), "posY");
        if(ErrorHandler.check(caller)) { return throwErr(caller); }

        eval(caller);
        return iter-1;
    }

    // Update pos of app after close it
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
        this.change(ext, name_app, icon_app, app_file_caller, app_caller);
    }

    change(ext, name_app, icon_app, app_file_caller, app_caller) {
        this._ext = ext;
        this._name_app = name_app;
        this._icon_app = icon_app;
        this._app_file_caller = app_file_caller;
        this._app_caller = app_caller;
        this._posX = undefined;
        this._posY = undefined;
        this._resX = undefined;
        this._resY = undefined;
    }
}