
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['require'], function(require, irc){
	var mixin = {
		//called when first mixing in the functionality
		init: function(cfg){
			var self = this;
			
			for(var key in cfg){
				self.set(key, cfg[key]);
			}
			
			var serverName = self.get('irc.server.name');
			var serverPort = self.get('irc.server.port');
			var nick = self.get('irc.nick');
			var chan = self.get('irc.chan');
			
			self.irc_client = new irc.Client(serverName, nick, {
			    channels: [chan],
			    autoConnect: false
			});
			
			self.irc_client.addListener('error', function(message){
				console.log('IRC ERROR');
				console.log(message);
			})
			
			self.irc_client.addListener('registered', function(){
				console.log('CONNECTED');
			})
			
			self.irc_client.addListener('message', function (from, to, message) {
			    self.emit('message', {
			    	from: from,
			    	to: to,
			    	message: message
			    });
			});
			
			self.irc_client.addListener('pm', function (from, message) {
			    self.emit('pm', {
			    	from: from,
			    	message: message
			    });
			});

			self.irc_client.addListener('join', function (chanName, user, raw) {
				
				if(user==self.get('irc.nick')){
					self.emit('chan.ready', {
				    	chan: chanName,
				    	nick: user
				    });	
				}else{
					self.emit('join', {
				    	chan: chanName,
				    	nick: user
				    });
				}
			});
			
			self.emit('mixin.ready', self);
		},
		//called when something is published to this channel
		publish: function(topic, data){
			var self = this;
			switch(topic){
				case 'connect':
					self.irc_client.connect();
					break;
				case 'disconnect':
					self.irc_client.disconnect();
					break;
				case 'say':
					self.irc_client.say(self.get('irc.chan'), data.msg);
					break;
				case 'sayto':
					var to = data.to;
					var msg = data.msg;
					
					this.irc_client.say(to, msg);
					break;
			}
		}
	}
	
	return mixin;	
});