
// Throw error on the desktop of user when error takes place.
// Specific value returned by throwErr is -9.
function throwErr(err) {
    ErrorHandler.handle(err);
    return -9;
}

class ErrorHandler {
    constructor() {
        return throwErr(new ERROR("ErrorHandler:constructor()",
         "ERR_CREATE_STATIC_OBJ",
         "ErrorHandler cannot be created like normal<br/> object because this is only set of methods"));
    }

    static handle(err) {
        wins.push(new Window(iter, err.type(), AUTO_RESIZE, AUTO_RESIZE, 'icon-win-attention', 'color: #f70000;'));

        wins[iter].setCenter();

        let wh_cnt = "";
        if(err.where() != undefined || err.where() != "") {

        }

        let dtls_cnt = "";
        let dtls_btn = "";
        if(err.detailsError() != undefined || err.detailsError() != "") {
            dtls_cnt = `<span class="qerr-details" style="display: none"><br/><span style="font-weight: bold;">Details:</span> <br/>${err.detailsError()}</span>`

            dtls_btn = `<button onclick='ErrorHandler.execDetails(${iter})' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'><Details></button>`;
        }
    
        let actionOk = 'wins[' + iter + '].action_close()';
        let cnt = `<i class='icon-win-attention' style='color:#f70000; float:left; font-size: 60px;'></i>
        <p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>
            <span style="font-weight: bold;">Occurred at:</span> <br/> ${err.where()} <br/> 
             <span style="font-weight: bold;">Cause:</span> <br/> ${err.cause()} <br/>
            ${dtls_cnt}
        </p>
        <p style='both:clear;'>
            <button onclick='${actionOk}' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Ok</button>
            
            ${dtls_btn};
        </p>`;
    
        _defaultSettingsBox_(cnt);
        iter++;
        return iter - 1;
    }

    static execDetails(i) {
        let p = `#win-${i} > .win-content > p > .qerr-details`;
        if($(p).css("display") != "none") {
            $(p).css("display", "none");
        } else {
            $(p).css("display", "block");
        }
        
    }
}

class ERROR {
    #where = "N/a";
    #type = "GENERAL_ERROR";
    #cause = "Not specified cause.";
    #details = "";

    // _where -> Place where error is executed [FileSystem:addfile(obj)]
    // _type -> Type of error [e.g. ERRMK]
    // _cause -> Short description of error
    // _details -> Longer description [OPTIONAL]
    // If you do not need some option error, you can left place empty ""
    constructor(_where, _type, _cause, _details) {
        this.#where = _where;
        this.#type = _type;
        this.#cause = _cause;
        this.#details = _details;
    }

    where() {
        return this.#where;
    }

    type() {
        return this.#type;
    }

    cause() {
        return this.#cause;
    }

    detailsError() {
        return this.#details;
    }
}