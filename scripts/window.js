class Window {
    active = true;
    def_height = 100;
    def_width = 100;
    id_win = 0;
    content = "NONE";

    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    createGUI() {
        let gui = '<div class="win" id="win-' + this.id_win + '">' +
            '<div class="win-top">' + this.name + 
            '<span>' +
            '<i class="icon-cancel icon-all" onclick="wins[' + this.id_win + '].action_close()"></i>' +
            '<i class="icon-window-maximize icon-all" onclick="wins[' + this.id_win + '].action_maxmalise()"></i>' +
            '<i class="icon-minus-1 icon-all" onclick="wins[' + this.id_win + '].action_minimalise()"></i>' +
            '<div style="clear: both;"></div>' +
            '</span> </div> <div class="win-content">' + this.content +
            '</div></div>';

        $('body').append(gui);
    }

    setContent(v) {
        this.content = v;
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