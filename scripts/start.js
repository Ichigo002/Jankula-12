window.onload = Start;

//file system
var file_system;
var tr;
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
    file_system = new FileSystem();
    tr = new DirFollower(file_system);
    
    NewWindow("Lorem ipsum dolor ", 200, 100, 100, 500, '<i class="icon-settings"></i>');
    //NewWindow("wdw", 470, 260, 784, 31, '<i class="icon-app-calculator"></i>');
    //NewWindow("32", 429, 269, 145, 38, '<i class="icon-app-terminal" style="margin-right: 5px;"></i>');

    wins.push(new Win_Explorer(400, 250, iter, file_system));
    wins[iter].setPosition(100, 100);
    iter++;
    wins.push(new Win_Explorer(400, 250, iter, file_system));
    wins[iter].setPosition(100, 100);
    iter++;
}