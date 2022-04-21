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

    file_system = new FileSystem();
    tr = new DirFollower(file_system);
    cxtm = new ContextMenu();
    
    NewWindow("DEMO HELP", 470, 300, 250, 175, '<i class="icon-settings"></i>');
    wins[0].setContent("<span style='text-align: left;'><h2>Help</h2><p>Press Shift + Ctrl + C to open inspector and console. In the console type 'help()' for more commands.</p><h2>Use Open(name)</h2><p>If you are at the console you can type stapp('explorer') and after click enter it should open file explorer.</p></span>");
    wins[0].static = true;
    wins[0].setPositionResizePoint();
    stapp("explorer");
    xerror("Love...", "Lorem ipsum dolor<br/> sit amet, consectetur adipiscing elit. Vivamus tincidunt<br/> vitae nunc id ullamcorper. Nam <br/>et odio sollicitudin, ultricies velit<br/> vel, hendrerit metus.");

}