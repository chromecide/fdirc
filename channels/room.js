;!function(exports, undefined) {
	
	var channel = {
		name: 'IRC.Chan',
		meshGlobal: true,
		params:{
			serverName: {
				name: 'serverName',
				label: 'Server Name',
				type: 'Text'
			},
			serverPort: {
				name: 'serverPort',
				label: 'Server Port',
				type: 'Number'
			},
			nick: {
				name: 'nick',
				label: 'Nick',
				type: 'Text'
			},
			chanName: {
				name: 'chanName',
				label: 'Chan Name',
				type: 'Text'
			}
		},
		inputs: [
			{
				name: 'say',
				label: 'Say'
			},
			{
				name:'sayto',
				label: 'Say To'
			}
		],
		outputs: [
			{
				name: 'message',
				label: 'Message'
			},
			{
				name: 'pm',
				label: 'Private Message'
			},
			{
				name: 'join',
				label: 'User Joined'
			}
		],
		publish: function(topic, entity){
			if(topic=='entity'){
				var serverName = entity.get('serverName');
				if(!serverName){
					serverName = this.get('serverName');
				}
				var serverPort = entity.get(serverPort);
				if(!serverPort){
					serverPort = this.get('serverPort');
				}
				var nick = entity.get('nick');
				if(!nick){
					nick = this.get('nick');
				}
				var chan = entity.get('chanName');
				if(!chan){
					chan = this.get('chanName');
				}
				
				var self = this;
				var irc = require('irc');
				
				console.log(serverName, nick);
				this.irc_client = new irc.Client(serverName, nick, {
				    channels: [chan],
				    autoConnect:false
				});
				
				this.irc_client.addListener('registered', function(){
					console.log('CONNECTED');
				})
				
				this.irc_client.addListener('message', function (from, to, message) {
				    self.emit('message', {
				    	from: from,
				    	to: to,
				    	message: message
				    });
				});
				
				this.irc_client.addListener('pm', function (from, message) {
				    self.emit('pm', {
				    	from: from,
				    	message: message
				    });
				});

				this.irc_client.addListener('join', function (chanName, user, raw) {
					console.log(arguments);
				    self.emit('join', {
				    	chan: chanName,
				    	nick: user
				    });
				});

				self.emit('ready', self);
			}
			
			if(topic=='say'){
				this.irc_client.say('#FluxData', 'Hello World');
			}
			
			if(topic=='sayto'){
				var to = entity.get('to');
				var msg = entity.get('message');
				
				this.irc_client.say(to, msg);
			}
		}
	}
	
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return channel;
		});
	} else {
		exports.Channel = channel;
	}

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);