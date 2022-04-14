var NONE = -1;

class Win_Explorer extends Window {
    constructor(width, height, iterator, file_system__) {
        super("File Explorer", width, height, iterator, '<i class="icon-folder-open"></i>');
        this.setMinimalSize(415, 230);
        
        this.ptr = new DirFollower(file_system__);
        this.ptr.goto("bin/Folder");
        this.selected_item = 0;
        this.items_length = 0;

        let content = '<div class="exp-top">' +
            '<div class="exp-top-wrapper-btns">' +
                '<i class="icon-up-arrow exp-top-btn"></i>' +
                '<i class="icon-down-arrow exp-top-btn"></i></div>' +
            '<div class="exp-top-path">R:/user/bin/Wisniewski/hot/mamuski</div> </div>' +
        '<div class="exp-wrapper">' +
            '<div class="exp-nav"></div>' +
            '<div class="exp-item-barinfo">' +
                '<div class="exp-item-name">Name</div>' +
                '<div class="exp-item-date">Date Created</div>' +
                '<div class="exp-item-type">Type File</div></div>' +
            '<div class="exp-content"></div>';

        this.setContent(content);
        this.onResizeEvent();
        this.Refresh();

        this.setClickArrowsEvents();
        this.setKeyboardEvents();

        let id = this.id_win;
        this.ptr.onChangePathEvent = function() {
            wins[id].Refresh();
        }
    }

    setClickArrowsEvents() {
        let id = this.id_win;
        let p = this.ptr;
        
        // Up arrow
        $('#win-' + id + " > .win-content > .exp-top > .exp-top-wrapper-btns > .icon-up-arrow").on('click', function() {
           wins[id].goOut();
        });
        // Down arrow
        $('#win-' + id + " > .win-content > .exp-top > .exp-top-wrapper-btns > .icon-down-arrow").on('click', function() {
            wins[id].goInto();
        });
    }

    setKeyboardEvents() {
        let id = this.id_win;
        let p = this.ptr;

        $(window).keydown(function(e) {
            if($('#win-' + id).css('z-index') == z_index) {
                if(e.which == 37 || e.which == 8) { //left arrow || backspace
                    wins[id].goOut();
                }
                if(e.which == 39 || e.which == 13) { //right arrow || enter
                    wins[id].goInto();
                }
                if(e.which == 38) { //up arrow
                    if(wins[id].selected_item > 0) {
                        wins[id].SelectItem(wins[id].selected_item - 1);
                    }
                }
                if(e.which == 40) { //down arrow
                    if(wins[id].selected_item < wins[id].items_length - 1) {
                        wins[id].SelectItem(wins[id].selected_item + 1);
                    }
                }
            }
        });
    }

    goInto() {
        if(this.selected_item != NONE) {
            this.ptr.goto(this.ptr.getBinders()[this.selected_item].name);
            this.Refresh();
        }
    }

    goOut() {
        this.ptr.goto("..");
        this.Refresh();
        $('#exp-item-' + this.selected_item + '-' + this.id_win).addClass('exp-item-ghost-select');
    }

    onResizeEvent() {
        super.onResizeEvent();

        let h = parseInt($('#win-' + this.id_win).css("height"));
        $('#win-' + this.id_win + '> .win-content > .exp-wrapper').css("height", h - 87);
    }

    SelectItem(index) {
        let id = this.id_win;

        if(this.selected_item != index) {
            $('#exp-item-' + index + '-' + this.id_win).addClass('exp-item-selected');

            $('#exp-item-' + this.selected_item + '-' + this.id_win).removeClass("exp-item-ghost-select");
            $('#exp-item-' + this.selected_item + '-' + this.id_win).removeClass("exp-item-selected");
            this.selected_item = index;

            $('#exp-item-' + index + '-' + this.id_win).on("dblclick", function() {
                wins[id].goInto();
            });
        }
    }

    Refresh() {
        this.RefreshPath();
        this.RefreshItems();
    }

    RefreshPath() {
        $('#win-' + this.id_win + " > .win-content > .exp-top > .exp-top-path").text(this.ptr.getPath());
    }

    RefreshItems() {
        let cnt = "";

        let list = this.ptr.getBinders();
        this.items_length = list.length;

        if(list.length == 0) {
            this.selected_item = NONE;
        }

        for(let i = 0; i < list.length; i ++) {
            cnt += '<div class="exp-item" id="exp-item-' + i + '-' + this.id_win+ '" onclick="wins['+this.id_win+'].SelectItem('+i+')">' +
            '<div class="exp-item-name">' + list[i].name + '</div>' +
            '<div class="exp-item-date">'+list[i].date +' ' + list[i].time +'</div>' +
            '<div class="exp-item-type">'+((list[i].type() == DIR)? "Folder":list[i].type())+'</div></div>\n';
        }
        
        $('#win-' + this.id_win + " > .win-content > .exp-wrapper > .exp-content").html(cnt);
    }
}