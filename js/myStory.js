!(function() {
    window.ms = {
        set: set,
        get: get,

        delele: deleteItem
    };

    function get(key) {
        var json = localStorage.getItem(key);
        if (json) {
            // 把json转换为js对象

            // console.log(JSON.parse(json));
            return JSON.parse(json);
        }
    }

    function set(key, val) {
        // 转换对象为json
        localStorage.setItem(key, JSON.stringify(val));
    }

    function deleteItem(key) {
        localStorage.removeItem(key);
    }
})();

// ms.set("name", "杨子皓");
// ms.set("name", "杨子皓1");
// ms.set("obj", "{a:1}");
// var name = ms.get("name");
// var obj = ms.get("obj");