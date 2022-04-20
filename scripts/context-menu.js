var SEPARATOR = "sep";
var STANDARD = "std";
var SPLITTER = "spr";

class ContextMenu {
    constructor() {
        this.list_menus = [];
        this.curr = 0;

        let m = new MenuTemplate("Default Menu");
        let sp = new MenuTemplate("Spliter sidefg");
        sp.pushNewOption("ELO", null);
        sp.pushNewSeparator();
        sp.pushNewOption("EKOQQQ", "alert('LOVE!')");

        m.pushNewOption("New", "alert('NEW FILE CREATING!')");
        m.pushNewSplitOption("Splitter", );
        m.pushNewSeparator();
        m.pushNewOption("Exit", "alert('EXIT!')");

        this.list_menus.push(m);

        $('#cxtm').css('display', 'none');

        this.setDisplayEvent();
        this.RefreshMenu();
    }

    addMenu(menu_temp) {
        return this.list_menus.push(menu_temp) - 1;
    }

    RefreshMenu() {
        $('#cxtm').empty();
        this.list_menus[this.curr].menu.forEach(w => {
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
                cxtm.curr = $(e.target).attr("menuv");

                if(cxtm.curr != undefined) {
                    cxtm.RefreshMenu();
                    $('#cxtm').css('display', 'block');
                    $('#cxtm').css('left', e.pageX);
                    $('#cxtm').css('top', e.pageY);
                }
                else {
                    $('#cxtm').css('display', 'none'); 
                }
                
            } else {
                if(!clicked) {
                    $('#cxtm').css('display', 'none'); 
                } else {
                    clicked = false;
                    setTimeout(function() { $('#cxtm').css('display', 'none'); }, 100);
                }
            }
        });

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