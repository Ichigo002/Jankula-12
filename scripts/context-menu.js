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
        let pushed = -1;

        for (let i = 0; i < this.list_menus.length; i++) {
            if(pushed == -1 && this.list_menus[i] == null) {
                _new.push(menu_temp);
                pushed = i;
                //console.log("MENU_TEMP ", i, " p: ", pushed);
            } else {
                _new.push(this.list_menus[i]);
                //console.log("STD ", i, " p: ", pushed);
            }
        }
        if(pushed == -1) {
            pushed = _new.push(menu_temp) - 1;
            //console.log("NON STD ", " p: ", pushed);
        }
        this.list_menus = _new;
        return pushed;
    }

    removeMenu(id) {
        if(this.list_menus[id] == null && id >= 0 && id < this.list_menus.length) {
            return null;
        }
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
        if(this.list_menus[this.curr] == null) {
            return null;
        }

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

                //displaying
                if(cxtm.curr != undefined) {
                    cxtm.RefreshMenu();
                    $('#cxtm').css('display', 'block');

                    cxtm.SetActiveCorner("left-top");
                    $('#cxtm').css('left', e.pageX );
                    $('#cxtm').css('top', e.pageY);

                    let both = 0;

                    //Right border
                    if(e.pageX + $('#cxtm').outerWidth() > parseInt($("body").css("width"))) {
                        cxtm.SetActiveCorner("right-top");
                        $('#cxtm').css('left', e.pageX - $('#cxtm').outerWidth());
                        both++;
                    }
                    
                    //Bottom border
                    if(e.pageY + $('#cxtm').outerHeight() > parseInt($("body").css("height"))) {
                        cxtm.SetActiveCorner("left-bottom");
                        $('#cxtm').css('top', e.pageY - $('#cxtm').outerHeight());
                        both++;
                    }

                    if(both == 2) {
                        cxtm.SetActiveCorner("right-bottom");
                    }
                    
                }
                else {
                    $('#cxtm').css('display', 'none'); 
                }
                
            } else {
                if(!clicked) {
                    $('#cxtm').css('display', 'none'); 
                } else { // Chose option
                    clicked = false;
                    if($(e.target).attr("class") == "menu" || $(e.target).attr("class") == "menu-sep" || $(e.target).attr("class") == "menu-option menu-splitter") {
                        return false;
                    } else {
                        setTimeout(function() { $('#cxtm').css('display', 'none'); }, 100);
                    }
                }
            }
        });

    }

    SetActiveCorner(corner, r) {
        if(r == undefined) {
            r = "8px";
        } else {
            r += "px";
        }
        switch(corner) {
            case "left-top":
                $("#cxtm").css("border-radius"," 0 "+r+" "+r+" "+r);
            break;
            case "left-bottom":
                $("#cxtm").css("border-radius"," "+r+" "+r+" "+r+" 0");
            break;
            case "right-top":
                $("#cxtm").css("border-radius"," "+r+" 0 "+r+" "+r);
            break;
            case "right-bottom":
                $("#cxtm").css("border-radius"," "+r+" "+r+" 0 "+r);
            break;
        }
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