class Win_Notebook extends Window {
    constructor(iter) {
        super(iter, "Notebook", 600, 400, "icon-app-notebook", "color: #0ff;");

        let tbm = new MenuTemplate("Notebook - toolbar");

        let filem = new MenuTemplate("Notebook - toolbar - file");
        filem.pushNewOption("New", null);
        filem.pushNewOption("New Window", `wins[${iter}].duplicate()`);
        filem.pushNewOption("Open...", null);
        filem.pushNewOption("Save", null);
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
        size_fontsm.pushNewOption("Increase", null);
        size_fontsm.pushNewOption("Decrease", null);
        size_fontsm.pushNewOption("Reset", null);
        viewm.pushNewSplitOption("Font Size", size_fontsm);
        viewm.pushNewOption("Preferences", null);
    
        let aboutm = new MenuTemplate("Notebook - toolbar - about");
        aboutm.pushNewOption("Help", null);
        aboutm.pushNewOption("About App", null);

        tbm.pushNewSplitOption("File", filem);    
        tbm.pushNewSplitOption("Edit", editm);    
        tbm.pushNewSplitOption("View", viewm);    
        tbm.pushNewSplitOption("About", aboutm);    

        this.setToolBar(tbm);
    }
}