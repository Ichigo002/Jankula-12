class Win_Explorer extends Window {
    constructor(width, height, iterator, file_system__) {
        super("File Explorer", width, height, iterator, '<i class="icon-folder-open"></i>');
        this.ptr = new DirFollower(file_system__);

        let content = '';


        this.setContent(content);
    }



}