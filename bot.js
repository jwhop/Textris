var game_collection = [];
var score_collection = [];
var game_counter = 1;
var possible_commands = ["leaderboard","channelhere","!recent", "!highlight", "!left", "!right", "!rot", "!l", "!r", "!rotc", "!rotcc", "!cc", "!c", "!hold", "!h"];
const Discord = require('discord.js');
const mongoose = require('mongoose');
const gameSchema = require("./Models/report.js");
const scoreSchema = require("./Models/score.js");
									 
const T = require("./tetris.js");
const S = require("./server_obj.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.TOPGG_TOKEN, client);
const blapi = require('blapi');
const apiKeys = 
{
	"bots.ondiscord.xyz":process.env.BOTS_ONDISCORD_XYZ_TOKEN
};

client.login(process.env.BOT_TOKEN); // Replace XXXXX with your bot token
mongoose.connect(process.env.MONGODB_URI);
blapi.handle(client, apiKeys, 60);



function load_scores(){
	var score_collection = [];
	
	scoreSchema.find(function(err, score){
	console.log(score);
		if(err){
			return console.error(err);
		}
		score.forEach(function(element){
			console.log('pushing!');
			score_collection.push({name: element.name, score:element.score, isPlaying: element.isPlaying});	
		});
		
	});
	console.log('score collection is:' + score_collection);
	return score_collection;
}
function load_info(){
	
	gameSchema.find(function(err, game){
		
		if(err){
			return console.error(err);
		}
		//console.log('game is' + game);
		var new_game_arr  = [];
		
		game.forEach(function(element){
			let new_game = new T(10,15,1);
			new_game.inert = string_to_board(element.game_board);
			new_game.sequence = element.game_seq;
			new_game.pieceType = element.cur_piece;
			new_game.nextpieceType = element.next_piece;
			new_game.hold_piece = element.hold_piece;
			new_game.pieceRot = element.piece_rot;
			new_game.pieceX = element.piece_x;
			new_game.pieceY = element.piece_y;
			new_game.holding = element.is_holding;
			new_game.score = element.score;
			new_game.time_length = element.interval_length;
			new_game.scoring = element.is_scoring;
			new_game.scoring_rows = element.scoring_rows_holder;
			new_game.last_moves = element.last_moves_holder;
			new_game.hold_ids = element.held_ids;
			new_game.hold_names = element.held_names;
			new_game.alt_emojis['egg'] = element.alt_emojis_holder[0];
			new_game.alt_emojis['yellow_heart'] = element.alt_emojis_holder[1];
			new_game.alt_emojis['blue_heart'] = element.alt_emojis_holder[2];
			new_game.alt_emojis['green_heart'] = element.alt_emojis_holder[3];
			new_game.alt_emojis['heart'] = element.alt_emojis_holder[4];
			new_game.alt_emojis['snowflake'] = element.alt_emojis_holder[5];
			new_game.alt_emojis['tangerine'] = element.alt_emojis_holder[6];
			new_game.alt_emojis['purple_heart'] = element.alt_emojis_holder[7];
			new_game.alt_emojis['eyes'] = element.alt_emojis_holder[8];
			new_game.alt_emojis['boom'] = element.alt_emojis_holder[9];
			new_game.alt_emojis['black_circle'] = element.alt_emojis_holder[10];
			new_game.hold_threshold = element.hold_threshold_num;
			new_game.sleep_hour = element.sleep_hour_time;
			new_game.sleep_duration = element.sleep_duration_time;	
			new_game.publicScore = element.public_score_marker;
			
			let new_serverobj = new S(
				element.name, 
				new_game,
				element.channel, 
				element.msg1, 
				element.msg2
			);
			let server = client.guilds.get(element.name);
			
			if(server !== undefined){
				console.log(server.name);
				new_serverobj.servername = server.name;
			}
			
			new_serverobj.game_report = element;
			scoreSchema.find({_id:element.score_id}, function (err, score1){
				if(err){
				return console.error(err);
				}
				console.log(score1);
				if(score1.length > 0){
					console.log("found the score log!");
					new_serverobj.score_report = score1[0];
				}else{
					console.log("didnt find the score log:(");
					new_serverobj.score_report = null;
				}
			});
			
			console.log('SCORE_REPORT IS' + new_serverobj.score_report);
			game_collection.push(new_serverobj);
			//update_loop(new_serverobj);
			//update_loop(new_serverobj);
		});
	});
	
	setTimeout(function(){
			for(var i = 0; i < game_collection.length; i++){
			
				let t = game_collection[i];

				t.game.highlight = true;		 
				t.game.clear_board();
				t.game.draw();
				send_board_message(t);
				(function() {
					setTimeout(function(){
					t.game.highlight = false;
					t.game.clear_board();
					t.game.draw();
					send_board_message(t);
					update_loop(t);
					},1000);
				})();

   
			}
		}, 3000);
	console.log('done!');
	load_scores();
	
}
function start_interval(o){
	const oo = o;
	oo.game_interval = setTimeout(function(){update_loop(oo);},oo.game.time_length);

}
function print_test(x){
  
  setTimeout(function(){
    console.log(x);
  }, 15000);

}

function string_to_board(s){
	board = [ 
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
	];
	str_index = 0;
	for(i = 0; i < 15; i++){
		for (j = 0; j < 10; j++){
			//console.log('char is: ' + s.charAt(str_index));
			board[i][j] = s.charAt(str_index);
			str_index+=1;
		}
	}
	//console.log(board);
	return board;
}
function compare_scores(a,b){
	return a.score - b.score;
}

function update_loop(tg1){
	const tg = tg1;
	if(is_game_sleeping(tg.game.sleep_hour, tg.game.sleep_duration)){
		send_board_message(tg);
		
		save_info(tg);
  
		tg.game_interval = setTimeout(function(){update_loop(tg);},tg.game.time_length);
	}		
	else{
		console.log(tg.name);
		//console.log('trying to access: ' + client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris'));
		//const channel1 = client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris info');
		
		var server2 = client.guilds.get(tg.name)
		var channel2 = "";
		if(server2 !== undefined)
			var channel2 = server2.channels.find(ch=>ch.name === 'textris');
		//const channel2 = client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris');
		//console.log(channel1);
		//tg.name.channels.find(ch => ch.name === 'general');
		//const channel2 = tg.name.channels.find(ch => ch.name === 'textris');

		score_change = tg.game.update();
		if (score_change < 0){

			//channel1.send('type !start to play again');
			//console.log('sent!');
			if(channel2 != "" && channel2 != null){
			channel2.send('type !start to play again');
			}
			tg.score_report.isPlaying = false;
			tg.score_report.save()
			.then(result => console.log(result))
			.catch(err=> console.log(err));
			gameSchema.deleteOne({ _id: tg.game_report._id }, function (err) {
				if (err) return handleError(err);
				// deleted at most one tank document
			});
			
			game_collection.splice(game_collection.findIndex(find_game, tg.name), 1);
			return;
		} else {
			tg.game.score += score_change;
			tg.game.clear_board();
			tg.game.draw();
			if(tg.game.hold_ids.length > 0){
				
				//tg.game.infomsg = tg.game.hold_names[0] + " wants to hold! (1/2)";
			}
			else{
				if(tg.game.single){
					console.log("SINGLE");
					tg.game.infomsg = "SINGLE LINE CLEAR";
					//channel1.send("SINGLE LINE CLEAR: Nice job!");
				}
				if(tg.game.doub){
					tg.game.infomsg = "DOUBLE LINE CLEAR";
					//channel1.send("DOUBLE LINE CLEAR: Way to go!");
				}
				if(tg.game.triple){
					tg.game.infomsg = "TRIPLE LINE CLEAR";
					//channel1.send("TRIPLE LINE CLEAR: Awwww Yeah!");
				}
				if(tg.game.quadruple){
					tg.game.infomsg = "TETRIS";
					//channel1.send("BOOM: Tetris for Discord!");
				}
			}
			send_board_message(tg);
			
			
			
			if(score_change> 0){
				if(tg.game.score >= 20000){
					//console.log('3!');
					//channel1.send("Entering the final level. Interval speed now 5 minutes");
					tg.game.time_length = 1000*60*5;
				
				}
				else if(tg.game.score >= 10000 && tg.game.time_length == 600000){
					//console.log('2!');
					//channel1.send("Entering Level 3. Interval speed now 7 minutes");
					tg.game.time_length = 1000*60*7;
				}
				else if(tg.game.score >= 5000 && tg.game.time_length == 900000){
					//console.log('1!');
					//channel1.send("Entering Level 2. Interval speed now 10 minutes");
					tg.game.time_length = 1000*60*10;
				}
			}

			save_info(tg);
			tg.game_interval = setTimeout(function(){update_loop(tg);},tg.game.time_length);
			
		}
	}
}
function save_info(tg){
	//console.log('printing board info' + tg.game.board);
	//console.log('printing more board info' + tg.game.inert);
	let b = true;
	if((tg.score_report == undefined || tg.score_report == null)  && tg.game.publicScore==true){
		tg.score_report = new scoreSchema({
				_id: mongoose.Types.ObjectId(),
				name: "", 
				score: tg.game.score, 
				isPlaying: b
		});
		let server = client.guilds.get(tg.name);
			
			if(server !== undefined){
				console.log(server.name);
				tg.score_report.name = client.guilds.get(tg.name).name;
		}
		tg.score_report.save()
		.then(result => console.log(result))
		.catch(err=> console.log(err));
	}
	else if(tg.game.publicScore==true){
		tg.score_report.score = tg.game.score;
		tg.score_report.isPlaying = b;
		tg.score_report.save()
		.then(result => console.log(result))
		.catch(err=> console.log(err));
	}
	
	board_string='';
	
	for(i = 0; i < 15; i++){
		for (j = 0; j < 10; j++){
			//console.log(tg.game.board[i][j]);
			board_string += tg.game.inert[i][j];
		}
	}
	let temp_emoji_holder = [];
	temp_emoji_holder.push(tg.game.alt_emojis['egg']);
	temp_emoji_holder.push(tg.game.alt_emojis['yellow_heart']);
	temp_emoji_holder.push(tg.game.alt_emojis['blue_heart']);
	temp_emoji_holder.push(tg.game.alt_emojis['green_heart']);
	temp_emoji_holder.push(tg.game.alt_emojis['heart']);
	temp_emoji_holder.push(tg.game.alt_emojis['snowflake']);
	temp_emoji_holder.push(tg.game.alt_emojis['tangerine']);
	temp_emoji_holder.push(tg.game.alt_emojis['purple_heart']);
	temp_emoji_holder.push(tg.game.alt_emojis['eyes']);
	temp_emoji_holder.push(tg.game.alt_emojis['boom']);
	temp_emoji_holder.push(tg.game.alt_emojis['black_circle']);
	if(tg.game_report == null){
		tg.game_report = new gameSchema({
				_id: mongoose.Types.ObjectId(),
				name: tg.name, 
				game_board: board_string,
				game_seq: tg.game.sequence,
				cur_piece: tg.game.pieceType,
				next_piece: tg.game.nextpieceType,
				hold_piece: tg.game.hold_piece,
				piece_rot: tg.game.pieceRot,
				piece_x: tg.game.pieceX,
				piece_y: tg.game.pieceY,
				msg1: tg.msg1Id, 
				msg2: tg.msg2Id, 
				move: tg.move, 
				channel: tg.channel, 
				is_holding: tg.game.holding, 
				score: tg.game.score,
				interval_length : tg.game.time_length, 
				is_scoring: tg.game.scoring, 
				scoring_rows_holder: tg.game.scoring_rows,
				last_moves_holder: tg.game.last_moves,
				held_ids: tg.game.hold_ids, 
				held_names: tg.game.hold_names,
				alt_emojis_holder: temp_emoji_holder,
				hold_threshold_num: tg.hold_threshold,
				sleep_hour_time:tg.game.sleep_hour,
				sleep_duration_time:tg.game.sleep_duration,
				public_score_marker:tg.game.publicScore,
				server_name:tg.serverName, 
				score_id:tg.score_report._id
		});
		
		tg.game_report.save()
		.then(result => console.log(result))
		.catch(err=> console.log(err));
	} else {
		tg.game_report.game_board = board_string;
		tg.game_report.game_seq = tg.game.sequence;
		tg.game_report.cur_piece = tg.game.pieceType;
		tg.game_report.next_piece = tg.game.nextpieceType;
		tg.game_report.hold_piece = tg.game.hold_piece;
		tg.game_report.piece_rot = tg.game.pieceRot;
		tg.game_report.piece_x = tg.game.pieceX;
		tg.game_report.piece_y = tg.game.pieceY;
		tg.game_report.is_holding = tg.game.holding;
		tg.game_report.score = tg.game.score;
		tg.game_report.interval_length = tg.game.time_length;
		tg.game_report.is_scoring = tg.game.scoring;
		tg.game_report.scoring_rows_holder = tg.game.scoring_rows;
		tg.game_report.last_moves_holder = tg.game.last_moves;
		tg.game_report.held_ids = tg.game.hold_ids;
		tg.game_report.held_names = tg.game.hold_names;
		tg.game_report.alt_emojis_holder = temp_emoji_holder;
		tg.game_report.hold_threshold_num = tg.game.hold_threshold;
		tg.game_report.sleep_hour_time = tg.game.sleep_hour;
		tg.game_report.sleep_duration_time = tg.game.sleep_duration;
		tg.game_report.public_score_marker = tg.game.publicScore;
		tg.game_report.score_id = tg.score_report._id;
		
		let server = client.guilds.get(tg.name);
			
			if(server !== undefined){
				console.log(server.name);
				tg.game_report.server_name = client.guilds.get(tg.name).name;
			}
		
		tg.game_report.save()
		.then(result => console.log(result))
		.catch(err=> console.log(err));
	}
	
}
function send_board_message(tg) {

	msg = "-----------------------------------------------------\n";
	msg_2 = '\n';
	for(i = 0; i < 15; i++){
		
		msg += ("[[" + '\t' + '\t');
		
		for (j = 0; j < 10; j++){
			let e = tg.game.board[i][j];
			if(tg.game.alt_emojis[e.substr(1, e.length - 2)]  != undefined){
				if(is_game_sleeping(tg.game.sleep_hour, tg.game.sleep_duration) && e == ":egg:"){
					msg += ':zzz:';
				}
				else{
					msg += ':' + tg.game.alt_emojis[e.substr(1, e.length - 2)] + ':' ;
				}
				
			}
			else{
				msg += e;
			}

		}
		
		msg += ('\t' + '\t' + "]]" + '\n');
	}
			
	msg += '\n';
	msg += "-----------------------------------------------------";
	msg_2 += "next piece";
	msg_2 += "              ";
	msg_2 += ('\t' + "hold piece\n");
	for(i = 0; i < 4; i++){
		for(j = 0; j < 4; j++){
			
			next_char = colormap[pieceStructures[tg.game.getnextPiece()][0][i][j]];
			
			if (next_char == ":egg:"){
				msg_2 += ':' + tg.game.alt_emojis['black_circle'] + ':';
			} else{ 
				msg_2 += ':'+ tg.game.alt_emojis[next_char.substr(1, next_char.length -2)] + ':';
			}
		}
			
		msg_2 += ('\t' + "        ");
		
		
		for(l = 0; l < 4; l++){
			held_piece = tg.game.get_hold_piece();
			if(held_piece == ' '){
				msg_2 += ':' + tg.game.alt_emojis['black_circle'] + ':';
				continue;
			}
			
			next_char = colormap[pieceStructures[held_piece - 1][0][i][l]];
			
			if (next_char == ":egg:"){
				msg_2 += ':' + tg.game.alt_emojis['black_circle'] + ':';
			} else{ 
				msg_2 += ':'+ tg.game.alt_emojis[next_char.substr(1, next_char.length -2)] + ':';
			}
		}
		msg_2 += '\n';
				
	}
	var server2 = client.guilds.get(tg.name)
	var channel2 = "";
	if(server2 != undefined)
		var channel2 = server2.channels.find(ch=>ch.name === 'textris');
	
	let level = "1 (15 minutes)";
	
	if(tg.game.score >= 20000){
		level = "4 (5 minutes)";
	}
	else if(tg.game.score >= 10000){
		level = "3 (7 minutes)";
	}
	else if(tg.game.score >= 5000){
		level = "2 (10 minutes)";
	}
	if(!tg.game.infomsg.includes("Textris is asleep until") && is_game_sleeping(tg.game.sleep_hour, tg.game.sleep_duration)){
			if(tg.game.infomsg.length != 0){
				tg.game.infomsg += ', ';
			}
			tg.game.infomsg += "Textris is asleep until " + ((parseInt(tg.game.sleep_hour, 10) + parseInt(tg.game.sleep_duration, 10)) % 24) + ":00 UTC";
	}
	msg_2 += ('\n' + "Score: " + tg.game.score + '\n' + "Level: " + level + '\n' + "Message: " + tg.game.infomsg + '\n');
	if(tg.game.sleep_duration > 0){
		msg_2 += ('Sleep Interval: ' + String(tg.game.sleep_hour) + ':00-' + String( (parseInt(tg.game.sleep_hour) + parseInt(tg.game.sleep_duration)) % 24) + ':00 UTC'); 
	}
	else{
		msg_2 += ('Sleep Interval: no interval set');
	}
	try{
		if(msg.length <=2000){
			if(channel2 != null){
				channel2.fetchMessage(tg.msg1Id)
				.then(m => {
					m.edit(msg);
				}).catch(function(e) {
					console.log(e);
				});
			}
		}
	
		else{
			if(channel2 != null){
			channel2.fetchMessage(tg.msg1Id)
			.then(m => {
				m.edit("YOUR BOARD IS OVER THE CHARACTER LIMIT. PLEASE REPLACE EMOJIS TO DISPLAY BOARD");
			}).catch(function(e) {
				console.log(e);
			});
			}
		}
	}
	catch(error){
		console.log(error);
		console.log("caught error!!!")
																							
	 
	}
	
	try{
		if(channel2 != null){
		channel2.fetchMessage(tg.msg2Id)
		.then(m2 => {
			m2.edit(msg_2);
		}).catch(function(e) {
				console.log(e);
		});
		}
	}
	catch(error){
		console.log(error);
	}
	console.log("SENDING THIS MESSAGE");
	console.log(msg);
}

function find_game(currentValue, index, array){
	return currentValue.name === String(this);
}
function is_game_sleeping(start_hr, duration){
	let d = new Date();
	if(((start_hr <= d.getUTCHours() && ((parseInt(start_hr, 10) + parseInt(duration, 10)) % 24) < d.getUTCHours() && (parseInt(start_hr, 10) + parseInt(duration, 10)) > 24) || 
		(start_hr >= d.getUTCHours() && ((parseInt(start_hr, 10) + parseInt(duration, 10)) % 24) > d.getUTCHours() && (parseInt(start_hr, 10) + parseInt(duration, 10)) > 24) ||
		(start_hr <= d.getUTCHours() && ((parseInt(start_hr, 10) + parseInt(duration, 10)) % 24) > d.getUTCHours() && (parseInt(start_hr, 10) + parseInt(duration, 10)) < 24) || 
		(start_hr >= d.getUTCHours() && ((parseInt(start_hr, 10) + parseInt(duration, 10)) % 24) < d.getUTCHours() && (parseInt(start_hr, 10) + parseInt(duration, 10)) < 24) &&
		tg.game.sleep_duration > 0
	)){
		return true;
	}
	return false;
}							 

client.on('ready', () => {
    console.log("Ready :D");
	client.user.setPresence({ status: 'online', game: { name: 'under maintenance!' } })
	.then(console.log)
	.catch(console.error); 
	load_info();
});

client.on('message', message => {
	console.log('received message');
  if(
	!message.author.bot &&
	message.channel.name === 'textris' &&
	!message.content.startsWith('!')
	){
		message.delete(100);
	}
  
  if(
	message.author.bot || 
	message.channel.name !== "textris" || 
	!message.content.startsWith('!')
	){
		if (message.content === '!recent'){
			
			if(message.channel.name != 'textris'){
				var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
				if(typeof tg !== 'undefined'){
					let recent_msg = "";
					tg.game.last_moves.forEach(function(element) {
						recent_msg+=element + '\n';
						
					});
					message.channel.send(recent_msg);
				}
			}
		}
		else if (message.content === '!optoutscore'){
			var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
				if(typeof tg !== 'undefined'){
					scoreSchema.deleteOne({ _id: tg.score_report._id }, function (err) {
					if (err) return handleError(err);
						
					});
					tg.game.publicScore = false;
				}
		}else if (message.content === '!optinscore'){
			var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
				if(typeof tg !== 'undefined'){
					tg.game.publicScore = true;
				}
		}
		else if (message.content === '!leaderboard'){
			console.log("aaa");
			let sorted_scores = load_scores();
			//sorted_scores = sorted_scores.sort((a, b) => (a.score > b.score) ? 1 : -1);
			//console.log(sorted_scores);
			//sorted_scores.splice(0,25);
			let scoremsg = '```HIGH SCORES \nall games marked with \'*\' are still active\n\n';
			setTimeout(function(){
				sorted_scores = sorted_scores.sort((a, b) => (a.score > b.score) ? 1 : -1);
				sorted_scores.forEach(function(element) {
					string_score = "";
					
					for(i = 7; i > String(element.score).length; i++){
						string_score += '0';
					}
					string_score +=String(element.score);
					scoremsg += (string_score + '\t' + '|' + '\t'+ element.name);
					if(element.isPlaying){
						scoremsg += '*';
					}
					scoremsg += '\n';
				
				});
				scoremsg += '```';
				message.channel.send(scoremsg);
			},1000*10);
			
		}else if(message.content.toLowerCase() === '!TextrisInfo'.toLowerCase()){
			message.channel.send("```Welcome to TEXTRIS\n\
===============\n\
\n\
Objective: don't let the pieces overflow the top of the board\n\
\n\
Commands:\n\
\n\
Commands with ** are to be used outside of the textris channel \n\
\n\
- !start | start game [MUST BE IN \"textris CHANNEL\"]\n\
- !left, !l | move piece left\n\
- !right, !r | move piece right\n\
- !rotc, !c, !rot | rotate piece clockwise\n\
- !rotcc, !cc | rotate piece counterclockwise\n\
- !hold, !h | hold current piece\n\
- **!textrisinfo | display rules\n\
- **!highlight  | briefly change display of current piece\n\
- **!recent | display 10 most recent commands / users\n\
- **!leaderboard | display high scoreSchema\n\
- **!optoutscore / !optinscore | opt out of leaderboard (opted in by default) \n\
\n\
commands for users with the \"textris mod\" role: \n\
- **!threshold x | change the number of users necessary for holding a piece (default 2, replace x with an integer)\n\
- **!replace x y | change a game emoji. \n\
\t-options for x are [i, o, s, z, l, j, t, blank, clear(displayed when lines are cleared), highlight, and preview]\n\
\t-options for y are any (non-custom) emoji, WITHOUT the colons surrounding it. Ex. \"!replace blank hotdog\", \"!replace i taco\" \n\
\t-WARNING: emojis with many letters may exceed max character limit. Proceed with caution!\n\
- **!sleep x y | enable the game to be paused for up to 5 hours per day.\n\
\t-options for x are 0-23. Time zone is UTC. \n\
\t-options for y are 0-5. This is the amount of hours your game will be paused for. set to 0 by default.\n\
\n\
\n\
for information about piece rotation and point scoring, see our wiki: https://github.com/jwhop/Textris/wiki \n\
\n\
contact: for bug reports, concerns, or questions, contact jwhopkins.dev@gmail.com or dm @jwhopkin on twitter. Join our textris server: jwhop.itch.io/textris \n\
\n\
Thanks for playing!```");
		}
		else if(message.member != null && message.member.roles.find(r => r.name === "textris mod")){
			let words = message.content.split(" ");
			if (words[0] == '!replace'){

				var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
				if(typeof tg !== 'undefined'){
					words[1] = words[1].toLowerCase();
					console.log('first word is' + words[1]);
					if(words.length == 3){

						switch(words[1]){
							case 'blank':
								tg.game.alt_emojis['egg'] = words[2];
								break;
							case 'o':
								tg.game.alt_emojis['yellow_heart'] = words[2];
								break;
							case 'i': 
								tg.game.alt_emojis['blue_heart'] = words[2];
								break;
							case 's':
								tg.game.alt_emojis['green_heart'] = words[2];
								break;
							case 'z':
								tg.game.alt_emojis['heart'] = words[2];
								break;
							case 'j':
								tg.game.alt_emojis['snowflake'] = words[2];
								break;
							case 'l': 
								tg.game.alt_emojis['tangerine'] = words[2];
								break;
							case 't':
								tg.game.alt_emojis['purple_heart'] = words[2];
								break;
							case 'highlight':
								tg.game.alt_emojis['eyes'] = words[2];
								break;
							case 'clear':
								tg.game.alt_emojis['boom'] = words[2];
								break;
                                                        case 'preview':
								tg.game.alt_emojis['black_circle'] = words[2];
								break;
						}
						
					

						console.log('replaced word is');
						console.log(tg.game.alt_emojis['egg']);
						tg.game.clear_board();
						tg.game.draw();
						send_board_message(tg);
												   
					}
				}
			}
			else if(words[0] == '!threshold'){
				var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
				if(typeof tg !== 'undefined'){
					if(words[1] !== undefined){
						tg.game.hold_threshold = parseInt(words[1], 10); 
					}
				}
			}
			else if (words[0] == '!sleep'){
				var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
				
				if(typeof tg !== 'undefined'){
					if(words.length == 3){
						if(parseInt(words[1], 10) <= 23 && parseInt(words[1], 10) >= 0 && parseInt(words[2], 10) <= 6 && parseInt(words[2], 10) >= 0){
							tg.game.sleep_hour = words[1];
							tg.game.sleep_duration = words[2];
							send_board_message(tg);
						}
					}
				}
				
			}
	   
		}

		return;
	}
	else{
	 
	if (
		typeof game_collection.find(server => server.name === message.guild.id) ===
		'undefined'
		){
	  
	  if (message.content !== '!start'){
		  message.reply("currently no game found on server. type '!start' to start a game.")
				.then(sent => sent.delete(10000))
				.catch(console.error);		  
	  } else{ //start game 
		new_game = new T(10,15,1);
		
		new_serverobj = new S(
			message.guild.id, 
			new_game,
			message.channel.id
		);
		
		game_collection.push(new_serverobj);
		
		var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
		tg.servername = message.guild.name;
		message.channel.send("Starting").then(sent=>{
			tg.msg1Id = sent.id;
			//console.log(sent.id);
		}).catch(function(error){
			console.log(error);
		});
		
		message.channel.send("Good Luck!").then(sent2=>{
			tg.msg2Id = sent2.id;
			//console.log(sent2.id);
			update_loop(tg);
		}).catch(function(error){
			console.log(error);
		});
		
		
		//score_collection.push({name: message.guild, score: tg.game.score, id: game_counter});
		//game_counter++;
		
		//tg.game_interval = setTimeout(function(){update_loop(tg,game_msg, game_details, message);},10000);
		//interval = setInterval (function () {update_loop(tg, game_msg, game_details, message);}, 10000); 
	  }
	} else{
		var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
		//console.log("last moves are: " + tg.game.last_moves);
		if (message.content === '!start'){
			message.reply("You already have a game running.")
				.then(sent => sent.delete(10000))
				.catch(console.error);																   
		}else if (message.content === '!highlight'){
			tg.game.highlight = true;
			tg.game.clear_board();
			tg.game.draw();
			send_board_message(tg);
			setTimeout(function(){
				tg.game.highlight = false;
				tg.game.clear_board();
				tg.game.draw();
				send_board_message(tg);
				},1000*10);

		}else if (possible_commands.indexOf(message.content) > -1){
			if(!is_game_sleeping(tg.game.sleep_hour, tg.game.sleep_duration)){
				if (!tg.move){
					tg.move = true;
					tg.game.handleInput(message.content.substr(1), message.author.id, message.author.username);
					tg.game.last_moves.push(String(message.author.username) + " typed in " + String(message.content) + " for the " + String(piece_colormap[tg.game.pieceType]) + " piece");
					if(tg.game.last_moves.length > 10){
						tg.game.last_moves.shift();
					}
					tg.game.clear_board();
					tg.game.draw();
					send_board_message(tg);
					tg.move = false;
				}
			}
			else{
				
				if(!tg.game.infomsg.includes("Textris is asleep until")){
					if(tg.game.infomsg.length != 0){
						tg.game.infomsg += ', ';
					}
					tg.game.infomsg += "Textris is asleep until " + ((parseInt(tg.game.sleep_hour, 10) + parseInt(tg.game.sleep_duration, 10)) % 24) + ":00 UTC :sleeping:";
				}
				message.reply("Textris is asleep until " + ((parseInt(tg.game.sleep_hour, 10) + parseInt(tg.game.sleep_duration, 10)) % 24) + ":00 UTC")
				.then(sent => sent.delete(10000))
				.catch(console.error);		  
				send_board_message(tg);
			}
			
		}
	}
	
	message.delete(100);
  }
});


let colors = {
  lime: "#00FF7F",
  pink: "#f893c4",
  magenta: "#d388ec",
  orange: "##FFA500",
  teal: "#7cdac1",
  yellow: "#ece76c",
  blue: "#78c3ef",
  gray: "#efefef",
  beige: "#fffb99",
  indigo: "#99bbff",
}

let colormap = {
  i: ":blue_heart:",
  o: ":yellow_heart:",
  j: ":snowflake:",
  l: ":tangerine:",
  t: ":purple_heart:",
  s: ":green_heart:",
  z: ":heart:",
  b: ":egg:", 
  x: ":eyes:",
  w: ":boom:"
}
let piece_colormap = [
	":blue_heart:", 
	":yellow_heart:", 
	":snowflake:", 
	":tangerine:", 
	":purple_heart:",
	":green_heart:", 
	":heart:", 
	":egg:", 
	":eyes:", 
	":boom:"
	
]
let colormap_reverse = {
  ":blue_heart:": 'i',
  ":snowflake:": 'j',
  ":tangerine:": 'l',
  ":yellow_heart:": 'o',
  ":green_heart:": 's',
  ":purple_heart:": 't',
  ":heart:": 'z',
  ":egg:": ' '
  
}

colormap[' '] = ":egg:"

let pieceStructures = [
  [
    [
      [' ', ' ', ' ', ' '],
      ['i', 'i', 'i', 'i'],
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 'i', ' ', ' '],
      [' ', 'i', ' ', ' '],
      [' ', 'i', ' ', ' '],
      [' ', 'i', ' ', ' '],
    ],
  ],
  [
    [
      [' ', ' ', ' ', ' '],
      [' ', 'o', 'o', ' '],
      [' ', 'o', 'o', ' '],
      [' ', ' ', ' ', ' '],
    ],
  ],
  [
    [
      [' ', ' ', ' ', ' '],
      ['j', 'j', 'j', ' '],
      [' ', ' ', 'j', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 'j', 'j', ' '],
      [' ', 'j', ' ', ' '],
      [' ', 'j', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      ['j', ' ', ' ', ' '],
      ['j', 'j', 'j', ' '],
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 'j', ' ', ' '],
      [' ', 'j', ' ', ' '],
      ['j', 'j', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
  ],
  [
    [
      [' ', ' ', ' ', ' '],
      ['l', 'l', 'l', ' '],
      ['l', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 'l', ' ', ' '],
      [' ', 'l', ' ', ' '],
      [' ', 'l', 'l', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', ' ', 'l', ' '],
      ['l', 'l', 'l', ' '],
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      ['l', 'l', ' ', ' '],
      [' ', 'l', ' ', ' '],
      [' ', 'l', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
  ],
  [
    [
      [' ', ' ', ' ', ' '],
      ['t', 't', 't', ' '],
      [' ', 't', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 't', ' ', ' '],
      [' ', 't', 't', ' '],
      [' ', 't', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 't', ' ', ' '],
      ['t', 't', 't', ' '],
      [' ', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 't', ' ', ' '],
      ['t', 't', ' ', ' '],
      [' ', 't', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
  ],
  [
    [
      [' ', ' ', ' ', ' '],
      [' ', 's', 's', ' '],
      ['s', 's', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      ['s', ' ', ' ', ' '],
      ['s', 's', ' ', ' '],
      [' ', 's', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
  ],
  [
    [
      [' ', ' ', ' ', ' '],
      ['z', 'z', ' ', ' '],
      [' ', 'z', 'z', ' '],
      [' ', ' ', ' ', ' '],
    ],
    [
      [' ', 'z', ' ', ' '],
      ['z', 'z', ' ', ' '],
      ['z', ' ', ' ', ' '],
      [' ', ' ', ' ', ' '],
    ],
  ],
]
