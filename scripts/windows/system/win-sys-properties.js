class Win_Properties extends Window {
    constructor(iter) {
        super(iter, "Properties", 400, AUTO_RESIZE, 'icon-settings', 'color: #24ebff;');
        console.log(iter + " ddd");
        this.setPosition(400,430);

        this.file;

        $(`#win-${iter} > .win-top > span > i.icon-maximize`).remove();
        $(`#win-${iter} > .win-top > span > i.icon-minimize`).remove();
        
        this.html_path = "#win-" + this.id_win + " > .win-content > .prop-center > table > tbody";

        let content = 
        '<div class="prop-top">'+
            '<i class="icon-settings"></i>'+
            '<input type="text" value="Lorem iddel more.exe"/></div>'+
        '<div class="prop-center"><table><tbody></tbody></table></div>'+
        '<div class="prop-footer">'+
            `<button class='ok' onclick="wins[${iter}].onOk()">Ok</button>`+
            `<button class='cancel' onclick="wins[${iter}].action_close()">Cancel</button>`+
            `<button onclick="wins[${iter}].onApply()">Apply</button></div>`;

        this.setContent(content).setStatic(true).setPositionResizePoint();
        this.setKeyboardEvent();
        return this;
    }

    setKeyboardEvent() {
        let id = this.id_win;
        $(window).keydown(function(e) {
            if($('#win-' + id).css('z-index') == z_index) {
                if(e.which == 13) { //enter
                    $('#win-' + id + " > .win-content > .prop-footer > button.ok").trigger("onclick");
                }
                if(e.which == 27) { //escape
                    $('#win-' + id + " > .win-content > .prop-footer > button.cancel").trigger("onclick");
                }
            }
        });
    }

    // Called if Apply button clicked. Saves name and values
    onApply() {
        if(this.file.getName() != this.getNameProperty()) {
            switch(this.file.rename(this.getNameProperty())) {
                case "FORBIDDEN_SIGNS":
                    xwarning("Incorrect name", "Item's name cannot includes '/' or '\\'.");
                break;
                case "ZERO_LENGTH":
                    xwarning("Incorrect name", "Item must have new name.");
                break;
                case "FORBIDDEN_RENAMING": 
                    xerror("Forbidden renaming item", "You cannot rename this item.");
                break;
                default:
                    //yrhryyhry
                break;
            }
        }
        $("#handler_event").trigger("exp_refresh");
    }

    // Apply and close window
    onOk() {
        this.onApply();
        this.action_close();
    }

    // Set name to edit item
    setNameProperty(name) {
        $("#win-" + this.id_win + " > .win-content > .prop-top > input").attr("value", name);
        return this;
    }

    // Get name to rename item
    getNameProperty() {
        return $("#win-" + this.id_win + " > .win-content > .prop-top > input").val();
    }

    // Set main icon in the preferences
    setIcon(icon_class) {
        $("#win-" + this.id_win + " > .win-content > .prop-top > i").removeClass('icon-settings').addClass(icon_class);
        return this;
    }

    // Add to the preferences new value
    pushNewValue(name, value) {
        $(this.html_path).append("<tr><th>"+name+":</th><th>"+value+"</th></tr>");
        return this;
    }

    // Add separator
    pushSeparator() {
        $(this.html_path).append('<tr><th colspan="2"><div class="prop-sep"></div></th></tr>');
        return this;
    }

    // Add new checkbox which is saved when click apply
    // Doesn't work correctly
    // [NOT WORKING]
    pushNewCheckbox(name, action_onclick) {
        $(this.html_path).append('<tr><th>'+name+'</th><th><input type="checkbox" onclick="'+action_onclick+'"/></th></tr>');
        return this;
    }

    // Display file
    displayFileProperties(_file, path) {
        this.file = _file;
        this.setIcon(_file.getIcon());
        this.setNameProperty(_file.getName());
        if(_file.type() == FILE) {
            this.pushNewValue("Type", (_file.ext() != "")? _file.ext().toUpperCase() + " File" : _file.type());
        } else {
            this.pushNewValue("Type", _file.type());
        }

        this.pushSeparator();
        this.pushNewValue("Path", path);
        if(_file.type() == FILE) {
            this.pushNewValue("Size", new Blob([_file.readFile()]).size + " Bytes");
        } else {
            this.pushNewValue("All Items", (_file.countAll() == -1)? 0 : _file.countAll());
            this.pushNewValue("Files", (_file.countFiles() == -1)? 0 : _file.countFiles());
            this.pushNewValue("Folders", (_file.countDirs() == -1)? 0 : _file.countDirs());
        }

        this.pushSeparator();
        this.pushNewValue("Created", _file.getCreatedDate() + " " + _file.getCreatedTime());
        this.pushNewValue("Modified", _file.getModifiedDate() + " " + _file.getModifiedTime());
        this.pushNewValue("Accessed", _file.getAccessedDate() + " " + _file.getAccessedTime());
        this.pushSeparator();

        let cnt = "";
        _file.attributes.forEach(attr => {
            cnt += attr + ", ";
        });
        this.pushNewValue("Attributes", cnt);
    }
}