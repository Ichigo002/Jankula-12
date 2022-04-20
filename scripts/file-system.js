const ERRFILE = -1;

const BINDER = "Binder Object";
const FILE = "File";
const DIR = "Directory";
const ALL = "dirs&files";

class FileSystem {
    constructor() {
        console.log("system");
        this.root_folder = new Folder(this.begin());
        this.root_folder.pushBinder(new File("Testero.txt"));
        this.root_folder.pushBinder(new File("be_be"));
        this.root_folder.pushBinder(new Folder("xampp"));
        this.root_folder.pushBinder(new Folder("bin"));
        this.root_folder.pushBinder(new Folder("user"));
        this.root_folder.getByName("bin").pushBinder(new File("Elo"));
        this.root_folder.getByName("bin").pushBinder(new File("W.txt"));
        this.root_folder.getByName("bin").pushBinder(new Folder("Gorące mamuśki"));
        this.root_folder.getByName("bin").getByName("Gorące mamuśki").pushBinder(new File("Nie dla psa kielbasa"));
        
        this.printHierarchyTree();
        
        console.log(this.readPath("R:/bin/"));
        console.log(this.readPath("R:/Testero.txt"));
    }

    readPath(path) {
        let dirs = path.split('/');
        let curr_dir = this.root_folder;
        let curr_level = 0;

        if(dirs[dirs.length-1] == ' ' || dirs[dirs.length-1] == '') {
            dirs.pop();
        }

        while(curr_level < dirs.length)
        {
            if(dirs[curr_level] == curr_dir.name)
            {
                curr_level++;
                if(curr_level < dirs.length)
                    curr_dir = curr_dir.getByName(dirs[curr_level]);
            }
            else {
                
                return ERRFILE;
            }
        } 
        return curr_dir;
    }

    existPath(path) {
        let f = this.readPath(path);
        if(f != ERRFILE) {
            return true;
        } else {
            return false;
        }
    }

    printHierarchyTree() {
        let c = "TREE DIRS\nR:\n";

        this.root_folder.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                c += "  \\_ [FILE] | " + bind.name + '\n';
            } else {
                c += "  \\_ [DIR]  | " + bind.name + '\n';
                c += bind.__print_tree(2);
            }
        });

        console.log(c);
    }

    begin() {
        return "R:";
    }
}

class DirFollower {
    constructor(system) {
        this.system = system;
        this.curr_path = system.begin() + '/';
    }

    //[TO FIX] USING FILE IN THE PATH AS FOLDER
    // moving pointer in the files ['..' -> go out ; 'path' -> go to typed path]
    goto(dir) {
        if(dir == "..") {
            if(this.curr_path == this.system.begin() + '/') {
                return "Cannot go back directory";
            } else {
                let splitp = this.curr_path.split('/');
                let new_p = "";
                for (let i = 0; i < splitp.length-2; i++) {
                    new_p += splitp[i] + '/';
                }
                if(this.system.existPath(new_p)) {
                    this.curr_path = new_p;
                    this.onChangePathEvent();
                    return "Successful executed";
                } else {
                    return "ERRGO: Invalid Coming back";
                }
            }
        } else {
            let new_p = this.curr_path + dir + '/';
            if(this.system.existPath(new_p) && this.system.readPath(new_p).type() == DIR) {
                this.curr_path = new_p;
                this.onChangePathEvent();
                return "Successful executed";
            } else {
                return "ERRFIND: Invalid Directory '" + dir +"'";
            }
        }
    }

    //create directory in the current path
    mkdir(name_dir) {
        if(this.system.existPath(this.curr_path)) {
            this.system.readPath(this.curr_path).pushBinder(new Folder(name_dir));
            return "Directory Created at place '" + this.curr_path + name_dir + "/'";
        } else {
            return "ERREXT: Path to make directory doesn't exist";
        }
    }

    //create file in the current path
    mkfile(name_file) {
        if(this.system.existPath(this.curr_path)) {
            this.system.readPath(this.curr_path).pushBinder(new File(name_file));
            return "File Created at place '" + this.curr_path + name_file + "'";
        } else {
            return "ERREXT: Path to make directory doesn't exist";
        }
    }

    // delete the binder from current path
    del(name) {
        if(this.system.existPath(this.curr_path)) {
            if(this.system.readPath(this.curr_path + name).type() == DIR) {
                if(this.system.readPath(this.curr_path + name).countAll() != 0) {
                    let ans = prompt("Are you sure to delete " + name + "? This folder contains other files. [Y/N]");
                    if(ans.toLowerCase() == 'y') {
                        return this.__delPerm__(name);
                    } else if(ans.toLowerCase() == 'n') {
                        return "Deleting directory cancelled.";
                    }
                } else {
                    this.onChangePathEvent();
                    return this.__delPerm__(name);
                }
            } else {
                this.onChangePathEvent();
                return this.__delPerm__(name);
            }
        } else {
            return "ERREXT: Path to delete directory doesn't exist";
        }
    }

    __delPerm__(name) {
        let index = this.system.readPath(this.curr_path).getIndexOf(name);
        this.system.readPath(this.curr_path).removeBinder(index);
        return "Item " + name + " successfuly deleted from '" + this.curr_path + "'";

    }

    // count sepcific items by filterring data
    count(filter) {
        switch (filter) {
            case DIR:
                return this.system.readPath(this.curr_path).countDirs();
                break;
            case FILE:
                return this.system.readPath(this.curr_path).countFiles();
            break;
            case ALL:
                return this.system.readPath(this.curr_path).countAll();
                break;
            default:
                return "ERRCNT: Invalid filter. Available filters counting: [DIR], [FILE], [ALL]";
                break;
        }
    }

    getBinders() {
        if(this.system.existPath(this.curr_path)) {
            return this.system.readPath(this.curr_path).binder_list;
        }
    }

    // print current chosen directory
    pdir() {
        this.system.readPath(this.curr_path).printDirectory();
    }

    path() {
        return "Path is '" + this.curr_path + "'";
    }

    getPath() {
        return this.curr_path;
    }

    onChangePathEvent() { ; }
}

class BinderObject {
    constructor(name) {
        this.name = name;
        let dd = new Date();
        this.date = dd.getMonth() + "/" + dd.getDay() + "/" + dd.getFullYear();
        this.time = ((dd.getHours() < 10)? "0":"") + dd.getHours() + ":" + ((dd.getMinutes() < 10)? "0":"") + dd.getMinutes();
    }

    getByName(name) {
        return 'x-BinderObject-x';
    }

    type() {
        return BINDER;
    }
}

class Folder extends BinderObject {
    constructor(name) {
        super(name); // calls constructor of BinderObject
        this.binder_list = [];
    }

    pushBinder(ext_binder) {
        this.binder_list.push(ext_binder);
    }

    removeBinder(index) {
        this.binder_list.splice(index, 1);
    }

    getIndexOf(name) {
        for (let i = 0; i < this.binder_list.length; i++) {
            if(this.binder_list[i].name == name) {
                return i;
            }
        }
    }

    getByIndex(index) {
        if(index < this.binder_list.length && index >= 0) {
            return this.binder_list[index];
        }
    }

    getByName(name) {
        let result = ERRFILE;

        this.binder_list.forEach(bind => {
            if(bind.name == name) {
                result = bind;
            }
        });

        return result;
    }

    printDirectory() {
        let c = "DIR " + this.name + ":\n";

        this.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                c += "\\_ [FILE] | " + bind.name + '\n';
            } else {
                c += "\\_ [DIR]  | " + bind.name + '\n';
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
                c += add + "\\_ [FILE] | " + bind.name + '\n';
            } else {
                c += add + "\\_ [DIR]  | " + bind.name + '\n';
                c += bind.__print_tree(a+2);
            }
        });
        return c;
    }

    //count all files & dirs.
    countAll() {
        return this.binder_list.length;
    }

    //count only files.
    countFiles() {
        let n = 0;

        this.binder_list.forEach(bind => {
            if(bind.type() == FILE) {
                n++;
            }
        });

        return n;
    }

    //count only dirs.
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

    type() {
        return DIR;
    }
}

class File extends BinderObject {
    constructor(name) {
        super(name); // calls constructor of BinderObject
       
    }

    getByName(name) {
        return this;
    }

    type() {
        return FILE;
    }
}