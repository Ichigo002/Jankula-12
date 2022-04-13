class Win_Explorer extends Window {
    constructor(width, height, iterator, file_system__) {
        super("File Explorer", width, height, iterator, '<i class="icon-folder-open"></i>');
        this.setMinimalSize(415, 230);
        
        this.ptr = new DirFollower(file_system__);
        this.ptr.goto("bin/Folder");

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
            '<div class="exp-content">' +
                '<div class="exp-item">' +
                    '<div class="exp-item-name">User</div>' +
                    '<div class="exp-item-date">12/04/2022</div>' +
                    '<div class="exp-item-type">PNG</div></div></div>';


        this.setContent(content);
        this.onResizeEvent();
        this.RefreshPath();

        this.setClickArrowsEvents();

        let id = this.id_win;
        this.ptr.onChangePathEvent = function() {
            wins[id].RefreshPath();
        }
    }

    setClickArrowsEvents() {
        let id = this.id_win;
        let p = this.ptr;

        // Up arrow
        $('#win-' + id + " > .win-content > .exp-top > .exp-top-wrapper-btns > .icon-up-arrow").on('click', function() {
           p.goto("..");
           wins[id].RefreshPath();
        });
        // Down arrow
        $('#win-' + id + " > .win-content > .exp-top > .exp-top-wrapper-btns > .icon-down-arrow").on('click', function() {
            // TO DO GOING DOWN
            alert("deeper!");
            wins[id].RefreshPath();
        });
    }

    onResizeEvent() {
        super.onResizeEvent();

        let h = parseInt($('#win-' + this.id_win).css("height"));
        $('#win-' + this.id_win + '> .win-content > .exp-wrapper').css("height", h - 87);
    }

    RefreshPath() {
        $('#win-' + this.id_win + " > .win-content > .exp-top > .exp-top-path").text(this.ptr.getPath());
    }
}