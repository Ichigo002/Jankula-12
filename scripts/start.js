window.onload = Start;

//System
var file_system;
var tr; // for testing only
var cxtm;
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
    
    //ONLY FOR TESTS
    NewWindow("DEMO HELP", 470, 300, 250, 175, '<i class="icon-settings"></i>');
    wins[0].setContent("<span style='text-align: left;'><h2>Help</h2><p>Press Shift + Ctrl + C to open inspector and console. In the console type 'help()' for more commands.</p><h2>Use Open(name)</h2><p>If you are at the console you can type stapp('explorer') and after click enter it should open file explorer.</p></span>");
    wins[0].static = true;
    wins[0].setPositionResizePoint();

    stapp("explorer");

    wins.push(new Win_Properties(iter));
    let p = wins[iter];
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
    file_system.root_folder.getByName("bin").pushBinder(new Folder("Gorące mamuśki"));
    file_system.root_folder.getByName("bin").getByName("Gorące mamuśki").pushBinder(new File("Nie dla psa kielbasa"));
        
    file_system.printHierarchyTree();
}