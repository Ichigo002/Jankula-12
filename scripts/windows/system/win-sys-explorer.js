var NONE = -1;

class Win_Explorer extends Window {
    constructor(width, height, iterator, file_system__) {
        super("File Explorer", width, height, iterator, '<i class="icon-folder-open"></i>');
        this.setMinimalSize(415, 230);
        
        this.ptr = new DirFollower(file_system__);
        this._item_cxt_menus_ = [];
        this.selected_item = 0;
        this.items_length = 0;

        let newf = new MenuTemplate("Explorer Splitter Menu [New]");
        newf.pushNewOption("Folder", null) // TODO
        newf.pushNewSeparator();
        newf.pushNewOption("File", null) //TODO

        let menu = new MenuTemplate("Explorer Content Menu");
        menu.pushNewOption("Go Into", "wins["+this.id_win+"].goIntoByDef()");
        menu.pushNewOption("Go Previous", "wins["+this.id_win+"].goOut()");
        menu.pushNewSeparator();
        menu.pushNewOption("Duplicate Window", "wins["+this.id_win+"].Duplicate()"); // TODO
        menu.pushNewSeparator();
        menu.pushNewSplitOption("New", newf);
        

        let content = '<div class="exp-top">' +
            '<div class="exp-top-wrapper-btns">' +
                '<i class="icon-up-arrow exp-top-btn"></i>' +
                '<i class="icon-down-arrow exp-top-btn"></i></div>' +
            '<div class="exp-top-path"></div> </div>' +
        '<div class="exp-wrapper">' +
            '<div class="exp-nav"></div>' +
            '<div class="exp-item-barinfo">' +
                '<div class="exp-item-name">Name</div>' +
                '<div class="exp-item-date">Date Created</div>' +
                '<div class="exp-item-type">Type</div></div>' +
            '<div class="exp-content" menuv="' + cxtm.addMenu(menu) + '"></div>';

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

    SetStartingPath(_path) {
        this.ptr.goto(_path);
        this.Refresh();
    }

    Duplicate() {
        let id = stapp("explorer");
        
        wins[id].SetStartingPath(this.ptr.getPath());
    }

    goIntoByDef() {
        let list = this.ptr.getBinders();
        if(list.at(this.selected_item).type() != DIR || this.selected_item == NONE) {
            for (let i = list.length-1; i >= 0; i--) {
                if(list.at(i).type() == DIR) {
                    this.selected_item = i;
                }
            }
        }
        this.goInto();
    }

    goInto() {
        if(this.selected_item != NONE) {
            this.ptr.goto(this.ptr.getBinders()[this.selected_item].name);
            this.selected_item = this.ptr.getCurrentDir().slct_pos;
        }
    }

    goOut() {
        this.ptr.getCurrentDir().slct_pos = this.selected_item;
        this.ptr.goto("..");
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
        this._item_cxt_menus_.forEach(item => {
            cxtm.removeMenu(item);
        });

        this._item_cxt_menus_ = [];

        let cnt = "";
        let list = this.ptr.getBinders();
        this.items_length = list.length;

        if(list.length == 0) {
            this.selected_item = NONE;
        }
        
        for(let i = 0; i < list.length; i ++) {
            let menu_id = cxtm.addMenu(this.CreateMenu(list[i]));
            this._item_cxt_menus_.push(menu_id);

            cnt += '<div class="exp-item" id="exp-item-' + i + '-' + this.id_win+ '" onclick="wins['+this.id_win+'].SelectItem('+i+')" oncontextmenu="wins['+this.id_win+'].SelectItem('+i+')" menuv="' + menu_id + '">' +
            '<div class="exp-item-name" menuv="' + menu_id + '">' + list[i].name + '</div>' +
            '<div class="exp-item-date" menuv="' + menu_id + '">'+list[i].date +' ' + list[i].time +'</div>' +
            '<div class="exp-item-type" menuv="' + menu_id + '">'+((list[i].type() == DIR)? "Folder":list[i].type())+'</div></div>\n';
        }
        
        $('#win-' + this.id_win + " > .win-content > .exp-wrapper > .exp-content").html(cnt);
    }

    CreateMenu(item) {
        let menu;
        switch(item.type()) {
            case DIR:
                menu = new MenuTemplate('Folder :: ' + item.name);
                menu.pushNewOption("Open", 'wins['+this.id_win+'].goInto()');
            break;
            case FILE:
                menu = new MenuTemplate('File ::   ' + item.name);
                menu.pushNewOption("Open", "stapp('explorer')");
            break;
            default:
                console.error("Not found '" + item.type() + "' in CreateMenu(item)");
            break;
        }

        return menu;
    }
}