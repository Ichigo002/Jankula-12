window.onload = Start;

var wins = [];
var iter = 0;
var z_index = 10;
var max_z_index = 100;

function Start() {
    NewWindow("Default win", 450, 250);
    NewWindow("dd win", 450, 250);
    NewWindow("UWU", 450, 250);
}

function NewWindow(name, width, height)
{
    wins.push(new Window(name, width, height, iter));
    wins[iter].setPosition(100,260);
    wins[iter].setContent("I love Wiki");
    wins[iter].SetDraggingEvent();
    wins[iter].ActiveZIndex();
    iter++;
}
