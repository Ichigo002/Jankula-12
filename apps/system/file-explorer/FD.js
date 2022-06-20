var WORK_STD = 0,
WORK_OPEN_FILE = 1,
WORK_SAVE_FILE = 2;

// FDOpener does easy opening diffrent files & directories.
class FDOpener {
    // openType: FILE or DIR value
    // action_return_path: method must be like the pattern string: foo(  || without ')'
    // action_cancel: method: foo();
    constructor(openType, action_return_path, action_cancel, file_system__) {

        if(openType == FILE) {
            wins.push(new Win_Explorer(500, 350, iter, file_system__, "Open File"));
            wins[iter].setPosition(100, 100);

            wins[iter].onSelectItemEvent = function(index) {
                if(this.getPtr().getItemByIndex(this.selected_item).type() == FILE)
                    $(`#win-${this.id_win} > .win-content > .exp-dialog-bar > input`).val(this.getPtr().getItemByIndex(this.selected_item).getName());
            }

            iter++;
        } else if (openType == DIR) {
            wins.push(new Win_Explorer(500, 350, iter, file_system__, "Open Folder"));
            wins[iter].setPosition(100, 100);

            wins[iter].onSelectItemEvent = function(index) {
                if(this.getPtr().getItemByIndex(this.selected_item).type() == DIR)
                    $(`#win-${this.id_win} > .win-content > .exp-dialog-bar > input`).val(this.getPtr().getItemByIndex(this.selected_item).getName());
            }

            iter++;
        } else {
            throwErr(new ERROR("FDOpener -> constructor()", "ERROR_INVALID_VALUE", `Incorrect openType. Shall be DIR or FILE`))
            return false;
        }

        let content = `<div class="exp-dialog-bar"><div class="exp-wrapper-btns"><button onclick="FDOpener.execCancelAction('`+action_cancel+`', ${iter - 1})">Cancel</button><button onclick="FDOpener.execAcceptAction('`+action_return_path+`', ${iter - 1}, '${openType}')">Ok</button></div><input type="text" disabled="disabled"></div>`;
            //<select><option value="all files">All *.*</option></select>

        wins[iter-1].setContent(wins[iter-1].getContent() + content);
        wins[iter-1].onResizeEvent = function() {
            let h = parseInt($('#win-' + this.id_win).css("height"));
            $('#win-' + this.id_win + '> .win-content > .exp-wrapper').css("height", h - 155);
        }
        wins[iter-1].onResizeEvent();

        $("#win-" + (iter-1) + " > .win-top > span > i.icon-maximize").remove();
        $("#win-" + (iter-1) + " > .win-top > span > i.icon-minimize").remove();

        wins[iter-1].setClickArrowsEvents();

        return true;
    }

    static execAcceptAction(action_rtn_p, curr_iter, type) {
        if(type == DIR) {
            eval(`${action_rtn_p} '${wins[curr_iter].getPtr().getPath()}')`);
            wins[curr_iter].action_close();
            delete this;
        } else {
            let path = `${wins[curr_iter].getPtr().getPath()}${wins[curr_iter].getPtr().getBinders().at(wins[curr_iter].getSelectedItemIndex()).getName()}`;

            if(wins[curr_iter].getPtr().system.readPath(path).type() == FILE) {
                eval(`${action_rtn_p} '${path}')`);
                wins[curr_iter].action_close();
                delete this;
            } else {
                xwarning("Open File", "You did not choose any file.<br/> You must open any file or cancel action.");
            }
            
        }
    }

    static execCancelAction(action_cnc, curr_iter) {
        eval(action_cnc);
        wins[curr_iter].action_close();
        delete this;
    }

    // open file without any GUI in the default system file or in the chosen system.
    static openFile(path, sys) {
        if(sys == undefined) {
            let r = file_system.readPath(path);
            if(r.type() == FILE)
                return r;
            else
                return ERRORV;
        } else {
            return sys.readPath(path);
        }
    }
}

// FDSaver does easy saving files and creating them.
class FDSaver {
    // file: file object what you want to save
    // action_return_path: action where will be returned path of new file
    // action_cancel: action when creating will be cancelled
    constructor(file, action_return_path, action_cancel, file_system__) {
        if(file == undefined || file.type() != FILE) {
            console.error("file value in the FDSaver is invalid to correctly run.");
            return -1;
        } 

        wins.push(new Win_Explorer(500, 350, iter, file_system__, "Save file"));
        wins[iter].setPosition(300, 150);
        wins[iter]._saving_file_keeper_ = file;
        iter++;

        let content = `<div class="exp-dialog-bar"><div class="exp-wrapper-btns"><button onclick="FDSaver.execCancelAction('${action_cancel}', ${iter - 1})">Cancel</button><button onclick="FDSaver.execAcceptAction('`+action_return_path+`', ${iter - 1})">Ok</button></div><input type="text" value="${file.getName()}"></div>`;
            //<select><option value="all files">All *.*</option></select>

        wins[iter-1].setContent(wins[iter-1].getContent() + content);
        wins[iter-1].onResizeEvent = function() {
            let h = parseInt($('#win-' + this.id_win).css("height"));
            $('#win-' + this.id_win + '> .win-content > .exp-wrapper').css("height", h - 155);
        }
        wins[iter-1].onResizeEvent();

        $("#win-" + (iter-1) + " > .win-top > span > i.icon-maximize").remove();
        $("#win-" + (iter-1) + " > .win-top > span > i.icon-minimize").remove();

        wins[iter-1].setClickArrowsEvents();
    }

    static execAcceptAction(action_rtn_p, curr_iter) {
        let w = wins[curr_iter]; // window
        let namefile = $(`#win-${curr_iter} > .win-content > .exp-dialog-bar > input`).val();
        if(!ErrorHandler.throwIf(w._saving_file_keeper_.rename(namefile)) && 
        !ErrorHandler.throwIf(FDSaver.saveFile(w._saving_file_keeper_, w.getPtr().getPath(), w.getPtr().system))) {
            eval(`${action_rtn_p} '${w.getPtr().getPath()}')`);
        }
        w.action_close();
        delete this;
    }

    static execCancelAction(action_cnc, curr_iter) {
        eval(action_cnc);
        wins[curr_iter].action_close();
        delete this;
    }

    // save file without any GUI in the default system file or in the chosen system.
    static saveFile(file, path, sys) {
        if(sys.existPath(path)) {
            let obj = sys.readPath(path);
            if(!obj.checkAttr(FORBID_MK_ITEMS)) {
                let rt = 0;
                let namev = obj.getByName(file.getName());
                if(namev != ERRORV) {
                    obj.removeBinder(obj.getIndexOf(namev));
                }
                rt = sys.pushIntoPath(path, file);
                $("#handler_event").trigger('exp_refresh');
                return rt;
            } else {
                return new ERROR("FDSaver -> saveFile(...)", "ERROR_FORBIDDEN_MK", `Chosen folder ${obj.getName()} by user has forbidden rights to save file.`);
            }
            ;
        } else {
            return new ERROR("FDSaver -> saveFile(...)", "ERROR_PATH_EXISTANCE", `Path '${path}' doesn't exist in the file system.`);
        }
        
    }
}