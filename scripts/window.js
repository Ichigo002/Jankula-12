var AUTO_RESIZE = -4;

class Window {
	// Default settings window
    #def_height = 100;
    #def_width = 100;
    #def_left = 0;
    #def_top = 0;
    #def_min_h = 250;
    #def_min_w = 320;

    #name;
    #maximized;
    #static;
    #toolbar_menu;

    constructor(win_iterator, name, width, height, icon, style_icon) {
        
        if(win_iterator == undefined) {
            xerror("Missing value in the Window->constructor", "Constructor of Window has must reference to current window iterator to set default properties to correctly work.");
            return "MISSING ITERATOR";
        }
        if(name == undefined)
            name = "Default Window";
        if(width == undefined)
            width = this.#def_min_w;
        if(height == undefined)
            height = this.#def_min_h;
        if(icon == undefined)
            icon = "icon-default-icon";

        //Standard Values
        this.#name = name;
        this.id_win = win_iterator;
        this.#maximized = false;
        this.#static = false;
        this.#toolbar_menu = undefined;

        //Topbar Context Menu
        let menu = new MenuTemplate(name);
        menu.pushNewOption("Close", 'wins['+this.id_win+'].action_close()');
        menu.pushNewOption("Duplicate", 'wins['+this.id_win+'].duplicate();');
        menu.pushNewOption("Maximize", 'wins['+this.id_win+'].action_max();');
        menu.pushNewOption("Minimize", 'wins['+this.id_win+'].action_min();');

        let cxt_id = cxtm.addMenu(menu);
        // Task Item
        this.task_item = new TaskItem(name, this.id_win, icon, style_icon);

        //Graphic User Interface
        let gui = '<div class="win" id="win-' + this.id_win + '" menuv="'+cxt_id+'">' +
            '<div class="win-top" menuv="'+cxt_id+'"><i class="'+ icon +'" style="'+style_icon+'"></i> ' + this.#name + 
            '<span style="margin-left: 15px;">' +
            '<i class="icon-close icon-all" onclick="wins[' + this.id_win + '].action_close()"></i>' +
            '<i class="icon-maximize icon-all" onclick="wins[' + this.id_win + '].action_max()"></i>' +
            '<i class="icon-minimize icon-all" onclick="wins[' + this.id_win + '].action_min()"></i>' +
            '<div style="clear: both;"></div>' +
            '</span> </div> <div class="win-toolbar"></div><div class="win-content"></div>'+
            '<div class="win-resize-point"></div></div>';
        
        $('#desktop').append(gui);
        if(width != AUTO_RESIZE) {
            $('#win-' + this.id_win).css('width', width);
        }
        if(height != AUTO_RESIZE) {
            $('#win-' + this.id_win).css('height', height);
        }
        
        $('#win' + this.id_win).css('z-index', z_index);

        //Active Default Events
        this.setPositionResizePoint();
        this.setDraggingEvent();
        this.activeZIndex();
        this.setResizeEvent();
        
        this.goTop();
    }

    //Set minimal size of window
    setMinimalSize(mw, mh) {
        this.#def_min_w = mw;
        this.#def_min_h = mh;

        if(parseInt($('#win-' + this.id_win).css('width')) < mw) {
            $('#win-' + this.id_win).css('width', mw);
        }
        if(parseInt($('#win-' + this.id_win).css('height')) < mh) {
            $('#win-' + this.id_win).css('height', mh);
        }
        this.setPositionResizePoint();
        this.setDraggingEvent();
        this.setResizeEvent();
        return this;
    }

    // Display window on the foreground of screen
    goTop() {
        z_index++;
        if(z_index >= max_z)
        {
            wins.forEach(w => {
                if(w.id_win != this.id_win) {
                    $('#win-' + w.id_win).css('z-index', z_index - (max_z - min_z));
                } else {
                    $('#win-' + w.id_win).css('z-index', min_z + wins.length);
                }
            });
            z_index = min_z + wins.length;
        }
        else
        {
            $('#win-' + this.id_win).css('z-index', z_index);
        }
        return this;
    }

    // Set is window static
    setStatic(s) {
        this.#static = s;
        return this;
    }

    // ADD EVENT: Go window top after click its
    activeZIndex() {
        let id = this.id_win;

        $('#win-' + id).on("mousedown", function() {
            wins[id].goTop();
        });

    }

    // ADD EVENT: Drag window by mouse after hold top bar
    setDraggingEvent() {
        let drag = false;
        let offsetX = 0;
        let offsetY = 0;
        let id = this.id_win;

        $(".win-top").on("mousedown",function(e) {
            drag = true;
            offsetX = e.pageX - parseInt($('#win-' + id).css("left"));
            offsetY = e.pageY - parseInt($('#win-' + id).css("top"));
        });

        $("body").on("mouseup",function() {
            drag = false;
        });

        $("#win-"+ id).on("mousemove mouseout", function(e) {
            if(drag)
            {
                if(wins[id].getStatusMax()) {
                    wins[id].action_max();
                }

                $('#win-' + id).css('left', (e.pageX - offsetX) + 'px');
                $('#win-' + id).css('top', (e.pageY - offsetY) + 'px');

                if(parseInt($('#win-' + id).css("left")) < 0)
                { $('#win-' + id).css("left", 1); }
                if(parseInt($('#win-' + id).css("top")) < 0)
                { $('#win-' + id).css("top", 1); }
                if(parseInt($('#win-' + id).css("right")) < 0)
                { $('#win-' + id).css("left", parseInt($('#win-' + id).css("left")) + parseInt($('#win-' + id).css("right")) - 1); }
                if(parseInt($('#win-' + id).css("bottom")) < 0)
                { $('#win-' + id).css("top", parseInt($('#win-' + id).css("top")) + parseInt($('#win-' + id).css("bottom")) - 1); }
                wins[id].onDragEvent();
            }
        });
    }
    // return #maximized variable
    getStatusMax() {
        return this.#maximized;
    }

    // ADD EVENT: Resize window after hold right-bottom point
    setResizeEvent() {
        let id = this.id_win;
        let resize;
        let minw = this.#def_min_w, minh = this.#def_min_h;

        $("#win-" + id + " > .win-resize-point").on('mousedown', function(e) {
            resize = true;
            $('body').css('user-select', 'none');
        });

        $("#win-" + id + " > .win-resize-point").on('mouseup', function() {
            resize = false;
            $('body').css('user-select', 'text');
        });

        $('body').on('mouseup', function() {
            resize = false;
            $('body').css('user-select', 'text');
        });

        $("#win-" + id + " > .win-resize-point").on("mousemove mouseout", function(e) {
            if(resize && !wins[id].static) {
                wins[id].maximized = false;
                let n_w = e.pageX - parseInt($('#win-' + id).css("left")) - 10;
                let n_h = e.pageY - parseInt($('#win-' + id).css("top")) - 10;

                $('#win-' + id).css("height", n_h);
                $('#win-' + id).css("width", n_w);
                
                if(parseInt($('#win-' + id).css("width")) <= minw) {
                    $('#win-' + id).css("width", minw + 1);
                }
                if(parseInt($('#win-' + id).css("height")) <= minh) {
                    $('#win-' + id).css("height", minh + 1);
                }

                wins[id].setPositionResizePoint();
                wins[id].onResizeEvent();
            }
        });
    }

    // Methods are called if event has place now. Method can be overwritten
    onDragEvent() { }
    onResizeEvent() { }
    onCloseEvent() { }

    // Duplicate this window. Method can be overwritten
    duplicate() {
        wins.push(new Window(
            iter,
            this.#name,
            $('#win-' + this.id_win).css('width'),
            $('#win-' + this.id_win).css('height'),
            $('#win-' + this.id_win + " > .win-top > i").attr('class'),
            $('#win-' + this.id_win + " > .win-top > i").attr('style')));

        wins[iter].setContent(this.getContent());
        wins[iter].setPosition(
            parseInt($("#win-" + this.id_win).css("left")) + 40,
            parseInt($("#win-" + this.id_win).css("top")) + 40);
        
        wins[iter].setToolBar(this.getToolBar());

        iter++;
        return iter-1;
    }

    // Set content of window
    setContent(v) {
        $("#win-" + this.id_win + " > .win-content").html(v);
        return this;
    }

    // Returns content of window
    getContent() {
        return $("#win-" + this.id_win + " > .win-content").html();
    }

    // Reset resize point's position to right-bottom side
    setPositionResizePoint() {
        let id = this.id_win;
        if(this.#static) {
            $("#win-" + id + " > .win-resize-point").css("display", "none");
        } else {
            $("#win-" + id + " > .win-resize-point").css("display", "block");

            $("#win-" + id + " > .win-resize-point").css('left', parseInt($('#win-' + id).css('width')) );
            $("#win-" + id + " > .win-resize-point").css('top', parseInt($('#win-' + id).css('height')));     
        }
        return this;
    }

    // Set window on the center of screen
    setCenter() {
        let sizeX = parseInt($('body').innerWidth());
        let sizeY = parseInt($('body').innerHeight());

        let win_sizeX = parseInt($('#win-' + this.id_win).outerWidth());
        let win_sizeY = parseInt($('#win-' + this.id_win).outerHeight());
        console.log(sizeY/2);
        this.setPosition(sizeX / 2 - win_sizeX / 2, sizeY / 2 - win_sizeY / 2 - 120);
        return this;
    }

    // Set position by left and top variables
    setPosition(x, y) {
        $('#win-' + this.id_win).css('left', x + 'px');
        $('#win-' + this.id_win).css('top', y + 'px');
        return this;
    }

    // Minimize to background work
    action_min() {
        this.task_item.min();
        $('#win-' + this.id_win).css('display', 'none');
        this.onResizeEvent();
    }

    // Unminimize from the background work
    action_unmin() {
        $('#win-' + this.id_win).css('display', 'block');
        this.task_item.unmin();
        this.goTop();
        this.onResizeEvent();
        this.setPositionResizePoint();
    }

    // Maximize and fill all screen by itself
    action_max() {
        if(this.#maximized) {
            console.log("gggg");
            this.#maximized = false;
            this.loadDef();
            this.setPositionResizePoint();
        } else {
            console.log("2222");
            this.action_unmin();
            this.#maximized = true;
            this.saveDef();

            $('#win-' + this.id_win).css('width', parseInt($('#desktop').css('width')) - 10);
            $('#win-' + this.id_win).css('height', parseInt($('#desktop').css('height')) - 10);

            $('#win-' + this.id_win).css('left', 0);
            $('#win-' + this.id_win).css('top', 0);
            this.setPositionResizePoint();
        }
        this.onResizeEvent();
    }

    // Close the window
    action_close() {
        this.onCloseEvent();
        this.task_item.removeItem();
        cxtm.removeMenu($('#win-' + this.id_win).attr("menuv"));
        $("div").remove('#win-' + this.id_win);
        wins[this.id_win] = null;
    }

    // Save default settings
    saveDef() {
        this.#def_width = $('#win-' + this.id_win).css('width');
        this.#def_height = $('#win-' + this.id_win).css('height');

        this.#def_left = $('#win-' + this.id_win).css('left');
        this.#def_top = $('#win-' + this.id_win).css('top');
    }

    // Load default Settings
    loadDef() {
        $('#win-' + this.id_win).css('width', this.#def_width);
        $('#win-' + this.id_win).css('height', this.#def_height);
        
        $('#win-' + this.id_win).css('left', this.#def_left);
        $('#win-' + this.id_win).css('top', this.#def_top);
    } 

    // Check is toolbar used in the window
    isToolBarUsed() {
        return this.#toolbar_menu != undefined;
    }

    // Get toolbar of window
    getToolBar() {
        return this.#toolbar_menu;
    }

    // Set top Bar with tools to window. If not used, This doesn't show up
    setToolBar(menu_template) {
        if(menu_template != undefined) {
            this.#toolbar_menu = menu_template;

            let html = "";

            menu_template.menu.forEach(e => {
                if(e.type == SPLITTER) {
                    let opts = "";

                    e.submenu.menu.forEach(sbm => {
                        opts += this.processItemToHTML(sbm);
                    });
    
                    html += '<div class="win-tb-first">' + e.content + '<div class="win-tb-splitted" ">' + opts + '</div></div>';
    
                } else {
                    console.warn("First template menu should contains only splitter to correctly work");
                }
            });

            $(`#win-${this.id_win} > .win-toolbar`).html(html);
            $(`#win-${this.id_win} > .win-toolbar`).addClass("win-toolbar-used");
        }
    }


    processItemToHTML(element) {
        let html = "";
        switch(element.type) {
            case DISABLED:
            case STANDARD:
                html += '<div class="win-tb-option" onclick="' + element.action + '">'+element.content +'</div>';
            break;
            case SEPARATOR:
                html += '<div class="win-tb-sep" onclick="' + element.action + '">'+element.content+'</div>';
            break;
            case SPLITTER: 
                let opts = "";

                element.submenu.menu.forEach(sbm => {
                    opts += this.processItemToHTML(sbm);
                });

                let _left = 73;
                let _top = 50;

                html += '<div class="win-tb-option win-tb-first">' + element.content + '<span style="float: right; margin-right: 10px; margin-left: 10px;">></span><div class="win-tb-splitted" style=" left: '+_left+'px; top:'+_top+'px;">' + opts + '</div></div>';
            break;
            default: 
                console.error("Type Option '" + element.type + "' is not available.");
            break;
        }

        return html;
    }
}