/**
 * pubsub event module
 *
 * @author: bjl Studio, UESTC, China
 * @version: v0.2.0 
 */

function pubsub () {
	this.regList = {
	/*
	    evtName: [
		{
			handler: function,
			live: num | -1 // when live == 0, then handler will be removed
		}, ...]
	*/
	}
}

/**
 * subscribe/regist an event
 *
 * on(evtName[, handler, times])
 *
 * @param evtName string
 * @param handler function | null
 * @param times number
 */
pubsub.prototype.on = function (evtName, handler, times) {
	var regList = this.regList;
    var live = times && typeof times === 'number' ? times : -1;  

	if (!evtName) {
		return;
	}
	if (!regList[evtName]) {
		regList[evtName] = [];
	}

	var tmp = {
		handler: null,
		live: live
	};
	if (typeof handler === 'function') {
		tmp.handler = handler;
		regList[evtName].push(tmp);
	}

}

/**
 * publish an event
 * every hanlder will receive an event object as its first argument
 * event {
 *  name: // event name
 * }
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

    var ev = {};
    ev.name = evtName;
    data.unshift(ev);

	for (var i = 0; i < regList[evtName].length; i++) {
		if (regList[evtName][i].live !== 0) { 
            regList[evtName][i].handler.apply(this, data);
		    regList[evtName][i].live--;
        }

		if (regList[evtName][i].live === 0) {
			regList[evtName].splice(i, 1);
		}
	}
}

/**
 * listen on multiple events, and callback is called after all the events emitted
 *
 * all(evtName1[, evtName2, ...], handler)
 *
 * @param evtName string
 * @param handler function
 */
pubsub.prototype.all = function () {
    var evs = Array.prototype.slice.call(arguments, 0, -1);
    var handler = Array.prototype.slice.call(arguments, -1)[0];
    var counter = {};

    if (typeof handler !== "function") return;

    var injector = function (evt) {
        var canTrigger = true;

        if (typeof counter[evt.name] !== 'number') return;

        counter[evt.name]--;

        for (var evtName in counter) {
            if (counter[evtName] === 0) {
                canTrigger = false;
                break;
            }
        }

        if (canTrigger) {
            handler.apply(this, arguments);
        }
    }

    for (var i = 0; i < evs.length; i++) {
        counter[evs[i]] = 0;

        this.on(evs[i], injector, 1);
    }
}

/**
 * subscribe an event, and the handler will be removed after being triggered
 *
 * once(evtName, handler)
 *
 * @param evtName string
 * @param handler function
 */
pubsub.prototype.once = function (evtName, handler) {
    this.on(evtName, handler, 1);
}
