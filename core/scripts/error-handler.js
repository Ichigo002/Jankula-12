const ERRORV = -9;
const SUCCESS = 0;

// Throw error on the desktop of user when error takes place.
// Specific value returned by throwErr is -9.
function throwErr(err) {
    ErrorHandler.handle(err);
    return ERRORV;
}

// Set of methods to handle errors
class ErrorHandler {
    constructor() {
        return throwErr(new ERROR("ErrorHandler -> constructor()",
        "ERR_CREATE_STATIC_OBJ",
        "ErrorHandler cannot be created like normal<br/> object because this is only set of methods"));
        
    }

    static handle(err) {
        let tp_cnt = "Not Specified Error";
        if(err.type(err.type() != undefined && err.type() != "") ) {
            tp_cnt = err.type();
        }
        wins.push(new Window(iter, tp_cnt, AUTO_RESIZE, AUTO_RESIZE, 'icon-win-attention', 'color: #f70000;'));

        wins[iter].setCenter();

        let wh_cnt = "";
        if(err.where() != undefined && err.where() != "") {
            wh_cnt = `<span style="font-weight: bold;">Occurred at:</span> <br/> ${err.where()} <br/>`;
        }

        let cs_cnt = `<span style="font-weight: bold;">Cause:</span> <br/> Unknown Error has occurred. <br/>`;
        if(err.cause() != undefined && err.cause() != "") {
            cs_cnt = `<span style="font-weight: bold;">Cause:</span> <br/> ${err.cause()} <br/>`;
        }

        let dtls_cnt = "";
        let dtls_btn = "";
        if(err.detailsError() != undefined && err.detailsError() != "") {
            dtls_cnt = `<span class="qerr-details" style="display: none"><br/><span style="font-weight: bold;">Details:</span> <br/>${err.detailsError()}</span>`

            dtls_btn = `<button onclick='ErrorHandler.execDetails(${iter})' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'><Details></button>`;
        }
    
        let actionOk = 'wins[' + iter + '].action_close()';
        let cnt = `<i class='icon-win-attention' style='color:#f70000; float:left; font-size: 60px;'></i>
        <p style='padding: 0px; padding-right: 20px; float: left; font-size: 18px;'>
            ${wh_cnt}
            ${cs_cnt}
            ${dtls_cnt}
        </p>
        <p style='both:clear;'>
            <button onclick='${actionOk}' style='float:right; margin: 5px 15px 15px 5px; width: 90px; height: 27px;'>Ok</button>
            
            ${dtls_btn}
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
    #where;
    #type;
    #cause;
    #details;

    // _where -> Place where error is executed [FileSystem:addfile(obj)]
    // _type -> Type of error [e.g. ERRMK]
    // _cause -> Short description of error
    // _details -> Longer description [OPTIONAL]
    // If you do not need some option error, you can left place empty ""
    constructor(_where, _type, _cause, _details) {
        this.#where = "Core -> " + _where;
        this.#type = _type;
        this.#cause = _cause;
        this.#details = _details;
    }

    static check(obj) {
        return (obj instanceof ERROR);
    }

    // Clear all tags html: <br/> 
    clearBR() {

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