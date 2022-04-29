var AUTO_RESIZE = -4;

class Window {
    def_height = 100;
    def_width = 100;
    def_left = 0;
    def_top = 0;
    def_min_h = min_height_win;
    def_min_w = min_width_win;

    constructor(name, width, height, l, icon, style_icon) {
        //Standard Values
        this.name = name;
        this.id_win = l;
        this.maximized = false;
        this.static = false;

        //Topbar Context Menu
        let menu = new MenuTemplate(name);
        menu.pushNewOption("Close", 'wins['+this.id_win+'].action_close()');
        menu.pushNewOption("Maximize", 'wins['+this.id_win+'].action_full_maximize();');
        menu.pushNewOption("Minimize", 'wins['+this.id_win+'].action_minimalise();');

        let cxt_id = cxtm.addMenu(menu);
        // Task Item
        this.task_item = new TaskItem(name, l, icon, style_icon);
        this.task_item.AddHoveringEvent();
        this.task_item.AddMaxmaliseEvent();

        //Graphic User Interface
        let gui = '<div class="win" id="win-' + this.id_win + '" menuv="'+cxt_id+'">' +
            '<div class="win-top" menuv="'+cxt_id+'"><i class="'+ icon +'" style="'+style_icon+'"></i> ' + this.name + 
            '<span style="margin-left: 15px;">' +
            '<i class="icon-close icon-all" onclick="wins[' + this.id_win + '].action_close()"></i>' +
            '<i class="icon-maximize icon-all" onclick="wins[' + this.id_win + '].action_full_maximize()"></i>' +
            '<i class="icon-minimize icon-all" onclick="wins[' + this.id_win + '].action_minimalise()"></i>' +
            '<div style="clear: both;"></div>' +
            '</span> </div> <div class="win-content"></div>'+
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
        this.SetDraggingEvent();
        this.ActiveZIndex();
        this.SetResizeEvent();
        
        this.GoTop();
    }

    setMinimalSize(mw, mh) {
        this.def_min_w = mw;
        this.def_min_h = mh;

        if(parseInt($('#win-' + this.id_win).css('width')) < mw) {
            $('#win-' + this.id_win).css('width', mw);
        }
        if(parseInt($('#win-' + this.id_win).css('height')) < mh) {
            $('#win-' + this.id_win).css('height', mh);
        }
        this.setPositionResizePoint();
        this.SetDraggingEvent();
        this.SetResizeEvent();
        return this;
    }

    ActiveZIndex() {
        let id = this.id_win;

        $('#win-' + id).on("mousedown", function() {
            wins[id].GoTop();
        });

    }

    GoTop() {
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

    SetDraggingEvent() {
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
                if(wins[id].maximized) {
                    wins[id].action_full_maximize();
                    offsetX = e.pageX - parseInt($('#win-' + id).css("left"));
                    offsetY = e.pageY - parseInt($('#win-' + id).css("top"));
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

    SetResizeEvent() {
        let id = this.id_win;
        let resize;
        let minw = this.def_min_w, minh = this.def_min_h;

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

    onDragEvent() {
        
        //You can overwrite this and use for what you want
    }

    onResizeEvent() {
        //You can overwrite this and use for what you want
    }

    onCloseEvent() {
        //You can overwrite this and use for what you want
    }

    setContent(v) {
        $("#win-" + this.id_win + " > .win-content").html(v);
        return this;
    }

    setPositionResizePoint() {
        let id = this.id_win;
        if(this.static) {
            $("#win-" + id + " > .win-resize-point").css("display", "none");
        } else {
            $("#win-" + id + " > .win-resize-point").css("display", "block");

            $("#win-" + id + " > .win-resize-point").css('left', parseInt($('#win-' + id).css('width')) );
            $("#win-" + id + " > .win-resize-point").css('top', parseInt($('#win-' + id).css('height')));     
        }
        return this;
    }

    setCenter() {
        let sizeX = parseInt($('body').innerWidth());
        let sizeY = parseInt($('body').innerHeight());
        
        this.setPosition(sizeX / 2, sizeY / 2);
        return this;
    }

    setPosition(x, y) {
        $('#win-' + this.id_win).css('left', x + 'px');
        $('#win-' + this.id_win).css('top', y + 'px');
        return this;
    }

    action_minimalise() {
        this.task_item.min();
        $('#win-' + this.id_win).css('display', 'none');
        this.onResizeEvent();
    }

    action_unminimalise() {
        $('#win-' + this.id_win).css('display', 'block');
        this.task_item.unmin();
        this.GoTop();
        this.onResizeEvent();
    }

    action_maxmalise() {
        this.task_item.unmin();
        $('#win-' + this.id_win).css('display', 'block');
        this.onResizeEvent();
    }

    action_full_maximize() {
        if(this.maximized) {
            this.maximized = false;
            this.loadDef();
            this.setPositionResizePoint();
        } else {
            this.action_maxmalise();
            this.maximized = true;
            this.saveDef();

            $('#win-' + this.id_win).css('width', parseInt($('#desktop').css('width')) - 10);
            $('#win-' + this.id_win).css('height', parseInt($('#desktop').css('height')) - 10);

            $('#win-' + this.id_win).css('left', 0);
            $('#win-' + this.id_win).css('top', 0);
            this.setPositionResizePoint();
        }
        this.onResizeEvent();
    }

    action_close() {
        this.onCloseEvent();
        this.task_item.removeItem();
        cxtm.removeMenu($('#win-' + this.id_win).attr("menuv"));
        $("div").remove('#win-' + this.id_win);
        wins[this.id_win] = null;
    }

    saveDef() {
        this.def_width = $('#win-' + this.id_win).css('width');
        this.def_height = $('#win-' + this.id_win).css('height');

        this.def_left = $('#win-' + this.id_win).css('left');
        this.def_top = $('#win-' + this.id_win).css('top');
    }

    loadDef() {
        $('#win-' + this.id_win).css('width', this.def_width);
        $('#win-' + this.id_win).css('height', this.def_width);
        
        $('#win-' + this.id_win).css('left', this.def_left);
        $('#win-' + this.id_win).css('top', this.def_top);
    }
        
}