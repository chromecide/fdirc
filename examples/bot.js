var requirejs = require('../../FluxData/node_modules/requirejs');

process.fdpaths = {
	FluxData: __dirname+'/../../FluxData',
	//mixins: '../../FluxData/lib/mixins',
	fdirc: __dirname+'/../'
}

requirejs.config({
	basePath: __dirname+'/../',
	paths: process.fdpaths
});

requirejs(['../../FluxData/index'], function(FluxData){
	var ircbot = new FluxData.Channel({
		mixins:[
			{
				type:'fdirc/mixins/chan',
				irc:{
					nick: 'fluxbot',
					chan: '#flux_test',
					server: {
						name: 'irc.freenode.net',
						port: 6666
					}
				} 
			}
		]
	});
	
	ircbot.on('error', function(){
		console.log(arguments);	
	});
	
	ircbot.on('mixin.ready', function(){
		ircbot.publish('connect', {});
	});
	
	ircbot.on('chan.ready', function(data){
		ircbot.publish('say', {msg:'SUP BITCHES??!'});
	});
	
	var knownUsers = [];
	
	ircbot.on('message', function(data){
		var self = this;
		//name trigger check
		var nameMatch = new RegExp('!'+self.get('irc.nick')+'(.*)');
		if(nameMatch.test(data.get('message'))){
			var message = data.get('message').replace('!'+self.get('irc.nick')+' ', '');
			switch(message){
				case 'time':
					var now = new Date();
					ircbot.publish('say', {
						msg: now.toString()
					});
					break;
			}
		}
		
		//introduction check
		var introCheck = new RegExp(self.get('irc.nick')+' meet ([^,]*), ([^,]*) '+self.get('irc.nick'));
		if(introCheck.test(data.get('message'))){
			var match = introCheck.exec(data.get('message'));
			var introName = match[1];
			knownUsers.push(introName);
			self.publish('say', {msg: 'hey '+introName});
		}
	});
});
