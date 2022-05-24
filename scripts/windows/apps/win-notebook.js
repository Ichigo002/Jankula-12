class Win_Notebook extends Window {
    constructor(iter) {
        super(iter, "Notebook", 600, 400, "icon-app-notebook", "color: #0ff;");

        let st = new MenuTemplate("Notebook - menu");

        this.setToolbar();
    }
}