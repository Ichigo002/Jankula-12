window.onload = Start;

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
    NewWindow("Lorem ipsum dolor ", 200, 100, 100, 500, '<i class="icon-cancel"></i>');
    NewWindow("wdw", 470, 260, 784, 31, '<i class="icon-cancel"></i>');
    NewWindow("32", 429, 269, 145, 38, '<i class="icon-cancel"></i>');
}