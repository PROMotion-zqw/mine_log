export function isEmpty(opt, ObjKeys) {
    /**
     * ObjKeys type is "object" if ObjKeys attribute value and opt Object attribute value is equal ?
     * Don't do anything or judge*/
    let _opt = JSON.parse(JSON.stringify(opt)),
        msg = null;
    switch (Types(_opt)) {
        case "Object":
            for (var ks in _opt) {
                if (ObjKeys) {
                    if (ks in ObjKeys && ObjKeys[ks] === _opt[ks]) {
                        _opt[ks] = "";
                    }
                }
                if (!_opt[ks]) {
                    !msg ? msg = `请输入${keyValue[ks]}` : null;
                }
            }
            if (msg) {
                return msg
            }
            break;
    }
}
export function Types(ob) {
    return Object.prototype.toString.call(ob).split(" ")[1].split("]")[0]
}
export const keyValue = {
    auth: "验证码",
    user: "用户名",
    password: "密码"
}
export function getUser(opt, fn, fns) {
    opt.$http({
        method: "get",
        url: "/api/getUser?page=1&pageSize=10"
    })
        .then(res => {
            fn && fn()
        })
        .catch(err => {
            fns && fns(err)
        });
}
function handleResize(e, fn) {
    fn && fn(window.innerWidth, window.innerHeight)
}
export function MonitorSize(fn) {
    handleResize(null, fn)
    window.onresize = function (e) {
        handleResize(e, fn)
    }
}
export function keyDowns(fn) {
    document.body.onkeydown = fn
}

export function postWord(that, param, fn) {
    that.$http({
        url: "/api/addWord" + (param.method === "get" ? param.data : ""),
        method: param.method,
        data: param.data
    })
        .then(rs => {
            fn && fn(true, rs)
        })
        .catch(err => {
            fn && fn(false, err)
            console.log("login ERR", err);
        });
}