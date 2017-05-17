;(function(win){
	var toAppNew = win.webkit?win.webkit.messageHandlers:null,
		inApp = toAppNew || win.toApp
	win.AH = []
	var handler = function(handlers, callback){
		this._init(handlers, callback)
	}
	handler.prototype = {
		constructor: handler,
		_init: function(handlers, callback){
			this._count = 1
			this._handlers = handlers
			this._func_handlers = this._set_handlers(handlers)
			this._callback = callback
			this._value_dict = {}
			win.AH.push(this)
			return this
		},
		_set_handlers: function(handlers){
			var result = []
			handlers.forEach(function(v){
				result.push(typeof v=='string'?v:v[0])
			})
			return result
		},
		_callapp: function(){
			var handlers = this._handlers,
				sum = handlers.length,
				callback = this._callback,
				me=this;
				
			if(toAppNew){
				handlers.forEach(function(v){
					if(typeof v == 'string'){
						toAppNew[v].postMessage([])
					}else if(v instanceof Array && v.length>1){
						var name = v.shift()
						toAppNew[name].postMessage(v)
					}
        		})
			}else if(win.toApp){
				handlers.forEach(function(v){
					if(typeof v == 'string'){
						me._value_dict[v] = toApp[v]()
					}else if(v instanceof Array && v.length>1){
						var name = v.shift()
						var	func = win.toApp[name]
						me._value_dict[v] = JSON.stringify(win.toApp[name].apply(win.toApp, v) || '')
					}
				})
				callback && callback(this._value_dict)
			}else{
				callback && callback(this._value_dict)
			}
			return this
		}
	}

	var ah = {
		callapp: function(handlers, callback){
			new handler(handlers, callback)._callapp()
		},
		callApp: function(handlers, callback){
			new handler(handlers, callback)._callapp()
		},
		inApp: inApp
	}

	win.app_callback = function(name, value){
		for(var i=0;i<win.AH.length;i++){
			var _AH = win.AH[i],
				index = _AH._func_handlers.indexOf(name)
			if(index>=0){
				
				_AH._func_handlers.splice(index, 1)
				if(value){
					
					_AH._value_dict[name] = typeof value=='object'?JSON.stringify(value):value.toString()
				}else{
					
					_AH._value_dict[name] = ''
					if(value==0)_AH._value_dict[name] =value;
				}
				if(!_AH._func_handlers.length){
					_AH._callback(_AH._value_dict)
					win.AH.splice(i, 1)
				}
				break
			}
		}
	}

	if (typeof module != 'undefined' && module.exports) {
	    module.exports = ah;
	} else if (typeof define == 'function' && define.amd) {
	    define(function() {
	        return ah;
	    });
	} else {
	    win.ah = ah;
	}
}(window));