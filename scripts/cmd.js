console.log("---\n For basic commands and variables type command: 'help()'\n---")

function help() {
    console.log("------ Commands ------ \n"+
    "* func NewWindow(name, width, height, posX, posY, icon) | Create a new Window on the desktop\n" +
    "* func ExecWin(name, action) | window with 'name' executes 'action'\n" +
    "* func getAmountWins()       | return amount of all windows\n" +
    "------ Vars ------ \n" +
    "* wins[]         | All existing windows in the website\n" +
    "* min_width_win  | Minimal width of window\n" +
    "* min_height_win | Minimal height of window\n" +
    "* min_z          | Minimal z-index value of active window\n" +
    "* max_z          | Maximal z-index value of active window\n" +
    "* z_index        | Last used z-index value by window\n");

    return "executed";
}

//Create new active window on the desktop
function NewWindow(name, width, height, posX, posY, icon) {
    if(name == null)
        name = "Default Window";
    if(icon == null)
        icon = "<i class='icon-doc-inv'></i>";
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