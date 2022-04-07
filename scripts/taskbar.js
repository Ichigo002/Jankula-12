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
            ShowInfo(id, c);
        });
    }
}

function ShowInfo(id, content) 
{
    //$('#task-bar').append
}