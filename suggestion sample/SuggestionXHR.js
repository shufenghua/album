(function(global) {

function SuggestionXHR(options) {
        
    // Suggestion URL
    this.URL = null;
    
    // 延迟请求，防止过快无用请求
    this.delay = 200;
    
    // 用户参数
    $.extend(this, options);
    
    // 延迟计时器
    this.delayTimer = null;

    // xhr请求
    this.xhr = null;

    // 缓存服务器数据
    this.cache = {};
    
    this.init();
}

SuggestionXHR.prototype = {
    
    'init' : function() {
        if(!this.URL) {
            throw new Error("no url for suggestion");
        }
    },
    
    /**
     * 获取key对应的suggestion value
     */
    'getSuggestion' : function(params, callback) {
        var query = this._getQuery(params),
            cacheData = this.cache[query];
        
        callback = typeof callback === 'function' ? callback : $.noop;
        
        // 停止等待中的请求
        this.stop();
        
        if(cacheData) {
            callback(cacheData);
        } else {
            this._getXHRData(query, callback);
        }
    },
    
    /**
     * 停止正在进行中的请求或等待队列
     */
    'stop' : function() {
        clearTimeout(this.delayTimer);
        if(this.xhr && this.xhr.readyState !== 4) {
            this.xhr.abort();
        }
    },

    '_getQuery': function(params) {
        var query = "";
        if(typeof params == "string") {
            query = params;
        } else if(params && typeof params == "object") {
            var queryArr = [];
            for(var i in params) {
                if(params.hasOwnProperty(i)) {
                    queryArr.push(i+"="+params[i]);
                }
            }
            query = queryArr.join("&");
        }
        return query;
    },
    
    /**
     * 异步获取suggestion value
     */
    '_getXHRData' : function(query, callback) {
        var _this = this, result, xhr = this.xhr;

        this.delayTimer = setTimeout(function() {
            _this.xhr = $.get(_this.URL + "?" + query, function(data) {
                callback(data);
                _this.cache[query] = data;
            });
        }, this.delay);
    }
};

// common js implement
if(typeof global.define == "function") {
    global.define("SuggestionXHR", SuggestionXHR);
}

global.SuggestionXHR = SuggestionXHR;

} (window));
