const ERRFILE = -1;
const BINDER = "Binder Object";
const FILE = "File";
const DIR = "Directory";

class FileSystem {
    constructor() {
        console.log("system");
        this.root_folder = new Folder(this.begin());
        this.root_folder.pushBinder(new File("Testero.txt"));
        this.root_folder.pushBinder(new File("Wiki.txt"));
        this.root_folder.pushBinder(new Folder("xampp"));
        this.root_folder.pushBinder(new Folder("bin"));
        this.root_folder.pushBinder(new Folder("user"));
        this.root_folder.getByName("bin").pushBinder(new File("Elo"));
        this.root_folder.getByName("bin").pushBinder(new File("WIKI I love.txt"));
        this.root_folder.getByName("bin").pushBinder(new Folder("Folder"));
        
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

class BinderObject {
    constructor(name) {
        this.name = name;
    }

    getByName(name) {
        return 'x-BinderObject-x';
    }

    type() {
        return BINDER;
    }
}

class DirFollower {
    constructor(system) {
        this.system = system;
        this.curr_path = system.begin() + '/';
    }

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
                    return "Successfule executed";
                } else {
                    return "Invalid Coming back";
                }
            }
        } else {
            let new_p = this.curr_path + dir + '/';
            if(this.system.existPath(new_p)) {
                this.curr_path = new_p;
                return "Successfule executed";
            } else {
                return "Invalid Directory '" + dir +"'";
            }
        }

        
    }

    mkdir(name_dir) {

    }

    mkfile(name_dir) {
        
    }

    del(name_dir) {

    }

    print() {
        return "DirFollower: Path is '" + this.curr_path + "'";
    }

    getPath() {
        return this.curr_path;
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