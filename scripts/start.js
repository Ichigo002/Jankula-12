window.onload = Start;

//System
var file_system;
var tr; // for testing only
var cxtm; // context menu
// windows
var wins = [];
var iter = 0;
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
    file_system = new FileSystem("R:");
    basicFiles();
    tr = new DirFollower(file_system); // ONLY FOR TESTS
    cxtm = new ContextMenu();

    //stapp("demo-help");
    stapp("explorer");
    //stapp("src");
    
    //xerror("lorem ipsum", "lorem ipsum del qutiero monror rof EROOR fjos rar !");
    let t = new MenuTemplate("TEST");
    let st = new MenuTemplate("sub TEST");

    t.pushNewOption("File", null);
    t.pushNewOption("feg", null);
    t.pushNewSplitOption("haha", st);
    t.pushNewOption("Fijjjle", null);
    t.pushNewOption("hhhh", null);



    wins.push(new Win_Notebook(iter));
    wins[iter].setPosition(400, 400);
    wins[iter].setToolBar(t);
    iter++;

    //stapp("design-studio");
}

function basicFiles() {
    file_system.root_folder.getByName("Documents").pushBinder(new File("Testero.txt"));
    file_system.root_folder.getByName("Documents").pushBinder(new File("be_be"));
    file_system.root_folder.getByName("Documents").pushBinder(new Folder("xampp"));
    file_system.root_folder.getByName("Documents").pushBinder(new Folder("bin"));
    file_system.root_folder.getByName("Documents").pushBinder(new Folder("user"));
    file_system.root_folder.getByName("Documents").getByName("xampp").pushBinder(new File("htdocs"));
    file_system.root_folder.getByName("Documents").getByName("bin").pushBinder(new File("Elo"));
    file_system.root_folder.getByName("Documents").getByName("bin").pushBinder(new File("W.txt"));
    file_system.root_folder.getByName("Documents").getByName("bin").pushBinder(new Folder("hot"));
    file_system.root_folder.getByName("Documents").getByName("bin").getByName("hot").pushBinder(new File("Nie dla psa kielbasa"));
       
    for (let i = 0; i < 20; i++) {
        file_system.root_folder.getByName("Documents").pushBinder(new Folder("Lorem ipsum"));
    }

    //file_system.printHierarchyTree();
}