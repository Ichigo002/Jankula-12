//Create new active window on the desktop
function NewWindow(name, width, height, posX, posY, icon) 
{
    if(name == null)
        name = "Default Window";
    if(icon == null)
        icon = "|Nan|";
    if(width < 200 || width == null)
        width = 200;
    if(height < 100 || height == null)
        height = 100;
            
    wins.push(new Window(name, width, height, iter, icon));
    wins[iter].setPosition(posX, posY);
    wins[iter].SetDraggingEvent();
    wins[iter].ActiveZIndex();
    iter++;
}

//Execute action of window
function ExecWin(n, action) {
    wins.forEach(w => {
        if(w.name == n) {
            switch (action) {
                case "close": w.action_close(); break;
                case "max": w.action_maxmalise(); break;
                case "min": w.action_minimalise(); break;
                default:
                    console.error("Action '"+action+"' is not handled by window.");
                    return false;
            }
            return true;
        }
    });
    console.error("Window '"+n+"' not found in list.");
    return false;
}

//Return amount of all used windows
function getAmountWins() {
    let c = 0;
    wins.forEach(w => {
        if(w != null)
            c++;
    });
    return c;
}