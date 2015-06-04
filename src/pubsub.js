/**
* author: bjl Studio, UESTC, China
*
* version: v0.1.0 
*/

function pubsub () {
	this.regList = {
		/*
		evtName: [
		{
			handler: function,
			live: num | -1
		}, ...]
		*/
	}
}

/**
* subscribe/regist an event
*
* on(evtName[, handler])
*
* @param evtName string
* @param handler function | null
*/
pubsub.prototype.on = function (evtName, handler) {
	var regList = this.regList;

	if (!evtName) {
		return;
	}
	if (!regList[evtName]) {
		regList[evtName] = [];
	}

	var tmp = {
		handler: null,
		live: -1
	};
	if (typeof handler === 'function') {
		tmp.handler = handler;
		regList[evtName].push(tmp);
	}

}

/**
* publish an event
*
* emit(evtName[, data1, data2, ...])
*
* @param evtName string
* @param data any
*/
pubsub.prototype.emit = function (evtName) {
	var regList = this.regList;
	var data = Array.prototype.slice.call(arguments, 1);

	if (!regList[evtName]) {
		return;
	}

	for (var i = 0; i < regList[evtName].length; i++) {
		regList[evtName][i].handler.apply(this, data);
		regList[evtName][i].live--;

		if (!regList[evtName][i].live) {
			regList[evtName].slice(i, 1);
		}
	}
}

/**
* listen on multiple events, and callback is called after all the events emitted
*
* all(evtName1, evtName2, ..., handler)
*
* @param evtName string
* @param handler function
*/


/**
* subscribe an event, and the handler will be removed after being triggered
*
* once(evtName, handler)
*
* @param evtName string
* @param handler function
*/




