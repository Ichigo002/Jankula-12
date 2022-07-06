class AppManager {
    #app_ext_list;

    constructor() {
        this.#app_ext_list = [];

        this.default_pos_x = 400;
        this.default_pos_y = 300;

        this.default_res_x = 600;
        this.default_res_y = 400;
    }

    // set Default app to specific extension file
    // If file is clicked to open, default app will be opened with path to file
    // you can overwrite old app with extension
    // 
    // name_app - name of app                               ex: "Foo App"
    // app_caller - method to call app without any file.    ex: "Win_Pattern" [Class of app]
    // [Optional]
    // * ext - handle extension by app
    // * def_resX, def_resY - default resized size of window X & Y
    // * def_posX, def_posX - default position on the desktop of window X & Y
    addApp(name_app, icon_app, style_icon, app_caller, ext=undefined, def_resX=undefined, def_resY=undefined, def_posX=undefined, def_posY=undefined) {
        if(name_app == "" || name_app == undefined) {
            return new ERROR("AppManager -> setDefaultAppFor(...)", "ERROR_MISSING_DATA", `Not typed name of app to set.`);
        }
        if(icon_app == "" || icon_app == undefined) {
            icon_app = "default-icon";
        }
        if(app_caller == "" || app_caller == undefined) {
            return new ERROR("AppManager -> setDefaultAppFor(...)", "ERROR_MISSING_DATA", `Not typed app caller.`);
        }

        let l_pos;
        
        if(ext == undefined) { // add just app
            let i_;
            for (let i = 0; i < this.#app_ext_list.length; i++) {
                if(this.#app_ext_list.at(i)._name_app.toUpperCase() == name_app.toUpperCase()) {
                    i_ = i;
                }
            }

            if(i_ != undefined) {
                this.#app_ext_list[i_].change(undefined, name_app, icon_app, style_icon, app_caller);
                l_pos = i_ + 1;
            } else {
                l_pos = this.#app_ext_list.push(new Linker(undefined, name_app, icon_app, style_icon, app_caller));
            }
        } else { // add app with default extension
            ext = ext.toUpperCase();
            
            let i_;
            for (let i = 0; i < this.#app_ext_list.length; i++) {
                if(this.#app_ext_list.at(i)._ext.toUpperCase() == ext) {
                    i_ = i;
                }
            }
            if(i_ != undefined) {
                this.#app_ext_list[i_].change(ext, name_app, icon_app, style_icon, app_file_caller, app_caller);
                l_pos = i_ + 1;
            } else {
                l_pos = this.#app_ext_list.push(new Linker(ext, name_app, style_icon, icon_app, app_caller));
            }
        }

        this.#app_ext_list[l_pos-1]._posX = def_posX == undefined ? this.default_pos_x : def_posX;
        this.#app_ext_list[l_pos-1]._posY = def_posY == undefined ? this.default_pos_y : def_posY;
        
        this.#app_ext_list[l_pos-1]._resX = def_resX == undefined ? this.default_res_x : def_resX;
        this.#app_ext_list[l_pos-1]._resY = def_resY == undefined ? this.default_res_y : def_resY;
    }

    // Call app by name or extension
    callApp(search) {
        let r;
        this.#app_ext_list.forEach(link => {
            if(link._name_app.toUpperCase() == search.toUpperCase()) {
                eval(`${link._app_caller}.caller(${link._posX}, ${link._posY}, ${link._resX}, ${link._resY})`);
                r = iter - 1;
            }
        });
        if(r == undefined) {
            this.#app_ext_list.forEach(link => {
                if(link._ext.toUpperCase() == search.toUpperCase()) {
                    eval(`${link._app_caller}.caller(${link._posX}, ${link._posY}, ${link._resX}, ${link._resY})`);
                    r = iter - 1;
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
                    eval(`${link._app_caller}.caller(${link._posX}, ${link._posY}, ${link._resX}, ${link._resY}, ${path})`);
                    r = iter - 1;
                }
            });
        }
        if(r == undefined) {
            r = new ERROR("AppManager -> openByApp(...)", "ERRO_NOT_FOUND", `Cannot find app with extension: '${f}'`);
        }

        return r;
    }

    // Update position of app after close it
    updatePosOfApp(name_app, x, y) {
        this.#app_ext_list.forEach(link => {
            if(link._name_app == name_app) {
                link._posX = x;
                link._posY = y;
            }
        });
    }

    // Update size of app after close it
    updateResOfApp(name_app, w, h) {
        this.#app_ext_list.forEach(link => {
            if(link._name_app == name_app) {
                link._resX = w;
                link._resY = h;
            }
        });
    }
}

class Linker {
    constructor(ext, name_app, icon_app, style_icon, app_caller) {
        this.change(ext, name_app, icon_app, style_icon, app_caller);
    }

    change(ext, name_app, icon_app, style_icon, app_caller) {
        this._ext = ext;
        this._name_app = name_app;
        this._icon_app = icon_app;
        this._style_icon = style_icon;
        this._app_caller = app_caller;
        this._posX = undefined;
        this._posY = undefined;
        this._resX = undefined;
        this._resY = undefined;
    }
}