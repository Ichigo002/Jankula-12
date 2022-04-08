//Create new active window on the desktop
function NewWindow(name, width, height, posX, posY, icon) 
{
    if(name == null)
        name = "Default Window";
    if(icon == null)
        icon = "|Nan|";
    if(width < this.min_width_win || width == null)
        width = this.min_width_win;
    if(height < this.min_height_win || height == null)
        height = this.min_height_win;
            
    wins.push(new Window(name, width, height, iter, icon));
    wins[iter].setPosition(posX, posY);
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