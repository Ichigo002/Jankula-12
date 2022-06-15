window.onload = Start;

//System
var file_system;
var tr; // for testing only
var cxtm; // context menu
// windows
var wins = [];
var iter = 0;
var split_id_toolbar = 0;
// Z-index
var min_z = 10;
var max_z = 200;
var z_index = min_z;
//App specific variables:

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
        wins.push(new Win_Notebook(iter));
        wins[iter].setPosition(700, 400);
        iter++;

        //stapp("demo-help");
        //stapp("explorer");
        //stapp("src");
        //new FDOpener(FILE, `console.log(`, "console.log(`looser`)", file_system);
        //new FDOpener(DIR, `console.log(`, "console.log(`looser`)", file_system);

        //let f = new File("watashi.ga");
        //f.appendData("I love wikiw");
        //new FDSaver(f, `console.log(`, "console.log(`looser`)", file_system);

        //stapp("design-studio");
}

function basicFiles() {
    file_system.root_folder.getByName("Documents").pushBinder(new File("Testero.txt"));
    file_system.root_folder.getByName("Documents").pushBinder(new File("be_be.fun"));
    file_system.root_folder.getByName("Documents").pushBinder(new Folder("xampp"));
    file_system.root_folder.getByName("Documents").pushBinder(new Folder("bin"));
    file_system.root_folder.getByName("Documents").pushBinder(new Folder("user"));
    file_system.root_folder.getByName("Documents").getByName("xampp").pushBinder(new File("htdocs.xml"));
    file_system.root_folder.getByName("Documents").getByName("bin").pushBinder(new File("Elo.uwu"));
    file_system.root_folder.getByName("Documents").getByName("bin").pushBinder(new File("Wdxt"));
    file_system.root_folder.getByName("Documents").getByName("bin").pushBinder(new Folder("hot"));
    file_system.root_folder.getByName("Documents").getByName("bin").getByName("hot").pushBinder(new File("Nie dla psa kielbasa"));
       
    for (let i = 0; i < 20; i++) {
        file_system.root_folder.getByName("Documents").pushBinder(new Folder("Lorem ipsum"));
    }

    //file_system.printHierarchyTree();
}