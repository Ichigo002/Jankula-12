class FileSystem {
    constructor() {
        console.log("system");
        this.root_folder = new Folder("root");
        this.root_folder.pushBinder(new File("Testero.exe"));
        this.root_folder.pushBinder(new File("co-to.txt"));
        this.root_folder.pushBinder(new Folder("nowy folder fefwgweg"));
        this.root_folder.printDirectory();
    }
}

class BinderObject {
    constructor(name) {
        this.name = name;
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

    at(index) {
        if(index < this.binder_list.length && index >= 0) {
            return this.binder_list[index];
        }
    }

    printDirectory() {
        console.table(this.binder_list);
    }
}

class File extends BinderObject {
    constructor(name) {
        super(name); // calls constructor of BinderObject
       
    }

}