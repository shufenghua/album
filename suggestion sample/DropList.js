(function(global) {
   
function DropList(options) {

    // list对应的头输入框，输入框作为list的事件触发器，负责触发list的所有事件(一般是input, alink)
    this.trigger = null;
    
    // list 的dom container
    this.container = null;
    
    // list item 选择符 
    this.itemSelector = '._j_listitem';
    
    // 选项被选择（hover key to）时
    this.itemHoverClass = 'on';
    
    // 合并传入参数
    $.extend(this, options);
   
    this.trigger = $(this.trigger);
    this.container = $(this.container);
    
    // 鼠标是否在container上
    this.mouseon = false;
    
    // list是否属于显示状态
    this.visible = false;
    
    this.init();
}

DropList.prototype = {
    
    'createContainer' : $.noop,
    
    'updateList' : $.noop,
    
    'init': function() {
        if(!this.trigger.length) { 
            throw new Error("no trigger for drop list");
        }
        if(!this.container.length) {
            this.container = this.createContainer();
        }
        if(!this.container.length) {
            throw new Error("no container for drop list");
        }

        this.bindEvents();
    },

    'bindEvents' : function() {
        // trigger event
        this.trigger.on("keydown", $.proxy(function(ev) {
            var keyCode = ev.keyCode;
            
            // 响应事件（enter\backspace, key up, key down）
            if(this.visible && (keyCode == 13 || keyCode == 32)) { // select list item
                this.selectItem();
            } else if(this.visible && keyCode == 38) { // key up dir
                this.moveFocus(-1);
            } else if(this.visible && keyCode == 40) { // key down dir
                this.moveFocus(1);
            }
        }, this));
        
        // list 事件
        this.container
            .on('mouseenter', this.itemSelector, $.proxy(this.moveFocus, this))
            .on('click', this.itemSelector, $.proxy(this.clickItem, this))
            .on('mouseenter', $.proxy(this.mouseOverCnt, this))
            .on('mouseleave', $.proxy(this.mouseOutCnt, this));
    },
    
    'show' : function(data) {
        this.updateList(data);
        this.container.show();
        this.visible = true;
    },
    
    'hide' : function() {
        this.container.hide();
        this.visible = false;
    },
    
    'clickItem' : function(ev) {
        this.selectItem();
        ev.preventDefault();
    },

    'selectItem': function() {
        Event(this).fire('item selected', {'item':this.getFocusItem()});
    },
    
    'moveFocus' : function(target) {
        var items = this.container.find(this.itemSelector),
            focusItem = this.getFocusItem(),
            nextItem = focusItem;
            
        if(target === -1) { // move up
            if(focusItem.length) {
                nextItem = focusItem.prev(this.itemSelector);
            }
            if(!nextItem.length) { nextItem = items.last(); }
        } else if(target === 1) { // move down
            if(focusItem.length) {
                nextItem = focusItem.next(this.itemSelector);
            }
            if(!nextItem.length) { nextItem = items.first(); }
        } else if(target.currentTarget) { // hover
            nextItem = $(target.currentTarget);
        }
        focusItem.removeClass(this.itemHoverClass);
        nextItem.addClass(this.itemHoverClass);
    },

    'getFocusItem': function() {
        var items = this.container.find(this.itemSelector);
        return items.filter('.' + this.itemHoverClass);
    },
    
    'mouseOverCnt' : function() { this.mouseon = true; },
    
    'mouseOutCnt' : function() { this.mouseon = false; }
};

// common js implement
if(typeof global.define == "function") {
    global.define("DropList", DropList);
}

global.DropList = DropList;

} (window));
