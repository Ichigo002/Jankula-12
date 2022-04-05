class Window {
    active = true;
    def_height = 100;
    def_width = 100;
    system_name = "win-0";

    constructor(name, width, height) {
        this.name = name;
        this.width = width;
        this.height = height;
    }

    test() {
        console.log(this.system_name);
    }
}