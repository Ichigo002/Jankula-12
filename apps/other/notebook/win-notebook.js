class Win_Notebook extends Window {
    #last_path;
    #curr_file;
    #saved;

    area_focuesd;
    __last_input_txt__;

    constructor(iter) {
        super(iter, "Notebook", 600, 400, "icon-app-notebook", "color: #0ff;");

        this.#curr_file = new File("Untitled.txt");
        this.#saved = false;

        let tbm = new MenuTemplate("Notebook - toolbar");

        let filem = new MenuTemplate("Notebook - toolbar - file");
        filem.pushNewOption("New", `wins[${iter}].askNew()`);
        filem.pushNewOption("New Window", `wins[${iter}].duplicate()`);
        filem.pushNewOption("Open...", `wins[${iter}].openFile()`);
        filem.pushNewOption("Save", `wins[${iter}].saveFile()`);
        filem.pushNewOption("Save as", `wins[${iter}].saveAsFile()`);
        filem.pushNewSeparator();
        filem.pushNewOption("Close", `wins[${iter}].close()`);

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

        let cnt = `<textarea class="win-txt-area" id="txt-area-ntb-${this.id_win}"></textarea>`;

        this.setContent(cnt);
        this.onResizeEvent();
        this.onKeyboardEvent();
        this.fontReset();

        this.updateTitleStatus();
    }

    // Open file [Menu Option]
    openFile(path, keep) {
        if(path == undefined) {
            new FDOpener(FILE, `wins[${this.id_win}].openFile(`, ``, file_system);
        } else {
            if(keep == undefined && !this.#saved && this.getTxtProperty("cnt") != "") {
                xquestion("Unsaved document",
                "Are you sure to close unsaved file?", 
                `wins[${this.id_win}].openFile("${path}", true)`, 
                ``);
            } else {
                //this.#last_path = path;
                this.#curr_file = FDOpener.openFile(path,file_system);
                this.setTxtProperty("cnt", this.#curr_file.readFile());
                this.updateTitleStatus();
            }
            
        }
    }

    // Quick Save file [Menu Option]
    saveFile() {
        if(this.#last_path == undefined) {
            this.saveAsFile();
        } else {
            this.#curr_file.overwriteFile(this.getTxtProperty("cnt"));
            ErrorHandler.throwIf(FDSaver.saveFile(this.#curr_file, this.#last_path, file_system));
        }
    }

    // Std Save file [Menu Option]
    saveAsFile(path) {
        if(path == undefined) {
            this.#curr_file.overwriteFile(this.getTxtProperty("cnt"));
            new FDSaver(this.#curr_file, `wins[${this.id_win}].saveAsFile(`, ``, file_system);
        } else {
            this.#saved = true;
            this.updateTitleStatus();
            this.#last_path = path;
        }
    }

    // Overwritten event from Window
    onResizeEvent() {
        let diff = parseInt($(`#win-${this.id_win}`).css("height")) - ( parseInt($(`#win-${this.id_win} > .win-top`).css("height")) + parseInt($(`#win-${this.id_win} > .win-toolbar`).css("height")) );
        this.setTxtProperty("width", parseInt($(`#win-${this.id_win} > .win-content`).css("width")) - 5);
        this.setTxtProperty("height", diff - 18);
    }

    // Focus textarea & call onEnterText() method
    onKeyboardEvent() {
        let id = this.id_win;
        $(`#txt-area-ntb-${id}`).focusin(function(e) {
            wins[id].area_focuesd = true;
            wins[id].__last_input_txt__ = wins[id].getTxtProperty("cnt");
        });
        $(`#txt-area-ntb-${id}`).focusout(function(e) {
            wins[id].area_focuesd = false;
        });

        $(window).keyup(function(e) {
            if($('#win-' + id).css('z-index') == z_index && wins[id].area_focuesd) {
                let arg = "";
                let last_leng = wins[id].__last_input_txt__.length;
                let curr_leng = wins[id].getTxtProperty("cnt").length;

                wins[id].__last_input_txt__ = wins[id].getTxtProperty("cnt");

                if(curr_leng >= last_leng) {
                    for (let i = last_leng; i < curr_leng; i++) {
                        arg += wins[id].__last_input_txt__[i];
                    }
                    if(arg != "")
                        wins[id].onEnterText(arg);
                } else {
                    wins[id].onRemoveText(wins[id].__last_input_txt__);
                }
            }
        });
    }

    // Event called on entering new text to notepad
    onEnterText(args) {
        this.#saved = false;
        this.updateTitleStatus();
    }

    // event called on removing text
    onRemoveText(txt) {
        this.#saved = false;
        this.updateTitleStatus();
    }

    // overwrite method from window
    duplicate() {
        wins.push(new Win_Notebook(iter));

        wins[iter].setContent(this.getContent());
        wins[iter].setPosition(
            parseInt($("#win-" + this.id_win).css("left")) + 40,
            parseInt($("#win-" + this.id_win).css("top")) + 40);

        iter++;
        return iter-1;
    }

    // close notepad correctly
    close() {
        if(!this.#saved && this.getTxtProperty("cnt") != "") {
            xquestion("Unsaved document",
                "Are you sure to close unsaved file?", 
                `wins[${this.id_win}].action_close();`, 
                ``);
        } else {
            wins[this.id_win].action_close();
        }
        
    }

    // Update status of title
    updateTitleStatus() {
        let s = this.#saved ? '' : '*';
        console.log(s, "dddd");
        this.changeTitle(`${s}Notebook - ${this.#curr_file.getName()}`);
    }

    // Set property of Text area
    setTxtProperty(what, value) {
        if(what == "cnt") {
            $(`#win-${this.id_win} > .win-content > .win-txt-area`).val(value);
        } else {
            $(`#win-${this.id_win} > .win-content > .win-txt-area`).css(what, value);
        }
    }

    // get property of Text area
    getTxtProperty(what) {
        if(what == "cnt") {
            return $(`#win-${this.id_win} > .win-content > .win-txt-area`).val();
        } else {
            return $(`#win-${this.id_win} > .win-content > .win-txt-area`).css(what);
        }
        
    }

    // View option
    fontIncrease() {
        this.setTxtProperty("font-size", parseInt(this.getTxtProperty("font-size")) + 2);
    }
    // View option
    fontDecrease() {
        this.setTxtProperty("font-size", parseInt(this.getTxtProperty("font-size")) - 2);
    }
    // View option
    fontReset() {
        this.setTxtProperty("font-size", 18);
    }

    // questiopn to user for new file
    askNew() {
        if(this.getTxtProperty("cnt") != "" && !this.#saved) {
            xquestion("Unsaved document",
             "Are you sure to close unsaved file? <br/> Then you lose your document forever.", 
             `wins[${this.id_win}].new()`, 
             ``);
        } else {
            this.new();
        }
    }

    // Creating new file
    new() {
        this.#saved = false;
        this.#last_path = undefined;
        this.#curr_file = new File("Untitled.txt");
        this.setTxtProperty("cnt", "");
    }
}