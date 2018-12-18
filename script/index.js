import utilities from "./utilities"
var _Event = {
	on: function(event, querySelector, callback, useCapture) {
		return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
	},

	off: function(event, querySelector) {
		return this.removeEvent(this.getEventObject(event, querySelector));
	},

	bind: function(event, callback, useCapture) {
		return this.on(event, undefined, callback, useCapture);
	},

	unbind: function(event) {
		return this.removeEvent(this.getEventObject(event));
	},
	// 获取 jTool Event 对象
	getEventObject: function(event, querySelector, callback, useCapture) {
		// $(dom).on(event, callback);
		if (typeof querySelector === 'function') {
			useCapture = callback || false;
			callback = querySelector;
			querySelector = undefined;
		}
		// event callback 为必要参数
		if (!event) {
			utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
			return this;
		}

		// 子选择器不存在 或 当前DOM对象包含Window Document 则将子选择器置空
		// if(!querySelector || utilities.type(this.DOMList[0]) !== 'element'){
		// 	querySelector = '';
		// }
		// #Event003 存在子选择器 -> 包装回调函数, 回调函数的参数
		// 预绑定功能实现
		if(querySelector !== ''){
			var fn = callback;
			callback = function(e){
				// 验证子选择器所匹配的nodeList中是否包含当前事件源 或 事件源的父级
				// 注意: 这个方法为包装函数,此处的this为触发事件的Element
				var target = e.target;
				while(target !== this ){
					if([].indexOf.call( this.querySelectorAll(querySelector), target) !== -1){
						fn.apply(target, arguments);
						break;
					}
					target = target.parentNode;
				}
			};
		}
		var eventSplit = event.split(' ');
		var eventList = [],
			eventScopeSplit,
			eventObj;

		utilities.each(eventSplit, function(i, eventName) {
			if (eventName.trim() === '') {
				return true;
			}

			eventScopeSplit = eventName.split('.');
			eventObj = {
				eventName: eventName + querySelector,
				type: eventScopeSplit[0],
				querySelector: querySelector,
				callback: callback || utilities.noop,
				useCapture: useCapture || false,
				// TODO: nameScope暂时不用
				nameScope: eventScopeSplit[1] || undefined
			};
			eventList.push(eventObj);
		});
		return eventList;
	},

	// 增加事件,并将事件对象存储至DOM节点
	addEvent: function(eventList) {
		var _this = this;
		utilities.each(eventList, function (index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				v.jToolEvent = v.jToolEvent || {};
				v.jToolEvent[eventObj.eventName] = v.jToolEvent[eventObj.eventName] || [];
				v.jToolEvent[eventObj.eventName].push(eventObj);
				v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
			});
		});
		return _this;
	},

	// 删除事件,并将事件对象移除出DOM节点
	removeEvent: function(eventList) {
		var _this = this;
		var eventFnList; //事件执行函数队列
		utilities.each(eventList, function(index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				if (!v.jToolEvent) {
					return;
				}
				eventFnList = v.jToolEvent[eventObj.eventName];
				if (eventFnList) {
					utilities.each(eventFnList, function(i2, v2) {
						v.removeEventListener(v2.type, v2.callback);
					});
					v.jToolEvent[eventObj.eventName] = undefined;
				}
			});
		});
		return _this;
	}
};

// Object.assign(HTMLElement.prototype,_Event)
HTMLElement.prototype.on =  function(event, querySelector, callback, useCapture) {
	return _Event.addEvent(_Event.getEventObject(event, querySelector, callback, useCapture));
}