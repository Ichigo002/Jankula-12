class Window {
    def_height = 100;
    def_width = 100;
    def_left = 0;
    def_top = 0;

    constructor(name, width, height, l, icon) {
        this.name = name;
        this.id_win = l;
        this.maximized = false;

        this.task_item = new TaskItem(name, l, icon);
        this.task_item.AddHoveringEvent();
        this.task_item.AddMaxmaliseEvent();

        let gui = '<div class="win" id="win-' + this.id_win + '">' +
            '<div class="win-top">'+ icon +' ' + this.name + 
            '<span style="margin-left: 15px;">' +
            '<i class="icon-close icon-all" onclick="wins[' + this.id_win + '].action_close()"></i>' +
            '<i class="icon-maximize icon-all" onclick="wins[' + this.id_win + '].action_full_maximize()"></i>' +
            '<i class="icon-minimize icon-all" onclick="wins[' + this.id_win + '].action_minimalise()"></i>' +
            '<div style="clear: both;"></div>' +
            '</span> </div> <div class="win-content" id="win-cnt-' + this.id_win + '"></div>'+
            '<div class="win-resize-point" id="win-res-'+this.id_win+'"></div></div>';
        
        $('#desktop').append(gui);
        $('#win-' + this.id_win).css('width', width);
        $('#win-' + this.id_win).css('height', height);
        $('#win' + this.id_win).css('z-index', z_index);

        this.setPositionResizePoint();
        this.SetDraggingEvent();
        this.ActiveZIndex();
        this.SetResizeEvent();
    }

    ActiveZIndex() {
        let id = this.id_win;

        $('#win-' + id).on("mousedown", function() {
            z_index++;
            if(z_index >= max_z)
            {
                wins.forEach(w => {
                    if(w.id_win != id) {
                        $('#win-' + w.id_win).css('z-index', z_index - (max_z - min_z));
                    } else {
                        $('#win-' + w.id_win).css('z-index', min_z + wins.length);
                    }
                });
                z_index = min_z + wins.length;
            }
            else
            {
                $('#win-' + id).css('z-index', z_index);
            }
        });

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
            }
        });
    }

    SetResizeEvent() {
        let id = this.id_win;
        let resize;
        let minw = min_width_win, minh = min_height_win;

        $("#win-res-" + id).on('mousedown', function(e) {
            resize = true;
        });

        $("#win-res-" + id).on('mouseup', function() {
            resize = false;
        });

        $("#win-res-" + id).on("mousemove mouseout", function(e) {
            if(resize) {
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
            }
        });
    }

    setContent(v) {
        $("#win-cnt-" + this.id_win).text(v);
    }

    setPositionResizePoint() {
        let id = this.id_win;

        $("#win-res-" + id).css('left', parseInt($('#win-' + id).css('width')) );
        $("#win-res-" + id).css('top', parseInt($('#win-' + id).css('height'))); 
    }

    setPosition(x, y) {
        $('#win-' + this.id_win).css('left', x + 'px')
        $('#win-' + this.id_win).css('top', y + 'px')
    }

    action_minimalise() {
        this.task_item.min();
        $('#win-' + this.id_win).css('display', 'none');
    }

    action_unminimalise() {
        $('#win-' + this.id_win).css('display', 'block');
        this.task_item.unmin();
    }

    action_maxmalise() {
        this.task_item.unmin();
        $('#win-' + this.id_win).css('display', 'block');
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
    }

    action_close() {
        this.task_item.removeItem();
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