class TaskItem {
    constructor(name, iter, icon, style_icon) {
        this.name = name;
        this.link_id_win = iter;

        this.m_id = new MenuTemplate("Task Item " + iter);

        this.m_id.pushNewOption("Duplicate " + name, "wins["+iter+"].duplicate()");
        this.m_id.pushNewSeparator();
        this.m_id.pushNewOption("Pin to taskbar", null);
        this.m_id.pushNewOption("Close", "wins["+iter+"].action_close()");

        this.m_id = cxtm.addMenu(this.m_id);

        let item = '<div class="task-item-style" id="task-item-'+iter+'" menuv="'+this.m_id+'"><i class="'+icon+'" style="'+style_icon+'" menuv="'+this.m_id+'"></i></div>';

        $('#task-bar-items').append(item);
        this.addHoveringEvent();
        this.addMaximizeEvent();
    }

    // ADD EVENT: Hover item if mouse is touching it
    addHoveringEvent() {
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

    // ADD EVENT: Maxmize task's window
    addMaximizeEvent() {
        let id = this.link_id_win;
        $('#task-item-' + id).on("click", function() {
            if($('#task-item-' + id).is(".task-item-min")) {
                wins[id].action_unmin();
            }
            else {
                wins[id].action_min();
            }
        });
    }

    // Remove item from taskbar
    removeItem() {
        $('div').remove('#task-item-' + this.link_id_win);
        cxtm.removeMenu(this.m_id);
    }

    // Display minimized status
    min() {
        $('#task-item-' + this.link_id_win).addClass("task-item-min");
    }
    
    // Display unminimized status
    unmin() {
        $('#task-item-' + this.link_id_win).removeClass("task-item-min");
    }
}