class Win_Dev_Design extends Window {
    
    constructor(win_iterator) {
        super(win_iterator, "Designer Studio", 500, 350, 'icon-picture', 'color: purple;');
    }

    Set(id_div_cnt) {
        if($('#' + id_div_cnt).html() == undefined) {
            wins[this.id_win].setContent("<p style='padding:15px;'><h3 style='padding: 10px;'>DIV with input ID doesn't exist</h3>Create on the website any div with ID and type in the constructor of designer studio.</p>");
        } else {
            wins[this.id_win].setContent($('#' + id_div_cnt).html());
        }
        
    }

    

}