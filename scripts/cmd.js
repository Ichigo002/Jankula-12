console.log("---\n For basic commands and variables type command: 'help()'\n---")

function help() {
    console.log("------ Commands ------ \n"+
    "* func NewWindow(name, width, height, posX, posY, icon) | Create a new Window on the desktop\n" +
    "* func getAmountWins()       | return amount of all windows\n" +
    "* func CloseWindow(name)     | Close ALL windows with 'name'\n" +
    "* func Open(name)            | Open system windows by name'\n" +
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
        icon = "<i class='icon-default-icon'></i>";
    if(width < this.min_width_win || width == null)
        width = this.min_width_win;
    if(height < this.min_height_win || height == null)
        height = this.min_height_win;
            
    wins.push(new Window(name, width, height, iter, icon));
    wins[iter].setPosition(posX, posY);
    iter++;
}

function stapp(name) {
    switch(name) {
        case "default":
            NewWindow();
        break;
        case "explorer":
            wins.push(new Win_Explorer(500, 350, iter, file_system));
            wins[iter].setPosition(100, 100);
            iter++;
        break;
        default:
            console.error("Window to open with name '" + name +"' doesn't exist");
        break;
    }
}

function CloseWindow(name) {
    wins.forEach(w => {
        if(w.name == name)
        {
            w.action_close();
        }
    });
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