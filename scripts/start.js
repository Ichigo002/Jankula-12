window.onload = Start;

//System
var file_system;
var tr; // for testing only
var cxtm; // context menu
// windows
var wins = [];
var iter = 0;
var min_width_win = 200;
var min_height_win = 150;
// Z-index
var min_z = 10;
var max_z = 200;
var z_index = min_z;

function Start() {
    //Disable default context menu of browser
    $(document).bind("contextmenu",function(e){
        return false;
    });

    // Creating basic systems
    file_system = new FileSystem("SYS1:");
    basicFiles();
    tr = new DirFollower(file_system); // ONLY FOR TESTS
    cxtm = new ContextMenu();

    stapp("demo-help");
    stapp("explorer");
    stapp("src");

    wins.push(new Win_Properties(iter));
    let p = wins[iter];
    p.pushNewValue("Type", "NaN");
    p.pushNewValue("loremp", "NaN");
    p.pushSeparator();
    p.pushNewValue("avallach'oloi", "NaN");
    p.pushNewValue("fastly?", "NaN");
    iter++;
}

function basicFiles() {
    file_system.root_folder.pushBinder(new File("Testero.txt"));
    file_system.root_folder.pushBinder(new File("be_be"));
    file_system.root_folder.pushBinder(new Folder("xampp"));
    file_system.root_folder.pushBinder(new Folder("bin"));
    file_system.root_folder.pushBinder(new Folder("user"));
    file_system.root_folder.getByName("xampp").pushBinder(new File("htdocs"));
    file_system.root_folder.getByName("bin").pushBinder(new File("Elo"));
    file_system.root_folder.getByName("bin").pushBinder(new File("W.txt"));
    file_system.root_folder.getByName("bin").pushBinder(new Folder("hot"));
    file_system.root_folder.getByName("bin").getByName("hot").pushBinder(new File("Nie dla psa kielbasa"));
        
    file_system.printHierarchyTree();
}