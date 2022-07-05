class Utility {
    constructor() {
        return throwErr(new ERROR("Utility -> constructor()", "ERR_CREATE_STATIC_OBJ", "You cannot create static object<br/> beacuse it has nothing method and features of object."));
    }

    //Replace same array of signs like key_ to replace_ value and return replaced input
    //
    // input - text to search
    // replace_ - inserted value in the place of key
    // key_ - what method have to look for. ex: key_ = "foo", look for: "$foo$"
    static replaceHolder(input, replace_, key_) {
        let prefix = '$';
        let st_pos = input.indexOf(prefix + key_ + prefix);

        if(st_pos == -1 ) {
            return new ERROR("Utility -> static replaceHolder(...)", "ERR_NOT_FOUND_KEY", `The input does not contain key: $${key_}$`);
        }

        let txt = "";
        for (let i = 0; i < input.length; i++) {
            if(i == st_pos) {
                for (let j = 0; j < replace_.length; j++) {
                    txt += replace_.at(j);
                }
                i += st_pos + key_.length + 2;
            } else {
                txt += input.at(i);
            }
        }
        return txt;
    }
}