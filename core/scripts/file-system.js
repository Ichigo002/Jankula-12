ERRFILE = -1;
// Types
const BINDER = "Binder Object";
const FILE = "File";
const DIR = "Directory";
const ALL = "dirs&files";

// Attributes which are used for files & folders by system
const REMOVABLE = 0, 
    EDITABLE = 1, 
    CHANGEABLE_NAME = 2,
    HIDDEN = 3,
    COPYABLE = 4,
    READ_ONLY = 5,
    FORBID_MK_ITEMS = 6,
    CUTABLE = 7;


class FileSystem {
    // VALUE: start_dir_name => basic folder where tree hierarchy starts. For instance 'C:'
    constructor(start_dir_name) {
        if(start_dir_name == "" || start_dir_name == undefined) {
            this.stdirn = "R:";
        } else {
            this.stdirn = start_dir_name;
        }

        this.root_folder = new Folder(this.begin()).addAttr(FORBID_MK_ITEMS);

        this._mkDefDir_("Desktop");
        this._mkDefDir_("Documents");
        this._mkDefDir_("Pictures");
        this._mkDefDir_("Jankula");
    }

    // create default folder unremoveable, uneditable, unchangeable name, uncutable at the chosen folder
    // If path is undefined then create at the root folder
    _mkDefDir_(name, path) {
        let fol = new Folder(name);
        fol.removeAttr(REMOVABLE).removeAttr(EDITABLE).removeAttr(CHANGEABLE_NAME).removeAttr(CUTABLE);

        if(path == undefined) {
            this.root_folder.pushBinder(fol);
        } else {
            this.readPath(path).pushBinder(fol);
        }
        return this;
    }

    // Reads input path and returns directory on which path pointed
    readPath(path) {
        let dirs = path.split('/');
        let curr_dir = this.root_folder;
        let curr_level = 0;

        if(dirs[dirs.length-1] == ' ' || dirs[dirs.length-1] == '') {
            dirs.pop();
        }

        while(curr_level < dirs.length)
        {
            if(curr_dir != -1) {
                if(dirs[curr_level] == curr_dir.getName())
                {
                    curr_level++;
                    if(curr_level < dirs.length)
                        curr_dir = curr_dir.getByName(dirs[curr_level]);
                }
                else {
                    
                    return new ERROR("FileSystem -> readPath(...)", "ERROR_READ_PATH", `Not found path: <br/>'${path}'`);
                }
            } else {
                return new ERROR("FileSystem -> readPath(...)", "ERROR_READ_PATH", `Not found path: <br/>'${path}'`);
            }
            
        }
        return curr_dir;
    }

    // Checks is path in the system
    // RETURNS: true or false
    existPath(path) {
        let f = this.readPath(path);
        if(ErrorHandler.check(f)) {
            return false;
        } else {
            return true;
        }
    }

    // Push file into the path
    pushIntoPath(path, file) {
        if(this.existPath(path)) {
            if(!this.readPath(path).checkAttr(FORBID_MK_ITEMS)) {
                this.readPath(path).pushBinder(file);
                return path + file.getName();
            } else {
                return new ERROR("FileSystem -> addfile(...)", "ERROR_MUSTN_ADDING", `The directory at <br/> '${path}' has forbidden adding  new files`);
            }
        } else {
            return new ERROR("FileSystem -> addfile(...)", "ERROR_PATH_EXISTANCE", `Path '${path}' doesn't exist. <br/> Cannot add file`);
        }
    }

    // Print ALL system files, folder etc. in the js console.
    printHierarchyTree() {
        let c = "TREE DIRS\n"+this.begin()+"\n";

        this.root_folder.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                c += "  \\_ [FILE] | " + bind.getName() + '\n';
            } else {
                c += "  \\_ [DIR]  | " + bind.getName() + '\n';
                c += bind.__print_tree(2);
            }
        });

        console.log(c);
    }

    // Returns begin of every path in this system
    begin() {
        return this.stdirn;
    }

    // Check is path correct
    isPathStartCorrectly(path) {
        let st = this.begin();
        let cr = 0;

        for (let i = 0; i < st.length; i++) {
            if(st.at(i) == path.at(i)) {
                cr++;
            }
        }
        if(cr == st.length) {
            return true;
        } else {
            return false;
        }
    }
}

class DirFollower {
    #curr_path;

    constructor(system) {
        this.system = system;
        this.#curr_path = system.begin() + '/';
    }

    //[TO FIX] USING FILE IN THE PATH AS FOLDER
    // moving pointer in the files ['..' -> go out ; 'path' -> go to typed path]
    goto(dir) {
        if(dir == "..") {
            if(this.#curr_path == this.system.begin() + '/') {
                return new ERROR("DirFollower -> goto(...)", "ERROR_GOTO", "Cannot go back directory.", `Pointer cannot go already previous directory <br/> because it is pointing on ${this.system.begin()}`);
            } else {
                let splitp = this.#curr_path.split('/');
                let new_p = "";
                for (let i = 0; i < splitp.length-2; i++) {
                    new_p += splitp[i] + '/';
                }
                if(this.system.existPath(new_p)) {
                    this.#curr_path = new_p;
                    this.onChangePathEvent();
                    return SUCCESS;
                } else {
                    return new ERROR("DirFollower -> goto(...)", "ERROR_GOTO_BACK", `Invalid coming back in the path`);
                }
            }
        } else {
            let new_p;
            if(this.system.isPathStartCorrectly(dir)) {
                new_p = dir;
            } else {
                new_p = this.#curr_path + dir + '/';
            }
            if(this.system.existPath(new_p) && this.system.readPath(new_p).type() == DIR) {
                this.#curr_path = new_p;
                this.onChangePathEvent();
                this.system.readPath(new_p).refreshAccessedTime();
                return SUCCESS;
            } else {
                return new ERROR("DirFollower -> goto(...)", "ERROR_CANNOT_FIND", `Invalid Directory: '${dir}'.`);
            }
        }
    }

    // Returns currently chose directory [object]
    getCurrentDir() {
        return this.system.readPath(this.#curr_path);
    }

    // Add file to current path
    // Returns path of new file
    addfile(file) {
        return pushIntoPath(this.#curr_path, file);
    }

    // Create directory in the current path
    // Returns path of created directory
    mkdir(name_dir) {
        if(this.system.existPath(this.#curr_path)) {
            if(!this.system.readPath(this.#curr_path).checkAttr(FORBID_MK_ITEMS)) {
                this.system.readPath(this.#curr_path).pushBinder(new Folder(name_dir));
                return this.#curr_path + name_dir;
            } else {
                return new ERROR("FileSystem -> mkdir(...)", "ERROR_MUSTN_ADDING", `The directory at <br/> '${this.#curr_path}' has forbidden making new directories`);
            }
        } else {
            return new ERROR("FileSystem -> mkdir(...)", "ERROR_PATH_EXISTANCE", `Path '${this.#curr_path}' doesn't exist. <br/> Cannot make directory`);
        }
    }

    // Create file in the current path
    mkfile(name_file) {
        if(this.system.existPath(this.#curr_path)) {
            if(!this.system.readPath(this.#curr_path).checkAttr(FORBID_MK_ITEMS)) {
                this.system.readPath(this.#curr_path).pushBinder(new File(name_file));
                return "File Created at place '" + this.#curr_path + name_file + "'";
            } else {
                return new ERROR("DirFollower -> mkfile(...)", "ERROR_MUSTN_ADDING", `The directory at <br/> '${this.#curr_path}' has forbidden making new files`); 
            }
        } else {
            return new ERROR("DirFollower -> mkfile(...)", "ERROR_PATH_EXISTANCE", `Path '${this.#curr_path}' doesn't exist. <br/> Cannot make file`);
        }
    }

    // Delete the binder from current path [CONSOLE]
    // OBSOLETE!!!!!
    del(name) {
        if(this.system.existPath(this.#curr_path)) {
            if(this.system.readPath(this.#curr_path + name).type() == DIR) {
                if(this.system.readPath(this.#curr_path + name).countAll() != 0) {
                    let ans = prompt("Are you sure to delete " + name + "? This folder contains other files. [Y/N]");
                    if(ans.toLowerCase() == 'y') {
                        return this.del_noq(name);
                    } else if(ans.toLowerCase() == 'n') {
                        return "Deleting directory cancelled.";
                    }
                } else {
                    this.onChangePathEvent();
                    return this.del_noq(name);
                }
            } else {
                this.onChangePathEvent();
                return this.del_noq(name);
            }
        } else {
            return "ERREXT: Path to delete directory doesn't exist";
        }
    }

    // Continuation of del(name) method. Permanently delete item
    del_noq(name) {
        let p = this.system.readPath(this.#curr_path);
        let index = p.getIndexOf(name);
        if(p.getByIndex(index).checkAttr(REMOVABLE)) {
            p.removeBinder(index);
        return SUCCESS;
        }
        return new ERROR("DirFollower -> mkfile(...)", "ERROR_REMOVING_FORBIDDEN", `Cannot delete item ${name} at '${this.#curr_path}'`);
    }

    // Count sepcific items by filterring data [DIR, FILE, ALL]
    count(filter) {
        switch (filter) {
            case DIR:
                return this.system.readPath(this.#curr_path).countDirs();
            case FILE:
                return this.system.readPath(this.#curr_path).countFiles();
            case ALL:
                return this.system.readPath(this.#curr_path).countAll();
            default:
                return new ERROR("DirFollower -> count(...)", "ERROR_FILTERRING", `Incorrect filter. Available filters: [DIR], [FILE], [ALL]`);
        }
    }

    // Returns list of all items in the currently chosen directory
    getBinders() {
        if(this.system.existPath(this.#curr_path)) {
            return this.system.readPath(this.#curr_path).binder_list;
        }
    }

    //Returns item with index
    getItemByIndex(index) {
        if(index > -1 && index < this.getBinders().length) {
            return this.getBinders()[index];
        } else {
            return new ERROR("DirFollower -> getItemByIndex(...)", "ERROR_INAVLID_INDEX", `Invalid argument index. Index ${index} is out of range this.getBinders()[].`);
        }
    }

    //Returns item with name
    getItemByName(name) {
        for(let i = 0 ; i < this.getBinders().length; i++) {
            if(name == this.getBinders()[i].getName()) {
                return this.getBinders()[i];
            }
        }
        return new ERROR("DirFollower -> getItemByName(...)", "ERROR_INAVLID_NAME", `Invalid argument name.<br/> this.getBinders()[] doesn't contain item with name ${name}.`);
    }

    // Print currently chosen directory
    pdir() {
        this.system.readPath(this.#curr_path).printDirectory();
    }

    // Return full path going to current directory
    getPath() {
        return this.#curr_path;
    }

    // Event is called if path is changed
    onChangePathEvent() { ; }
}

class BinderObject {
    #date_created;
    #time_created;

    #date_modified;
    #time_modified;

    #date_accessed;
    #time_accessed;

    #icon = "icon-default-app";
    #name = "";

    // VALUE: name => name of item
    constructor(name) {
        let dd = new Date();

        this.#date_created = (dd.getMonth()+1) + "/" + dd.getDate() + "/" + dd.getFullYear();
        this.#time_created = ((dd.getHours() < 10)? "0":"") + dd.getHours() + ":" + ((dd.getMinutes() < 10)? "0":"") + dd.getMinutes();

        this.#date_modified = this.#date_created;
        this.#time_modified = this.#time_created;

        this.#date_accessed = this.#date_created;
        this.#time_accessed = this.#time_created;

        this.#icon = "icon-default-app";

        this.attributes = [REMOVABLE, EDITABLE, CHANGEABLE_NAME, COPYABLE];
        return this.rename(name);
    }

    // Change the name of item
    rename(new_) {
        if(this.checkAttr(CHANGEABLE_NAME)) {
            let r = BinderObject.checkName(new_);
            if(r == SUCCESS) {
                this.refreshModifiedTime();
                this.#name = new_;
                return r;
            } else {
                return r;
            }
        } else {
            return new ERROR("FileSystem -> rename(...)", "ERROR_RENAMING_FORBIDDEN", `Renaming this item is forbidden.`);
        }
    }

    // Check is argument name correct for item
    static checkName(name) {
        if(name == undefined || name == null) {
            return "NO_NAME";
        } else if(name.length == 0) {
            return "ZERO_LENGTH";
        } else if(name.includes('/') || name.includes('\\')) {
            return "FORBIDDEN_SIGNS";
        } else {
            return SUCCESS;
        }
    }

    // Returns name of item
    getName() {
        return this.#name;
    }
    // Returns class icon
    getIcon() {
        return this.#icon;
    }
    // Set new class icon
    setIcon(class_icon) {
        if(class_icon != '' || class_icon != undefined)
            this.#icon = class_icon;
    }
    // Removes Attribute
    removeAttr(attr) {
        for( var i = 0; i < this.attributes.length; i++){ 
            if ( this.attributes[i] === attr) { 
                this.attributes.splice(i, 1); 
            }
        }
        return this;
    }
    // Adds Attribute
    addAttr(attr) {
        this.attributes.push(attr);
        return this;
    }
    // Checks Attribute
    checkAttr(attr) {
        return this.attributes.includes(attr);
    }
    // Refresh modfied date
    refreshModifiedTime() {
        let dd = new Date();
        this.#date_modified = dd.getMonth() + "/" + dd.getDay() + "/" + dd.getFullYear();
        this.#time_modified = ((dd.getHours() < 10)? "0":"") + dd.getHours() + ":" + ((dd.getMinutes() < 10)? "0":"") + dd.getMinutes();
    }
    // Refresh accessed date
    refreshAccessedTime() {
        let dd = new Date();
        this.#date_accessed = dd.getMonth() + "/" + dd.getDay() + "/" + dd.getFullYear();
        this.#time_accessed = ((dd.getHours() < 10)? "0":"") + dd.getHours() + ":" + ((dd.getMinutes() < 10)? "0":"") + dd.getMinutes();
    }
    // Returns time when file was created
    getCreatedTime() {
        return this.#time_created;
    }
    // Returns date when file was created
    getCreatedDate() {
        return this.#date_created;
    }
    // Returns time when file was modified
    getModifiedTime() {
        return this.#time_modified;
    }
    // Returns date when file was modfied
    getModifiedDate() {
        return this.#date_modified;
    }
    // Returns time when file was accessed
    getAccessedTime() {
        return this.#time_accessed;
    }
    // Returns date when file was accessed
    getAccessedDate() {
        return this.#date_accessed;
    }
    // Returns this object
    getThis() {
        return undefined;
    }
    // Returns type of item
    type() {
        return BINDER;
    }
}

class Folder extends BinderObject {
    // VALUE: name => name of new folder
    constructor(name) {
        super(name); // calls constructor of BinderObject
        this.binder_list = [];
        this.slct_pos = NONE;
        this.setIcon('icon-folder-open');
    }

    // Pushes to folder new Item
    pushBinder(ext_binder) {
        this.binder_list.push(ext_binder);
    }

    // Removes from folder item with index
    removeBinder(index) {
        this.binder_list.splice(index, 1);
    }

    // Returns index in the folder of the item with name
    getIndexOf(name) {
        for (let i = 0; i < this.binder_list.length; i++) {
            if(this.binder_list[i].getName() == name) {
                return i;
            }
        }
    }

    // Returns item object by index
    getByIndex(index) {
        if(index < this.binder_list.length && index >= 0) {
            return this.binder_list[index];
        }
    }

    // Returns item object by name
    // ERROR CASE: Returns ERRORV
    getByName(name) {
        let result = ERRORV;

        this.binder_list.forEach(bind => {
            if(bind.getName() == name) {
                result = bind;
            }
        });

        return result;
    }

    // Prints in the js console items of the folder
    printDir() {
        let c = "DIR " + this.getName() + ":\n";

        this.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                c += "\\_ [FILE] | " + bind.getName() + '\n';
            } else {
                c += "\\_ [DIR]  | " + bind.getName() + '\n';
            }
        });

        console.log(c);
    }

    __print_tree(a) {
        let c = "";
        let add = "";
        for(let i=0; i < a; i++) {
            add += "   ";
        }
        this.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                c += add + "\\_ [FILE] | " + bind.getName() + '\n';
            } else {
                c += add + "\\_ [DIR]  | " + bind.getName() + '\n';
                c += bind.__print_tree(a+2);
            }
        });
        return c;
    }

    // Count all files & dirs.
    countAll() {
        return this.binder_list.length;
    }

    // Count only files.
    countFiles() {
        let n = 0;

        this.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                n++;
            }
        });

        return n;
    }

    // Count only dirs.
    countDirs(){
        let n = -1;

        this.binder_list.forEach(bind => {
            if(bind.type() == DIR) {
                if(n == -1) {
                    n = 0;
                }
                n++;
            }
        });

        return n;
    }

    // Returns THIS object. Method extended
    getThis(name) {
        return this;
    }

    // Returns type of item [DIR]
    type() {
        return DIR;
    }
}

class File extends BinderObject {
    _ext_ = "";
    #data = "";

    // VALUE: name => name of new file
    constructor(name, ico) {
        super(name); // calls constructor of BinderObject

        this.rename(name);

        if(ico == undefined) {
            this.setIcon("icon-file");
        } else {
            this.setIcon(ico);
        }
    }

    // Overwrite current data saved as html
    overwriteFile(_data) {
        this.#data = _data;
        return SUCCESS;
    }

    // Read current data saved as html
    readFile() {
        return this.#data;
    }

    // Add on the end of current data new data saved as html
    appendData(_new_data) {
        this.#data += _new_data;
        return SUCCESS;
    }

    // EXTENDED METHOD
    rename(new_) {
        let r = super.rename(new_);

        if(r == SUCCESS) {
            this._ext_ = File.splitExt(new_);
            return SUCCESS;
        } else {
            return r;
        }
    }

    // Cut extension from name
    static splitExt(name) {
        if(name.includes(".")) {
            let ex = "";
            for (let i = name.length - 1; i >= 0; i--) {
                if(name.at(i) == ".") {
                    let rex = "";
                    for(let j = ex.length - 1; j >= 0; j--) {
                        rex += ex.at(j);
                    }
                    return rex;
                } else {
                    ex += name.at(i);
                }
            }
        } else {
            return "";
        }
        
    }

    // Returns THIS object. Method extended
    getThis(name) {
        return this;
    }

    // Returns the extension of file. If returns empty that means file hasn't got any extension
    ext() {
        return this._ext_;
    }

    // Returns type of item [FILE]
    type() {
        return FILE;
    }
}