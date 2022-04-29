class Win_Properties extends Window {
    constructor(iter, action_onEditName) {
        super("Properties", 400, AUTO_RESIZE, iter, 'icon-settings', 'color: #24ebff;');
        this.setPosition(400,430);
        
        this.html_path = "#win-" + this.id_win + " > .win-content > .prop-center > table > tbody";

        let content = 
        '<div class="prop-top">'+
            '<i class="icon-settings"></i>'+
            '<input type="text" value="Lorem iddel more.exe"/></div>'+
        '<div class="prop-center"><table><tbody></tbody></table></div>'+
        '<div class="prop-footer">'+
            '<button>Ok</button>'+
            '<button>Cancel</button>'+
            '<button>Apply</button></div>';

        this.setContent(content);
        this.static = true;
        this.setPositionResizePoint();
        return this;
    }

    setNameProperty(name) {
        $("#win-" + this.id_win + " > .win-content > .prop-top > input").attr("value", name);
        return this;
    }

    getNameProperty() {
        return $("#win-" + this.id_win + " > .win-content > .prop-top > input").attr("value");
    }

    setIcon(icon_class) {
        $("#win-" + this.id_win + " > .win-content > .prop-top > i").removeClass('icon-settings').addClass(icon_class);
        return this;
    }

    pushNewValue(name, value) {
        $(this.html_path).append("<tr><th>"+name+":</th><th>"+value+"</th></tr>");
        return this;
    }

    pushSeparator() {
        $(this.html_path).append('<tr><th colspan="2"><div class="prop-sep"></div></th></tr>');
        return this;
    }

    pushNewCheckbox(name, action_onclick) {
        $(this.html_path).append('<tr><th>'+name+'</th><th><input type="checkbox" onclick="'+action_onclick+'"/></th></tr>');
        return this;
    }

    displayFileProperties(_file, path) {
        if(_file.type() == FILE) {
            this.setIcon(_file.icon);
            this.setNameProperty(_file.name);
            this.pushNewValue("Type", _file.type());
            this.pushSeparator();

            this.pushNewValue("Path", path);
            this.pushNewValue("Size", "null");
            this.pushSeparator();

            this.pushNewValue("Created", _file.date + " " + _file.time);
            this.pushNewValue("Modified", _file.date + " " + _file.time);
            this.pushNewValue("Accessed", _file.date + " " + _file.time);
            this.pushSeparator();

            this.pushNewCheckbox("Hidden", "alert('Hidden!!!')");

        }
    }
}