var SEPARATOR = "sep";
var STANDARD = "std";
var SPLITTER = "spr";

class ContextMenu {
    constructor() {
        this.current_menu = new MenuTemplate("Default Menu");

        this.current_menu.pushNewOption("New", "console.log('NEW FILE CREATING!')");
        this.current_menu.pushNewOption("Delete", null);
        this.current_menu.pushNewSeparator();
        this.current_menu.pushNewOption("Exit", "alert('EXIT!')");

        $('#cxtm').css('display', 'none');

        this.setDisplayEvent();
        this.RefreshMenu();
    }

    setNewMenu(new_menu_temp) {
        this.current_menu = new_menu_temp;
        this.RefreshMenu();
    }

    RefreshMenu() {
        $('#cxtm').empty();
        this.current_menu.menu.forEach(w => {
            switch(w.type) {
                case STANDARD:
                    $('#cxtm').append('<div class="menu-option" onclick="' + w.action + '">'+w.content +'</div>');
                break;
                case SEPARATOR:
                    $('#cxtm').append('<div class="menu-sep" onclick="' + w.action + '">'+w.content+'</div>');
                break;
                case SPLITTER: 

                break;
                default: 
                    console.error("Type Option '" + w.type + "' is not available.");
                break;
            }
            
        });
    }

    setDisplayEvent() {
        let clicked = false;

        $('#cxtm').on("mousedown", function() {
            clicked = true;
        });

        $("body").on("mousedown", function(e) {
            if(e.which == 3) {
                $('#cxtm').css('display', 'block');
                $('#cxtm').css('left', e.pageX);
                $('#cxtm').css('top', e.pageY);
            } else {
                if(!clicked) {
                    $('#cxtm').css('display', 'none'); 
                } else {
                    clicked = false;
                }
            }
        });

    }

    ForceClose() {
        $('#cxtm').css('display', 'none'); 
        return "Closed";
    }
}

class MenuTemplate {
    constructor(temp_name) {
        this.menu = [];
        this.name = temp_name;

    }

    pushNewOption(title, action) {
        return this.menu.push(new _MenuTempOption_(STANDARD, title, action));
    }

    pushNewSeparator() {
        return this.menu.push(new _MenuTempOption_(SEPARATOR, "", null));
    }

    pushNewSplitOption(title, submenu_temp) {
        return this.menu.push(new _MenuTempSplitter_(title, submenu_temp));
    }
}

class _MenuTempOption_ {
    constructor(type, cnt, action) {
        this.content = cnt;
        this.action = action;
        this.type = type;
    }
}

class _MenuTempSplitter_ extends _MenuTempOption_{
    constructor(cnt, menu_temp) {
        super(SPLITTER, cnt, null);
        this.submenu = menu_temp;
    }
}