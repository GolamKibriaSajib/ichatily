module.exports = function (io, chat) {
	// usernames which are currently connected to the chat
	var usernames = [];
	var roomCheck = ['#gksajib93', '#golam'];
	var rooms=['gksajib93','golam44','debian'];
	var check = {};
	var profilePc = {};
	var irc = require("irc");


	io.sockets.on('connection', function (socket) {
		var room1;
		var bot;
		var options;
		socket.emit("updatechannel",rooms);
		socket.on("every", function (username, password) {

			    options = {};
			  options = Object.assign(options, {
				sasl: true,
				userName: username,
				password: password,
				debug: true, showErrors: true

			});

			bot = new irc.Client("irc.freenode.net", options.userName, options);
            bot.addListener("pm",onSelf);
		    bot.addListener("selfMessage",onSelf);
            bot.addListener("join",onJoin);
			bot.addListener("message", OnMessage);
			bot.addListener("error", OnError);

			function OnError(message) {

            //  cookie.destroy(function(err){
			// 	 if(err){
			// 		 throw err;
			// 	 }
			// 	 	console.log("IRC Error:", message);
			// 		socket.emit("errormsg", "plz check username & password");
			// 		socket.emit("updatechannel",null,null,rooms)
						
			//  })


                socket.emit("updatechannel",null,null,rooms)
				console.log("IRC Error:", message);
				socket.emit("errormsg", "plz check username & password");
			}
          
		  function onSelf(to,text){
			  console.log("worked")
           socket.emit("pvtmessage",to,text);
		  }
		
          function onJoin(channel, nick, message){
			var data = {};
			var data1 = {};
			var room1;
			var obj;
			var i=0;
            
			bot.addListener('names',function(channel,nick){
       
		         for (var name in nick) {
			       i++;
         
			 obj = { username: name, room: channel }
            usernames.push(obj);

             }
		  })
			 if(i==0){
	
		    obj = { username: nick, room: channel }
			usernames.push(obj);
			 }


            // var obj = { username: nick, room: channel }
			// usernames.push(obj);

			usernames.forEach(function (elem) {
			if (elem.room == channel) {
				data[elem.username] = elem.username;

				}
				 else {
							data1[elem.username] = elem.username;
							room1 = elem.room;
					}
						
			})
					
                 usernames = usernames.reduce((unique, o) => {
                   if(!unique.some(obj => obj.username === o.username && obj.room === o.room)) {
                     unique.push(o);
                         }
                    return unique;
                    },[]);

                    socket.emit("updatechannel",rooms,channel)
					io.sockets.in(socket.room).emit('updateusers', data);
					io.sockets.in(room1).emit('updateusers', data1);

		  }

			function OnMessage(from, channel, text, message) {
				console.log(from, channel, text);
				if (socket.room == channel) {
					socket.emit("data", from, text);
				}
			}

		})

		socket.on('userchat', function (name, data) {

			console.log("fired");

			socket.emit('updatechat', name, data, socket.room);
		});

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (data) {
		//	bot.say(socket.room, data);
		bot.send("PRIVMSG", socket.room,data);
           socket.emit('updatechat', options.userName, data,socket.room)
			
		});

		     socket.on('switchRoom', function (username, channel) {

			// leave the current room (stored in session)
			var data = {};
			var data1 = {};
			var room1;

			    if (socket.room == null) {
				socket.username = username;
				socket.room = "#" + channel
				check[username] = username;
				socket.join(socket.room);
				bot.join(socket.room);
            //    socket.emit("updatechannel",rooms,channel)
			// 	var obj = { username: socket.username, room: socket.room }
			// 	usernames.push(obj);

			// 	usernames.forEach(function (elem) {
			// 		//	var data;
			// 		if (elem.room == socket.room) {
			// 			//  data={};
			// 			data[elem.username] = elem.username;


			// 		}
				
			// 	})


			// 	io.sockets.in(socket.room).emit('updateusers', data);


			}


			else{	


				       for (var i = 0; i < usernames.length; i++) {
				      	if (usernames[i].username == socket.username) {
						usernames.splice(i, 1);
					   }
			     	}
                //   usernames = usernames.reduce((unique, o) => {
                //    if(!unique.some(obj => obj.username === o.username)) {
                //      unique.push(o);
                //          }
                //     return unique;
                //     },[]);


			
				console.log(usernames)

			     //	bot.part(socket.room);
				//	bot.disconnect();
				socket.leave(socket.room, function () {			
					socket.room = '#' + channel;
					socket.join(socket.room);
					bot.join(socket.room);

					socket.emit("updatechannel",rooms,socket.room);
					var obj = { username: socket.username, room: socket.room }
					usernames.push(obj);

					usernames.forEach(function (elem) {
						
						if (elem.room == socket.room) {
						
							data[elem.username] = elem.username;
						}
						else {
							data1[elem.username] = elem.username;
							room1 = elem.room;
						}
					});
					
					io.sockets.in(socket.room).emit('updateusers', data);
					io.sockets.in(room1).emit('updateusers', data1);
					
				});
			}
		});

    //************************PRIVET MESSAGE***************************************88 */
	            socket.on("pvmsg",function(name,msg){
					   bot.say(name,msg);

	                    });

       socket.on('disconnect', function () {
		       var data={};
		      var data1={};
		       var room1;
                 if(socket.room){
		     	     bot.part(socket.room);
					  bot.disconnect();
				 
				 
					   
                     for (var i = 0; i < usernames.length; i++) {
				    	if (usernames[i].username == socket.username) {
						usernames.splice(i, 1);
				    	}
			    	}
			
				socket.leave(socket.room, function () {	
					socket.room=null;		
					usernames.forEach(function (elem) {
						
						if (elem.room == socket.room) {
						
							data[elem.username] = elem.username;
						}
						else {
							data1[elem.username] = elem.username;
							room1 = elem.room;
						}
					});
					
					io.sockets.in(socket.room).emit('updateusers', data);
					io.sockets.in(room1).emit('updateusers', data1);
		});
	 }
				 
				 else{
					 bot.disconnect();
				 }
	   
	});
	});
}