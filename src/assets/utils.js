export const isPlainObject = function isPlainObject(obj) {
    let proto, Ctor;
    if (!obj || Object.prototype.toString.call(obj) !== "[object Object]") return false;
    proto = Object.getPrototypeOf(obj);
    if (!proto) return true;
    Ctor = proto.hasOwnProperty('constructor') && proto.constructor;
    return typeof Ctor === "function" && Ctor === Object;
};

export const formatTime = function formatTime(time, temp = "{0}年{1}月{2}日") {
    if (typeof time !== "string") throw new TypeError("time is not a string");
    if (typeof temp !== "string") throw new TypeError("temp is not a string");
    let arr = time.match(/\d+/g);
    return temp.replace(/\{(\d+)\}/g, (_, $1) => {
        let item = arr[$1] || "00";
        if (item.length < 2) item = "0" + item;
        return item;
    });
};


// 具备有效期的localStorage
export const store = {
    set(key, value) {
        localStorage.setItem(key, JSON.stringify({
            time: +new Date(),
            data: value
        }));
    },
    get(key, diff = 30 * 24 * 60 * 60 * 1000) {
        let temp = localStorage.getItem(key);
        if (!temp) return "";
        let { time, data } = JSON.parse(temp);
        if ((+new Date() - time) > diff) {
            // 过期了
            store.remove(key);
            return "";
        }
        // 有效
        return data;
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};