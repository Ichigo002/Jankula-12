console.log("---\n For basic commands and variables type command: 'help()'\n---")

function help() {
    console.log("------ Commands ------ \n"+
    "* func getAmountWins()       | return amount of all windows\n" +
    "* func CloseWindow(name)     | Close ALL windows with 'name'\n" +
    "* func stapp(name)           | Open system windows by name'\n" +
    "    -> 'default'\n" +
    "    -> 'explorer'\n" +
    "    -> 'demo-help'\n" +
    "    -> 'src'\n" +
    "    -> 'design-studio'\n" +
    "\n" +
    "------ Vars ------ \n" +
    "* wins[]         | All existing windows in the website\n" +
    "* file_system    | Variable keeps all file system with files. You can use it to manipulate files\n" +
    "* tr             | Directory follower is used to manipulate files. It's smart pointer. [ONLY FOR TESTS]\n" +
    "* cxtm           | Context menu is shown if you click right button.\n" +
    "* min_z          | Minimal z-index value of active window\n" +
    "* max_z          | Maximal z-index value of active window\n" +
    "* z_index        | Last used z-index value by window\n");

    return "executed";
}

function stapp(name) {
    switch(name) {
        case "default":
            wins.push(new Window(iter));
            iter++;
        break;
        case "explorer":
            wins.push(new Win_Explorer(500, 350, iter, file_system));
            wins[iter].setPosition(100, 100);
            iter++;
        break;
        case "demo-help"://ONLY FOR TESTS
            wins.push(new Window(iter, "DEMO HELP", 470, 300, 'icon-settings'));
            wins[iter].setPosition(900, 400);
            wins[iter].setContent("<span style='text-align: left;'><h2>Help</h2><p>Press Shift + Ctrl + C to open inspector and console. In the console type 'help()' for more commands.</p><h2>Use stapp(name)</h2><p>If you are at the console you can type stapp('explorer') and after click enter it should open file explorer.</p></span>");
            wins[iter].static = true;
            wins[iter].setPositionResizePoint();
            iter++;
        break;
        case "src":
            wins.push(new Window(iter, "Source Code", 400, 200, 'icon-app-notebook'));
            wins[iter].setPosition(1300, 160);
            wins[iter].setContent("<h1 padding='20px'><a href='https://github.com/Ichigo002/Jankula-12.git' target='_blank'>Kod źródłowy github</a></h1>");
            wins[iter].static = true;
            wins[iter].setPositionResizePoint();
            iter++;
        break;
        case "design-studio":
            wins.push(new Win_Dev_Design(iter));
            wins[iter].Set("designer-cnt");
            wins[iter].setPosition(250, 250);
            iter++;
        break;
        default:
            console.error("Window to open with name '" + name +"' doesn't exist");
        break;
    }
    return iter-1;
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