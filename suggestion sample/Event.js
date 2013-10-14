(function(global) {

// Event object Wrap
function Event(obj) {
    if(typeof obj !== "object" || obj === null) {
        throw new Error("only object has event");
    }
    if(typeof obj.__event_id !== "number") {
        obj.__event_id = Event.innerID;
        Event.innerID += 1;
    }

    // create event type handler
    var typePrefix = "__objevents_"+obj.__event_id;
    return {
        'on': function(eventType, handler) {
            return (new EventObj(typePrefix+eventType)).on(handler);
        },

        'fire': function(eventType) {
            var args = Array.prototype.slice.call(arguments, 1);
            return (new EventObj(typePrefix+eventType).fire(args));
        },

        'un': function(eventType, handler) {
            return (new EventObj(typePrefix+eventType)).un(handler);
        }
    };
}
Event.innerID = 1;

// simple events
Event.on = function(eventType, handler) {
    return (new EventObj(eventType)).on(handler);
};
Event.fire = function(eventType) {
    var args = Array.prototype.slice.call(arguments, 1);
    return (new EventObj(eventType).fire(args));
};
Event.un = function(eventType, handler) {
    return (new EventObj(eventType)).un(handler);
};

// event object
var eventObjMap = {};
function EventObj(eventType) {
    if(eventType in eventObjMap) {
        return eventObjMap[eventType];
    }

    this.handlers = [];
    eventObjMap[eventType] = this;
    return this;
}
EventObj.prototype = {
    'on': function(handler) {
        if(typeof handler !== "function") {
            throw new Error("handler on event must be a function");
        }
        this.handlers.push(handler);
    },
    'fire': function(args) {
        var i = 0, handlers = this.handlers, len = handlers.length;
        for(; i<len; i++) {
            var handler = handlers[i];
            handler.apply(null, args);
        }
    },
    'un': function(handler) {
        if(typeof handler === "function") {
            var i = 0, handlers = this.handlers, len = handlers.length;
            for(; i<len; i++) {
                if(handler === handlers[i]) {
                    handlers.splice(i, 1);
                }
            }
        }
    }
};

// common js implement
if(typeof global.define == "function") {
    global.define("Event", Event);
}

global.Event = Event;

} (window));
