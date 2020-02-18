var game_collection = [];
var score_collection = [];
var game_counter = 1;
var possible_commands = ["channelhere","!recent", "!highlight", "!left", "!right", "!rot", "!l", "!r", "!rotc", "!rotcc", "!cc", "!c", "!hold", "!h"];
const Discord = require('discord.js');
const mongoose = require('mongoose');
const gameSchema = require("./Models/report.js");
const T = require("./tetris.js");
const S = require("./server_obj.js");
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN); // Replace XXXXX with your bot token
mongoose.connect(process.env.MONGODB_URI);

load_info();

function load_info(){
	
	gameSchema.find(function(err, game){
		
		if(err){
			return console.error(err);
		}
		console.log('game is' + game);
		
		for(var i = 0; i < game.length; i++){
			let new_game = new T(10,15,1);
			new_game.inert = string_to_board(game[i].game_board);
			new_game.sequence = game[i].game_seq;
			new_game.pieceType = game[i].cur_piece;
			new_game.nextpieceType = game[i].next_piece;
			new_game.hold_piece = game[i].hold_piece;
			new_game.pieceRot = game[i].piece_rot;
			new_game.pieceX = game[i].piece_x;
			new_game.pieceY = game[i].piece_y;
			new_game.holding = game[i].is_holding;
			new_game.score = game[i].score;
			new_game.time_length = game[i].interval_length;
			new_game.scoring = game[i].is_scoring;
			new_game.scoring_rows = game[i].scoring_rows_holder;
			new_game.last_moves = game[i].last_moves_holder;
						
			
			let new_serverobj = new S(
			game[i].name, 
			new_game,
			game[i].channel, 
			game[i].msg1, 
			game[i].msg2
			);
			
			new_serverobj.game_report = game[i];
			game_collection.push(new_serverobj);
			start_interval(new_serverobj);
		}			
		console.log('done!');

		
		
		
	});
}
function start_interval(o){
	
	o.game_interval = setTimeout(function(){update_loop(o);},o.game.time_length);
	
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

function update_loop(tg){
	//console.log(tg.name);
	//console.log('trying to access: ' + client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris'));
	//const channel1 = client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris info');
	const channel2 = client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris');
	//console.log(channel1);
	//tg.name.channels.find(ch => ch.name === 'general');
	//const channel2 = tg.name.channels.find(ch => ch.name === 'textris');

	score_change = tg.game.update();
	if (score_change < 0){

		//channel1.send('type !start to play again');
		//console.log('sent!');
		channel2.send('type !start to play again');
		
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
function save_info(tg){
	console.log('printing board info' + tg.game.board);
	console.log('printing more board info' + tg.game.inert);
	
	board_string='';
	
	for(i = 0; i < 15; i++){
		for (j = 0; j < 10; j++){
			//console.log(tg.game.board[i][j]);
			board_string += tg.game.inert[i][j];
		}
	}
	
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
				last_moves_holder: tg.game.last_moves
				
				
					
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
		
		tg.game_report.save()
		.then(result => console.log(result))
		.catch(err=> console.log(err));
	}
	console.log(tg.game.last_moves);
	
}
function send_board_message( tg) {
	console.log(tg);
	msg = "-----------------------------------------------------\n";
	msg_2 = '\n';
	for(i = 0; i < 15; i++){
		
		msg += ("[[" + '\t' + '\t');
		
		for (j = 0; j < 10; j++){
			msg += tg.game.board[i][j];
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
				msg_2 += ":black_circle:";
			} else{ 
				msg_2 +=next_char;
			}
		}
			
		msg_2 += ('\t' + "        ");
		
		
		for(l = 0; l < 4; l++){
			held_piece = tg.game.get_hold_piece();
			if(held_piece == ' '){
				msg_2 += ":black_circle:";
				continue;
			}
			
			next_char = colormap[pieceStructures[held_piece - 1][0][i][l]];
			
			if (next_char == ":egg:"){
				msg_2 += ":black_circle:";
			} else{ 
				msg_2 +=next_char;
			}
		}
		msg_2 += '\n';
				
	}
	var channel2 = client.guilds.get(tg.name).channels.find(ch=>ch.name === 'textris');
	
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
	
	msg_2 += ('\n' + "Score: " + tg.game.score + '\n' + "Level: " + level + '\n' + "Message: " + tg.game.infomsg + '\n');
	tg.game.infomsg = "";

	channel2.fetchMessage(tg.msg1Id)
    .then(m => {
        m.edit(msg);
    });
	
	channel2.fetchMessage(tg.msg2Id)
    .then(m2 => {
        m2.edit(msg_2);
    });

}

function find_game(currentValue, index, array){
	return currentValue.name === String(this);
}

client.on('ready', () => {
    console.log("Ready :D")
});

client.on('message', message => {
	console.log('yeet');
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
					
					tg.game.last_moves.forEach(function(element) {
						message.channel.send(element);
					});
				
				}
			}
		}
	   return;
	} else{
	 
	if (
		typeof game_collection.find(server => server.name === message.guild.id) ===
		'undefined'
		){
	  
	  if (message.content !== '!start'){
		  message.reply("currently no game found on server. type '!start' to start a game.");
	  } else{ //start game 
		new_game = new T(10,15,1);
		
		new_serverobj = new S(
			message.guild.id, 
			new_game,
			message.channel.id
		);
		
		game_collection.push(new_serverobj);
		
		var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
		//console.log(tg);
		
		message.channel.send("Starting").then(sent=>{
			tg.msg1Id = sent.id;
			//console.log(sent.id);
		});
		
		message.channel.send("Good Luck!").then(sent2=>{
			tg.msg2Id = sent2.id;
			//console.log(sent2.id);
			update_loop(tg);
		});
		
		
		//score_collection.push({name: message.guild, score: tg.game.score, id: game_counter});
		game_counter++;
		
		//tg.game_interval = setTimeout(function(){update_loop(tg,game_msg, game_details, message);},10000);
		//interval = setInterval (function () {update_loop(tg, game_msg, game_details, message);}, 10000); 
	  }
	} else{
		var tg = game_collection[game_collection.findIndex(find_game, message.guild.id)];
		console.log("last moves are: " + tg.game.last_moves);
		if (message.content === '!start'){
			message.reply("you already have a game running");
		}else if (message.content === '!leaderboard'){
			sorted_scores = score_collection.sort();
			sorted_scores.forEach(function(element) {
				const channel = message.guild.channels.find(ch => ch.name === 'textris info');
				channel.send(element.name + " " + element.score);
			});
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
			if (!tg.move){
				tg.move = true;
				tg.game.handleInput(message.content.substr(1));
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

