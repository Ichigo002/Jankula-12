class TaskItem {
    constructor(name, iter, icon) {
        this.name = name;
        this.link_id_win = iter;

        let item = '<div class="task-item-style" id="task-item-'+iter+'">'+icon+'</div>';

        $('#task-bar-items').append(item);
    }

    AddHoveringEvent() {
        let id = this.link_id_win;
        let c = this.name;

        $('#task-item-' + id).on("mousemove", function() {
            let center_item_x = $('#task-item-' + id).offset().left + parseInt($('#task-item-' + id).css('width')) / 2;

            $('#extra-info').css('opacity', '100%');
            $('#extra-info').text(c);
            $('#extra-info').css('left', center_item_x - parseInt($('#extra-info').css('width')) / 2);
        });
        $('#task-item-' + id).on("mouseout", function() {
            $('#extra-info').css('opacity', '0%');
            $('#extra-info').css('left', -200);
        });
    }

    removeItem() {
        $('div').remove('#task-item-' + this.link_id_win);
    }

    min() {
        $('#task-item-' + this.link_id_win).addClass("task-item-min");
    }
    
    unmin() {
        $('#task-item-' + this.link_id_win).removeClass("task-item-min");
    }
}