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

function ajax() {
    var ajaxData = {
        method: (arguments[0].type || "GET").toUpperCase(),
        url: arguments[0].url || "",
        async: arguments[0].async || "true",
        data: arguments[0].data || null,
        responseType: arguments[0].dataType || "json",
        contentType: arguments[0].contentType || "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: arguments[0].beforeSend || function () { },
        success: arguments[0].success || function () { },
        error: arguments[0].error || function () { }
    }

    ajaxData.beforeSend()
    var xhr = createxmlHttpRequest();
    xhr.responseType = ajaxData.dataType;

    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);
    xhr.send(convertData(ajaxData.data));

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                ajaxData.success(xhr.response)
            } else {
                ajaxData.error()
            }
        }
    }
}

function createxmlHttpRequest() {
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
}

function convertData(data) {
    if (typeof data === 'object') {
        var convertResult = "";
        for (var c in data) {
            convertResult += c + "=" + data[c] + "&";
        }
        convertResult = convertResult.substring(0, convertResult.length - 1)
        return convertResult;
    } else {
        return data;
    }
}

function downloadMp3(obj) {

    ajax({
    type: "GET",
    url: `/gettts?lan=${obj.model}&text=${obj.name}&spd=3&source=web`,
    dataType: "arraybuffer",
    success: function (res) {
              console.log("audio", res);
              let blob = new Blob([res], {
                type: "audio/mpeg;charset=utf-8"
              });
              let fileName = obj.name+".mp3";
              if ("download" in document.createElement("a")) {
                // 非IE下载
                let elink = document.createElement("a");
                elink.download = fileName;
                elink.style.display = "none";
                elink.href = URL.createObjectURL(blob);
                // document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                // document.body.removeChild(elink);
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
    }
    })
    
    }