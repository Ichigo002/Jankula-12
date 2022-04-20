var SEPARATOR = "sep";
var STANDARD = "std";
var SPLITTER = "spr";

class ContextMenu {
    constructor() {
        this.list_menus = [];
        this.curr = undefined;

        $('#cxtm').css('display', 'none');

        this.setDisplayEvent();
    }

    addMenu(menu_temp) {
        let _new = [];
        let pushed = false;

        for (let i = 0; i <= this.list_menus.length; i++) {
            if(i == this.list_menus.length) {
                if(!pushed) _new.push(menu_temp);
                this.list_menus = _new;
                return _new.length - 1;
            }
            if(this.list_menus.at(i) == null) {
                _new.push(menu_temp);
                pushed = true;
            } else {
                _new.push(this.list_menus.at(i));
            }
        }
    }

    removeMenu(id) {
        let _new = [];

        for (let i = 0; i < this.list_menus.length; i++) {
            if(id != i) {
                _new.push(this.list_menus.at(i));
            } else {
                _new.push(null);
            }
        }

        this.list_menus = _new;
    }

    RefreshMenu() {
        $('#cxtm').empty();
        this.list_menus[this.curr].menu.forEach(w => {
            $('#cxtm').append(this.ProcessItemToHTML(w));
        });
    }

    ProcessItemToHTML(element) {
        let html = "";
        switch(element.type) {
            case STANDARD:
                html += '<div class="menu-option" onclick="' + element.action + '">'+element.content +'</div>';
            break;
            case SEPARATOR:
                html += '<div class="menu-sep" onclick="' + element.action + '">'+element.content+'</div>';
            break;
            case SPLITTER: 
                let opts = "";

                element.submenu.menu.forEach(sbm => {
                    opts += this.ProcessItemToHTML(sbm);
                });

                let posX = $('#cxtm').css('width');
                let posY = $('#cxtm').css('height');

                html += '<div class="menu-option menu-splitter">' + element.content + '<span style="float: right; margin-right: 10px;">></span><div class="menu menu-splitted" style="left: '+posX+'; top: '+posY+';">' + opts + '</div></div>';
            break;
            default: 
                console.error("Type Option '" + element.type + "' is not available.");
            break;
        }

        return html;
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
                    $('#cxtm').css('left', e.pageX + 3);
                    $('#cxtm').css('top', e.pageY + 3);
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