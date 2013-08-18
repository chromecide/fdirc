if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./mixins/chan'], function(chan){
	
	var mixin = {
		chan: chan
	}
	
	return mixin;
});

/*;!function(exports, undefined) {
	
	var roomChannel = require(__dirname+'/channels/room.js').Channel;
	
	var channels = {
		name: 'IRC',
		isChannelList: true,
		Chan: roomChannel
	};
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channels;
		});
	} else {
		exports.Channels = channels;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);*/