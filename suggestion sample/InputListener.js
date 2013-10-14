(function(global) {

InputListener = {
    'listen': function(target, handler) {
        target = $(target);
        if(!target.is("input") && !target.is("textarea")) {
            throw new Error("input listener only apply to input or textarea");
        }
        this.initListen(target, handler);
    },

    'unlisten': function(target) {
        target = $(target);
        if(!target.is("input") && !target.is("textarea")) {
            throw new Error("input listener only apply to input or textarea");
        }
        if(arguments.length == 1) {
            target.unbind("focus", this.getStartListenFunc());
            target.unbind("blur", this.getStopListenFunc());
        } else if(typeof arguments[1] == "function") {
            var handler = arguments[1],
                handlers = target.data("__input_listener_listeninterval");
            for(var i=0, len=handlers.length; i<len; i++) {
                if(handlers[i] == handler) {
                    handlers.splice(i, 1);
                    i--;
                }
            }
        }
    },

    'initListen': function(target, handler) {
        if(!target.data("__input_listener_handlers")) {
            this.bindListenEvent(target);
        }
        this.addListenHandler(target, handler);
    },

    'bindListenEvent': function(target) {
        target.data({"__input_listener_handlers": [], "__input_listener_currentval": target.val()});
        target.focus(this.getStartListenFunc());
        target.blur(this.getStopListenFunc());
    },

    'getStartListenFunc': function() {
        if(!this.bindStartListenFunc) {
            this.bindStartListenFunc = $.proxy(this.startListen, this);
        }
        return this.bindStartListenFunc;
    },

    'getStopListenFunc': function() {
        if(!this.bindStopListenFunc) {
            this.bindStopListenFunc = $.proxy(this.stopListen, this);
        }
        return this.bindStopListenFunc;
    },

    'startListen': function(ev) {
        var target = $(ev.target);
        target.data("__input_listener_currentval", target.val());
        target.data("__input_listener_listeninterval", setInterval($.proxy(function() {
            var prevVal = target.data("__input_listener_currentval"),
                newVal = target.val();
            if(prevVal != newVal) {
                target.data("__input_listener_currentval", newVal);
                this.triggerListenHandler(target);
            }
        }, this), 200));
    },

    'stopListen': function(ev) {
        var target = $(ev.target);
        clearInterval(target.data("__input_listener_listeninterval"));
    },

    'addListenHandler': function(target, handler) {
        if(typeof handler == "function") {
            target.data("__input_listener_handlers").push(handler);
        }
    },

    'triggerListenHandler': function(target) {
        var handlers = target.data("__input_listener_handlers");
        for(var i=0, len=handlers.length; i<len; i++) {
            handlers[i].call(null, {"target":target.get(0)});
        }
    }
}; 


// common js implement
if(typeof global.define == "function") {
    global.define("InputListener", InputListener);
}

global.InputListener = InputListener;

} (window));
