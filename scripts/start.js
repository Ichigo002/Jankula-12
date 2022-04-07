window.onload = Start;

var wins = [];
var iter = 0;
// Z-index
var min_z = 10;
var max_z = 200;
var z_index = min_z;

function Start() {
    NewWindow("1", 300, 100);
    NewWindow("2", 300, 100);
    NewWindow("3", 300, 100);
    NewWindow("4", 300, 100);
}


function NewWindow(name="Default Window", width, height, posX, posY)
{
    wins.push(new Window(name, width, height, iter));
    wins[iter].setPosition(posX, posY);
    wins[iter].SetDraggingEvent();
    wins[iter].ActiveZIndex();
    iter++;
}
