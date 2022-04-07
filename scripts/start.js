window.onload = Start;

// windows
var wins = [];
var iter = 0;
// Z-index
var min_z = 10;
var max_z = 200;
var z_index = min_z;

function Start() {
    NewWindow("Loving", 450, 250, 145, 300, '<i class="icon-cancel"></i>');
    NewWindow("wdw", 450, 250, 145, 300, '<i class="icon-cancel"></i>');
    NewWindow("32", 450, 250, 145, 300, '<i class="icon-cancel"></i>');
}

function NewWindow(name, width, height, posX, posY, icon) 
{
    if(name == null)
        name = "Default Window";
    if(icon == null)
        icon = "|Nan|";
    if(width < 100 || width == null)
        width = 100;
    if(height < 100 || height == null)
        height = 100;
            
    wins.push(new Window(name, width, height, iter, icon));
    wins[iter].setPosition(posX, posY);
    wins[iter].SetDraggingEvent();
    wins[iter].ActiveZIndex();
    iter++;
}