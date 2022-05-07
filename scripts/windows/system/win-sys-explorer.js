var NONE = -1;

class Win_Explorer extends Window {
    constructor(width, height, iterator, file_system__) {
        super(iterator, "File Explorer", width, height, 'icon-folder-open', "color: #f7c96c;");
        this.setMinimalSize(415, 230);
        
        this.ptr = new DirFollower(file_system__);
        this._item_cxt_menus_ = [];
        this.selected_item = 0;
        this.items_length = 0;

        let newop = new MenuTemplate("Explorer Splitter Menu [New]");
        newop.pushNewOption("Folder", "wins["+this.id_win+"].mknew(DIR)");
        newop.pushNewSeparator();
        newop.pushNewOption("File", "wins["+this.id_win+"].mknew(FILE)");

        let menu = new MenuTemplate("Explorer Content Menu");
        menu.pushNewOption("Go Into", "wins["+this.id_win+"].goIntoByDef()");
        menu.pushNewOption("Go Previous", "wins["+this.id_win+"].goOut()");
        menu.pushNewSeparator();
        menu.pushNewOption("Duplicate Window", "wins["+this.id_win+"].Duplicate()");
        menu.pushNewSeparator();
        menu.pushNewSplitOption("New", newop);
        
        this.cnt_menu_ = cxtm.addMenu(menu);
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
            '<div class="exp-content" menuv="' + this.cnt_menu_ + '"></div>';

        this.setContent(content);
        this.onResizeEvent();
        

        this.setClickArrowsEvents();
        this.setKeyboardEvents();
        this.onRefreshEvent();

        this.Refresh();

        let w = this;

        this.ptr.onChangePathEvent = function() {
            w.Refresh();
        }
        this.onCloseEvent = function() {
            this.RemoveCXTMenus();
            cxtm.removeMenu(this.cnt_menu_);
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
            wins[id].goIntoByDef();
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

    onResizeEvent() {
        super.onResizeEvent();

        let h = parseInt($('#win-' + this.id_win).css("height"));
        $('#win-' + this.id_win + '> .win-content > .exp-wrapper').css("height", h - 87);
    }

    onRefreshEvent() {
        let win = this;
        $("#handler_event").on("exp_refresh", function(e) {
            win.RefreshPath();
            win.RefreshItems();
            //win.RefreshNav();
        });
    }

    SetStartingPath(_path) {
        this.ptr.goto(_path)
        this.Refresh();
    }

    Duplicate() {
        let id = stapp("explorer");
    
        wins[id].SetStartingPath(this.ptr.getPath());
        wins[id].GoTop();
        wins[id].setPosition(
        parseInt($("#win-" + this.id_win).css("left")) + 40, 
        parseInt($("#win-" + this.id_win).css("top")) + 40);

        return id;
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

    renameItem() {
        if(this.selected_item != NONE) {
            let item = this.ptr.getItemBy(this.selected_item);
            let tp = item.type() == DIR ? "Folder" : "File";
            xinput("Rename "+ item.name +" " + tp,
            "Type new name of " + tp + ": ",
            "<input type='text' value='"+item.name+"' id='i-exp-" + this.id_win + "'/>",
            "wins["+this.id_win+'].execRename($("#i-exp-'+this.id_win+'").val(), '+this.selected_item+')',
            "");
        }
    }

    execRename(accept, item) {
        if(accept != undefined) {
            if(accept == '') {
                xwarning("Incorrect name", "Item must have new name.");
            } else if(accept.includes('/') || accept.includes('\\')) {
                xwarning("Incorrect name", "Item's name cannot includes '/' or '\\'.");
            } else {
                this.ptr.getItemBy(item).name = accept;
                this.Refresh();
            }
            
        }
    }

    deleteItem() {
        if(this.selected_item != NONE) {
            let item = this.ptr.getItemBy(this.selected_item);
            if(!item.checkAttr(REMOVABLE)) {
                return false;
            }
            let tp = item.type() == DIR ? "Folder" : "File";
            let contains = "";

            if(item.type() == DIR && item.countAll() != 0) {
                contains = "Folder contains: " + item.countAll() + (item.countAll() > 1 ? " Items" : " Item");
            }
            
            
            xquestion("Deleting " + item.name + " " + tp,
            "Are you sure to delete 1 "+tp+"? <br/> " + contains,
            'wins['+this.id_win+'].execDel("'+item.name+'")',
            "");
        }
    }

    execDel(name) {
        this.ptr.del_noq(name);
        this.Refresh();
    }

    // TO DO
    openProp() {
        
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

    mknew(what, _res) {
        switch (what) {
            case DIR:
                xinput("Create a new folder", 
                "Type name for a new folder: ", 
                "<input type='text' id='i-exp-"+this.id_win+"'/>",
                "wins["+this.id_win+'].mknew("D_RES_", $("#i-exp-'+this.id_win+'").val())',
                "wins["+this.id_win+"].mknew(NONE)");
                break;
            case "D_RES_":
                if(_res == '') {
                    xwarning("Incorrect Name", "Created folder must has any name.");
                } else {
                    this.ptr.mkdir(_res);
                this.Refresh();
                }
               break;
            case FILE:
                xinput("Create a new file", 
                "Type name for a new file: ", 
                "<input type='text' id='i-exp-"+this.id_win+"'/>",
                "wins["+this.id_win+'].mknew("F_RES_", $("#i-exp-'+this.id_win+'").val())',
                "wins["+this.id_win+"].mknew(NONE)");
                break;
            case "F_RES_":
                if(_res == '') {
                    xwarning("Incorrect Name", "Created file must has any name.");
                } else {
                    this.ptr.mkfile(_res);
                    this.Refresh();
                }
                break;
            case NONE: // Cancel creating
                return false;
            default:
                console.log("mknew(what, _res) does not know this type creating: " + what);
                break;
        }
    }

    Refresh() {
        $("#handler_event").trigger('exp_refresh');
    }

    RefreshPath() {
        $('#win-' + this.id_win + " > .win-content > .exp-top > .exp-top-path").text(this.ptr.getPath());
    }

    RemoveCXTMenus() {
        this._item_cxt_menus_.forEach(item => {
            cxtm.removeMenu(item);
        });
    }

    RefreshItems() {
        this.RemoveCXTMenus();

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
            '<div class="exp-item-date" menuv="' + menu_id + '">'+list[i].date_created +' ' + list[i].time_created +'</div>' +
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
                menu.pushNewOption("Rename", 'wins['+this.id_win+'].renameItem()');
                menu.pushNewOption("Delete", 'wins['+this.id_win+'].deleteItem()');
                menu.pushNewSeparator();
                menu.pushNewOption("Cut", null);
                menu.pushNewOption("Copy", null);
                menu.pushNewOption("Paste", null);
                menu.pushNewSeparator();
                menu.pushNewOption("Copy Path", null);
                menu.pushNewSeparator();
                menu.pushNewOption("Properties", 'wins['+this.id_win+'].openProp()');
                
            break;
            case FILE:
                menu = new MenuTemplate('File ::   ' + item.name);
                menu.pushNewOption("Open", null);
                menu.pushNewOption("Rename", 'wins['+this.id_win+'].renameItem()');
                menu.pushNewOption("Delete", 'wins['+this.id_win+'].deleteItem()');
                menu.pushNewSeparator();
                menu.pushNewOption("Cut", null);
                menu.pushNewOption("Copy", null);
                menu.pushNewOption("Paste", null);
                menu.pushNewSeparator();
                menu.pushNewOption("Properties", 'wins['+this.id_win+'].openProp()');
            break;
            default:
                console.error("Not found '" + item.type() + "' in CreateMenu(item)");
            break;
        }

        return menu;
    }
}