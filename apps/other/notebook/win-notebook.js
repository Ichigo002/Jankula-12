class Win_Notebook extends Window {
    constructor(iter) {
        super(iter, "Notebook", 600, 400, "icon-app-notebook", "color: #0ff;");

        let tbm = new MenuTemplate("Notebook - toolbar");

        let filem = new MenuTemplate("Notebook - toolbar - file");
        filem.pushNewOption("New", `wins[${iter}].askNew()`);
        filem.pushNewOption("New Window", `wins[${iter}].duplicate()`);
        filem.pushNewOption("Open...", null);
        filem.pushNewOption("Save", null);
        filem.pushNewOption("Save as", null);
        filem.pushNewSeparator();
        filem.pushNewOption("Close", `wins[${iter}].action_close()`);

        let editm = new MenuTemplate("Notebook - toolbar - edit");
        editm.pushNewOption("Undo", null);
        editm.pushNewSeparator();
        editm.pushNewOption("Cut", null);
        editm.pushNewOption("Copy", null);
        editm.pushNewOption("Paste", null);
        editm.pushNewOption("Delete", null);
        editm.pushNewSeparator();
        editm.pushNewOption("Find", null);
        editm.pushNewOption("Replace", null);
        editm.pushNewSeparator();
        editm.pushNewOption("Add Time/Date", null);

        let viewm = new MenuTemplate("Notebook - toolbar - view");
        let size_fontsm = new MenuTemplate("Notebook - toolbar - view - size_font");
        size_fontsm.pushNewOption("Increase", `wins[${this.id_win}].fontIncrease();`);
        size_fontsm.pushNewOption("Decrease", `wins[${this.id_win}].fontDecrease();`);
        size_fontsm.pushNewOption("Reset", `wins[${this.id_win}].fontReset();`);

        viewm.pushNewSplitOption("Font Size", size_fontsm);
        viewm.pushNewOption("Preferences", null);

        let aboutm = new MenuTemplate("Notebook - toolbar - about");

        let about_action = "xinfo('About... ','Notebook is default system <br/> application created to read & write files.<br> App created by Wiktor B.');";
        let help_action = "xinfo('Help','This app has not got any help support.<br/> We apologise we cannot help you ;(');"

        aboutm.pushNewOption("Help", help_action);
        aboutm.pushNewOption("About App", about_action);

        tbm.pushNewSplitOption("File", filem);    
        tbm.pushNewSplitOption("Edit", editm);    
        tbm.pushNewSplitOption("View", viewm);    
        tbm.pushNewSplitOption("About", aboutm);    

        this.setToolBar(tbm);

        let cnt = `<textarea class="win-txt-area"></textarea>`;

        this.setContent(cnt);
        this.onResizeEvent();
        this.fontReset();
    }

    onResizeEvent() {
        let diff = parseInt($(`#win-${this.id_win}`).css("height")) - ( parseInt($(`#win-${this.id_win} > .win-top`).css("height")) + parseInt($(`#win-${this.id_win} > .win-toolbar`).css("height")) );
        this.setTxtProperty("width", parseInt($(`#win-${this.id_win} > .win-content`).css("width")) - 5);
        this.setTxtProperty("height", diff - 18);
    }

    setTxtProperty(what, value) {
        if(what == "cnt") {
            $(`#win-${this.id_win} > .win-content > .win-txt-area`).val(value);
        } else {
            $(`#win-${this.id_win} > .win-content > .win-txt-area`).css(what, value);
        }
    }

    getTxtProperty(what) {
        if(what == "cnt") {
            return $(`#win-${this.id_win} > .win-content > .win-txt-area`).val();
        } else {
            return $(`#win-${this.id_win} > .win-content > .win-txt-area`).css(what);
        }
        
    }

    fontIncrease() {
        this.setTxtProperty("font-size", parseInt(this.getTxtProperty("font-size")) + 2);
    }

    fontDecrease() {
        this.setTxtProperty("font-size", parseInt(this.getTxtProperty("font-size")) - 2);
    }

    fontReset() {
        this.setTxtProperty("font-size", 18);
    }

    askNew() {
        if(this.getTxtProperty("cnt") != "") {
            xquestion("Unsaved document",
             "Are you sure to close unsaved file? <br/> Then you lose your document forever.", 
             `wins[${this.id_win}].new()`, 
             ``);
        } else {
            this.new();
        }
    }

    new() {
        this.setTxtProperty("cnt", "");
    }
}