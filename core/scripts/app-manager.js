class AppManager {
    #app_list;

    constructor() {
        this.#app_list = [];

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
    // * def_posX, def_posY - default position on the desktop of window X & Y
    addApp(app_caller) {
        if(app_caller == "" || app_caller == undefined) {
            return new ERROR("AppManager -> setDefaultAppFor(...)", "ERROR_MISSING_DATA", `Not typed app caller.`);
        }

        let data = eval(`${app_caller}.getAppData();`);

        data.posX = data.posX == undefined ? this.default_pos_x : data.posX;
        data.posY = data.posY == undefined ? this.default_pos_y : data.posY;

        data.resX = data.resX == undefined ? this.default_res_x : data.resX;
        data.resY = data.resY == undefined ? this.default_res_y : data.resY;

        data.app_caller = app_caller;
        
        if(data.ext_list != undefined) { // add just app
            data.ext_list.forEach(ext => {
                ext = ext.toUpperCase();
            });
        }

        for (let i = 0; i < this.#app_list.length; i++) {
            if(this.#app_list.at(i).name.toUpperCase() == data.name.toUpperCase()) {
                return throwErr(new ERROR("AppManager -> addApp(...)", "ERROR_EXISTANCE",`Appwith name '${data.name}' has already existed.`));
            }
        }  
        this.#app_list.push(data);
    }

    // Call app by name or extension
    // returns iterator
    callApp(search) {
        let r;
        this.#app_list.forEach(appd => {
            if(appd.name.toUpperCase() == search.toUpperCase()) {
                eval(`${appd.app_caller}.caller(${appd.posX}, ${appd.posY}, ${appd.resX}, ${appd.resY})`);
                r = iter - 1;
            }
        });
        if(r == undefined) {
            this.#app_list.forEach(appd => {
                appd.ext_list.forEach(ext => {
                    if(ext.toUpperCase() == search.toUpperCase()) {
                        eval(`${appd.app_caller}.caller(${appd.posX}, ${appd.posY}, ${appd.resX}, ${appd.resY})`);
                        r = iter - 1;
                    }
                });
            });
        }
        if(r == undefined) {
            r = new ERROR("AppManager -> callApp(...)", "ERRO_NOT_FOUND", `Cannot find app with name or extension: '${search}'`);
        }
        return r;
        
    }

    // Open file by default app
    openByApp(path) {
        let f = file_system.readPath(path);
        let r;

        if(f != undefined) {
            f = f.ext();

            this.#app_list.forEach(appd => {
                appd.forEach(ext => {
                    if(ext.toUpperCase() == f.toUpperCase()) {
                        eval(`${appd.app_caller}.caller(${appd.posX}, ${appd.posY}, ${appd.resX}, ${appd.resY}, ${path})`);
                        r = iter - 1;
                    }
                });
            });
        }
        if(r == undefined) {
            r = new ERROR("AppManager -> openByApp(...)", "ERRO_NOT_FOUND", `Cannot find app with extension: '${f}'`);
        }

        return r;
    }

    // Update position of app after close it
    updatePosOfApp(name_app, x, y) {
        this.#app_list.forEach(appd => {
            if(appd.name == name_app) {
                appd.posX = x;
                appd.posY = y;
            }
        });
    }

    // Update size of app after close it
    updateResOfApp(name_app, w, h) {
        this.#app_list.forEach(appd => {
            if(appd.name == name_app) {
                appd.resX = w;
                appd.resY = h;
            }
        });
    }

    // Retrive data
    __retrive__() {
        return this.#app_list;
    }

    getDataByExt(ext) {
        let data;

        this.#app_list.forEach(appd => {
            if(appd.ext_list != undefined) {
                appd.ext_list.forEach(_ext => {
                    if(ext.toUpperCase() == _ext.toUpperCase()) {
                        data = appd;
                    }
                });
            }
            
        });
        if(data == undefined) {
            return new AppData(undefined, undefined, undefined, undefined, undefined, undefined, undefined, "icon-file", "color: #b99d7b");
        }
        return data;
    }
}

class AppData { 
    constructor(name, icon_app, style_icon, short_desc, long_desc, version="1.0.0v", ext_list=undefined, icon_file=undefined, style_file=undefined) {
        this.name = name;
        this.icon_app =  icon_app;
        this.style_icon = style_icon;
        this.short_desc = short_desc;
        this.long_desc = long_desc;
        this.ver = version;
        this.ext_list = ext_list;
        this.icon_file = icon_file;
        this.style_file = style_file;

        this.posX = undefined;
        this.posY = undefined;
        this.resX = undefined;
        this.resY = undefined;

        this.app_caller = undefined;
    }
}