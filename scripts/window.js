class Window {
    def_height = 100;
    def_width = 100;
    id_win = 0;

    constructor(name, width, height, l) {
        this.name = name;
        this.id_win = l;

        if(width < 100)
            width = 100;
        if(height < 100)
            height = 100;

        let gui = '<div class="win" id="win-' + this.id_win + '">' +
            '<div class="win-top">' + this.name + 
            '<span>' +
            '<i class="icon-cancel icon-all" onclick="wins[' + this.id_win + '].action_close()"></i>' +
            '<i class="icon-window-maximize icon-all" onclick="wins[' + this.id_win + '].action_maxmalise()"></i>' +
            '<i class="icon-minus-1 icon-all" onclick="wins[' + this.id_win + '].action_minimalise()"></i>' +
            '<div style="clear: both;"></div>' +
            '</span> </div> <div class="win-content" id="win-cnt-' + this.id_win + '"></div></div>';
        
        $('body').append(gui);
        $('#win-' + this.id_win).css('width', width);
        $('#win-' + this.id_win).css('height', height);
        $('#win' + this.id_win).css('z-index', z_index);
    }

    ActiveZIndex() {
        let id = this.id_win;
        $('#win-' + id).on("mousedown", function() {
            z_index++;
            $('#win-' + id).css('z-index', z_index);
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

        $(".win-top").on("mouseup",function() {
            drag = false;
        });

        $("#win-"+ id).on("mousemove", function(e) {
            if(drag)
            {
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

    setContent(v) {
        $("#win-cnt-" + this.id_win).text(v);
    }

    setPosition(x, y) {
        $('#win-' + this.id_win).css('left', x + 'px')
        $('#win-' + this.id_win).css('top', y + 'px')
    }

    action_minimalise() {
        alert('min');
    }

    action_maxmalise() {
        alert('max');
    }

    action_close() {
        alert('clsoe');
    }

    test() {
        console.log(this.system_name);
    }
}