!(function() {
    function copy(obj) {
        return Object.assign({}, obj);
    }
    var Event = new Vue();
    Vue.component("task", {
        template: "#task-list-tp",
        props: ["todo"],
        methods: {
            action: function(name, params) {
                Event.$emit(name, params);
            }
        }
    });
    new Vue({
        el: "#main",
        data: {
            list: [],
            current: {},
            moreList: false
        },
        methods: {
            showList: function() {
                this.moreList = !this.moreList;
            },
            check_alert: function() {
                me = this;
                this.list.forEach(function(element, index) {
                    var isAlert = element.isAlert;
                    // console.log(isAlert);
                    if (!isAlert) {
                        return;
                    } else {
                        var alert_date = new Date(element.alert_time);
                        alert_date = alert_date.getTime();
                        var now = new Date().getTime();
                        // console.log("now:" + now);
                        // console.log("alert_date:" + alert_date);
                        if (now >= alert_date) {
                            console.log(1);
                            // confirm(element.title);
                            document.getElementById("alert_time").play();

                            var confirmed = confirm(element.title);

                            if (confirmed) {
                                element.isAlert = false;
                            } else {
                                document.getElementById("alert_time").play();
                            }
                            // console.log(1111);
                        }
                    }
                });
            },
            merge: function() {
                var todo = copy(this.current);
                var id = this.current.id;
                if (id) {
                    var index = this.find_index(id);
                    // this.list[index] = copy(this.current);
                    // 这个方法主要用于避开 Vue 不能检测属性被添加的限制。
                    Vue.set(this.list, index, copy(this.current));
                } else {
                    if (!todo.title) return;
                    todo.id = this.next_id();
                    todo.complete = false;
                    todo.isAlert = true;
                    todo.completeName = "未完成";
                    console.log(todo);
                    this.list.push(todo);
                    // ms.set("list", this.list);
                }
                this.reset_current();
            },
            remove: function(id) {
                console.log(id);
                this.reset_current();
                var index = this.find_index(id);
                this.list.splice(index, 1);
                // ms.set("list", this.list);
            },

            next_id: function() {
                var a = this.list.length;
                var findId = function() {
                    for (itemObj of me.list) {
                        console.log(itemObj.id);
                        if (itemObj.id == a) {
                            a++;
                            findId();
                        }
                    }
                };
                findId();
                return a;
            },
            set_current: function(todo) {
                this.current = copy(todo);
                me.moreList = !me.moreList;
                document.getElementById("input-task").focus();
            },
            reset_current: function() {
                this.current = {};
            },
            find_index: function(id) {
                return this.list.findIndex(function(item) {
                    return item.id == id;
                });
            },
            toggle_complete: function(id) {
                var i = this.find_index(id);
                Vue.set(this.list[i], "complete", !this.list[i].complete);
                if (this.list[i].complete) {
                    Vue.set(this.list[i], "completeName", "完成");
                    console.log("完成");
                } else {
                    Vue.set(this.list[i], "completeName", "未完成");
                    console.log("未完成");
                }
                // this.list[i].complete = !this.list[i].complete;
            }
        },
        mounted: function() {
            this.list = ms.get("list") || this.list;
            me = this;
            Event.$on("remove", function(params) {
                me.remove(params);
            });
            Event.$on("set_current", function(params) {
                me.set_current(params);
            });
            Event.$on("toggle_complete", function(params) {
                me.toggle_complete(params);
            });
            setInterval(function(todo) {
                me.check_alert();
            }, 1000);
        },
        watch: {
            list: {
                deep: true,
                handler: function(n, o) {
                    if (n) {
                        ms.set("list", this.list);
                    } else {
                        ms.set("list", []);
                    }
                }
            }
        }
    });
})();