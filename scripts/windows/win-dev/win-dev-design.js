class Win_Dev_Design extends Window {
    
    constructor(win_iterator) {
        super(win_iterator, "Designer Studio", 500, 350, 'icon-picture', 'color: purple;');
    }

    Set(id_div_cnt) {
        wins[win_iterator].SetContent($('#' + id_div_cnt).html());
    }

    

}