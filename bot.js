var game_collection = [];
var score_collection = [];
game_counter = 1;
var possible_commands = ["!left", "!right", "!rot", "!l", "!r", "!rotc", "!rotcc", "!cc", "!c", "!hold", "!h"];
const Discord = require('discord.js');
const client = new Discord.Client();
function compare_scores(a,b)
{
	return a.score - b.score;
}
function update_loop( tg,  game_board_msg,  game_details_msg, msg)
{
	const channel1 = tg.name.channels.find(ch => ch.name === 'general');
	const channel2 = tg.name.channels.find(ch => ch.name === 'textris');
	
	score_change = tg.game.update();
	if (score_change < 0)
	{
		tg.run = false;
		//break;
		
		channel1.send('type !start to play again');
		console.log('sent!');
		channel2.send('type !start to play again');
		game_collection.splice(game_collection.findIndex(find_game, tg.name), 1);
		return;
	}
	else
	{
		tg.game.score += score_change;
		tg.game.clear_board();
		tg.game.draw();
		send_board_message(tg, game_board_msg, game_details_msg);
		if(tg.game.single)
		{
			channel1.send("SINGLE LINE CLEAR: Nice job!");
		}
		if(tg.game.doub)
		{
			channel1.send("DOUBLE LINE CLEAR: Way to go!");
		}
		if(tg.game.triple)
		{
			channel1.send("TRIPLE LINE CLEAR: Awwww Yeah!");
		}
		if(tg.game.quadruple)
		{
			channel1.send("BOOM: Tetris for Discord!");
		}
		tg.game_interval = setTimeout(function(){update_loop(tg,game_board_msg, game_details_msg, msg);},10000);
	}
	
}

function send_board_message( tg,  game_board_msg,  game_details_msg)
{
	msg = "-------------------------------------------------------------------\n";
	msg_2 = '\n';
	for(i = 0; i < 15; i++)
	{
		msg += ("[[" + '\t' + '\t');
		for (j = 0; j < 10; j++)
		{
			msg += tg.game.board[i][j];
		}
		msg += ('\t' + '\t' + "]]" + '\n');
	}
			
	msg += '\n';
	msg += "-------------------------------------------------------------------";
	msg_2 += "next piece:";
	for(i = 0; i < 4; i++)
	{
		if(i!=0)
			msg_2 += "                    ";
		for(j = 0; j < 4; j++)
		{
			
			next_char = colormap[pieceStructures[tg.game.getnextPiece()][0][i][j]];
			
			if (next_char == ":egg:")
				msg_2 += ":black_circle:"
			else 
				msg_2 +=next_char; 
		}
		if(i == 0)
			msg_2 += ('\t' + "hold piece:");
		else
			msg_2 += ('\t' + "                   ");
		for(l = 0; l < 4; l++)
		{
			held_piece = tg.game.get_hold_piece();
			console.log(held_piece);
			if(held_piece == ' ')
			{
				msg_2 += ":black_circle:";
				continue;
			}
			
			next_char = colormap[pieceStructures[held_piece - 1][0][i][l]];
			
			if (next_char == ":egg:")
				msg_2 += ":black_circle:"
			else 
				msg_2 +=next_char; 
		}
		msg_2 += '\n'
				
	}
			
	msg_2 += ('\n' + "Score:" + tg.game.score);
	//msg += ('\n' + pieceStructures[tg.game.getnextPiece()][0]);
	game_board_msg.then((new_message) => {new_message.edit(msg);});
	game_details_msg.then((new_message) =>{new_message.edit(msg_2);});
			
}

function find_game(currentValue, index, array)
{
	return currentValue.name === this;
}

client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Ready :D")
});

client.on('message', message => {
  
  if(message.author.bot || (message.channel.name !== "textris") || !message.content.startsWith('!'))
	{
	   return;
	}
  else
  {
	 
	if (typeof game_collection.find(server => server.name === message.guild) === 'undefined')
	{
	  if (message.content !== '!start')
	  {
		  message.reply("currently no game found on server. type '!start' to start a game.");
	  }
	  else //start game
	  {
		new_game = new TetrisGame(10,15,1);
		var game_msg = message.channel.send("Starting");
		var game_details = message.channel.send("Good Luck!");
		var interval;
		game_collection.push({name: message.guild, game: new_game, msg1: game_msg, msg2: game_details, move: false, run: true, channel: message.channel.id, game_interval: interval, is_holding: false});
		
		var tg = game_collection[game_collection.findIndex(find_game, message.guild)];
		score_collection.push({name: message.guild, score: tg.game.score, id: game_counter});
		game_counter++;
		tg.game_interval = setTimeout(function(){update_loop(tg,game_msg, game_details, message);},10000);
		//interval = setInterval (function () {update_loop(tg, game_msg, game_details, message);}, 10000); 
	  }
	}
	
	else
	{
		var tg = game_collection[game_collection.findIndex(find_game, message.guild)];
		var sending_msg = game_collection[game_collection.findIndex(find_game, message.guild)].msg1;
		var sending_msg_2 = game_collection[game_collection.findIndex(find_game, message.guild)].msg2;
		
		if (message.content === '!start')
		{
			message.reply("you already have a game running");
		}
		else if (message.content === '!leaderboard')
		{
			sorted_scores = score_collection.sort();
			sorted_scores.forEach(function(element) {
				const channel = message.guild.channels.find(ch => ch.name === 'general');
				channel.send(element.name + " " + element.score);
			});
		}
		else if (possible_commands.indexOf(message.content) > -1)
		{
			if (!tg.move)
			{
				tg.move = true;
				tg.game.handleInput(message.content.substr(1));
				tg.game.clear_board();
				tg.game.draw();
				send_board_message(tg, sending_msg, sending_msg_2);
				tg.move = false;
			}
		}
	}
	
	message.delete(500);
  }
});

client.login('NTc4ODMxMTQ2NzU4OTYzMjIw.XaJk1g.Ply6jqo1A236APsAHU9wJ4ku1zY'); // Replace XXXXX with your bot token

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
  j: ":snowflake:",
  l: ":tangerine:",
  o: ":yellow_heart:",
  s: ":green_heart:",
  t: ":purple_heart:",
  z: ":heart:",
  b: ":egg:"
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

TetrisGame.prototype.getnextPiece = function(){
	return this.nextpieceType;
}

TetrisGame.prototype.get_hold_piece = function(){
	return this.hold_piece;
}

TetrisGame.prototype.clear_board = function(){
	this.board = [ 
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
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0]
];
}
function TetrisGame(gW, gH, tS)
{
  this.gridWdt = gW;  
  this.gridHgt = gH;
  this.tileSz = tS;
  this.board = [];
  this.inert = [];
  this.score = 0;
  this.single = false;
  this.doub = false;
  this.triple = false
  this.quadruple = false;
  this.holding = false;
  for(var y=0; y<this.gridHgt; y++)
  {
    this.inert[y] = [];
    for(var x=0; x<this.gridWdt; x++)
    {
      this.inert[y][x] = ' ';
    }
  }
  
  this.pieceType = 0;
  this.pieceRot = 0;
  this.pieceX = 3;
  this.pieceY = 0;
  this.hold_piece = ' ';
  this.newSeq();
  this.nextpieceType = this.sequence.pop();
  this.newPiece();
}

TetrisGame.prototype.reset = function()
{
  for(var y=0; y<this.gridHgt; y++)
  {
    for(var x=0; x<this.gridWdt; x++)
    {
      this.inert[y][x] = ' ';
    }
  }
  this.single = false;
  this.doub = false;
  this.triple = false
  this.quadruple = false;
  this.holding = false;

  this.newSeq();
  this.nextpieceType = this.sequence.pop();
  this.hold_piece = ' ';
  this.newPiece();
} // reset()

TetrisGame.prototype.newPiece = function()
{
  this.pieceX = 3;
  this.pieceY = 0;
  this.pieceRot = 0;
  this.pieceType = this.nextpieceType;
  this.nextpieceType = this.sequence.pop();
  if(this.sequence.length === 0)
  {
    this.newSeq();
  }
} // newPiece()

TetrisGame.prototype.newSeq = function()
{
  let seq = [0, 1, 2, 3, 4, 5, 6]; // n=7

  for(var i=0; i<5; i++)
  {
    let j = Math.floor(Math.random() * (7-i)) + i;
    let t = seq[j];
    seq[j] = seq[i];
    seq[i] = t;
  } // bottom-up Fisher-Yates

  this.sequence = seq;
} // newSeq()

TetrisGame.prototype.update = function()
{
  this.single = false;
  this.doub = false;
  this.triple = false
  this.quadruple = false;
  let scoreChange = 0;
  let temp_score_change = 0;
  let testY = this.pieceY + 1;
  if(this.canPieceMove(this.pieceX, testY, this.pieceRot))
  {
    this.pieceY = testY;
  } // piece can fall
  else
  {
    // stamp block into inert grid
    for(var y=0; y<4; y++)
    {
      for(var x=0; x<4; x++)
      {
        let block = pieceStructures[this.pieceType][this.pieceRot][y][x];
        if(block !== ' ')
        {
          this.inert[this.pieceY + y][this.pieceX + x] = block; 
        }
      }
    }

    // scan top (0) to bottom (gridHgt) for filled rows
    for(var y=0; y<this.gridHgt; y++)
    {
      if(this.isRowFilled(y))
      {
        this.shiftBoardDownFrom(y);
        temp_score_change += 10
		//scoreChange += 10;
      }
    }
	
    this.newPiece();
    this.holding = false;

	if(!this.canPieceMove(this.pieceX, this.pieceY, this.pieceRot))
      scoreChange = -1;
  } // piece hits ground
	if(temp_score_change == 10)
	{
		this.single = true;
		scoreChange = 100;
	}
	else if (temp_score_change == 20)
	{
		this.doub = true;
		scoreChange = 400;
	}
	else if (temp_score_change == 30)
	{
		this.triple = true;
		scoreChange = 900;
	}
	else if (temp_score_change == 40)
	{
		this.quadruple = true;
		scoreChange = 1600;
	}
  return scoreChange;
} // update()

TetrisGame.prototype.isRowFilled = function(row)
{
  for(var x=0; x<this.gridWdt; x++)
  {
    if(this.inert[row][x] === ' ')
      return false;
  }
  return true;
} // isRowFilled()

TetrisGame.prototype.shiftBoardDownFrom = function(row)
{
  // scans from bottom (row) to 2nd-to-top row (1)
  for(var y=row; y>1; y--)
  {
    for(var x=0; x<this.gridWdt; x++)
    {
      this.inert[y][x] = this.inert[y-1][x];
    } // row y-1 is copied down onto row y
  }

  for(var x=0; x<this.gridWdt; x++)
  {
    this.inert[0][x] = ' ';
  } // when top row (0) is copied onto row 1, it should not be replaced
} // shiftBoardDownFrom()

TetrisGame.prototype.canPieceMove = function(testX, testY, testRot)
{
  let orientation = pieceStructures[this.pieceType][testRot];
  for(var y=0; y<4; y++)
  {
    for(var x=0; x<4; x++)
    {      
      let testXLoc = testX + x;
      let testYLoc = testY + y;

      if((orientation[y][x] !== ' ') && (  (testXLoc < 0) || 
                          (testXLoc >= this.gridWdt) || 
                          (testYLoc >= this.gridHgt) || 
                          (this.inert[testYLoc][testXLoc] !== ' ')  ))
      {
        return false;
      }
    }
  }

  return true;
} // canPieceMove()

TetrisGame.prototype.draw = function()
{
  // draw inert blocks
  for(var y=0; y<this.gridHgt; y++)
  {
    for(var x=0; x<this.gridWdt; x++)
    {
      let block = this.inert[y][x]
      this.drawBlock(block, x, y);
    }
  }

  // draw current block
  for(var y=0; y<4; y++)
  {
    for(var x=0; x<4; x++)
    {
      let block = pieceStructures[this.pieceType][this.pieceRot][y][x];
      if(block !== ' ')
      {
        this.drawBlock(block, x + this.pieceX, y + this.pieceY);
      }
      
    }
  }
} // draw()

TetrisGame.prototype.drawBlock = function(block, x, y)
{
  //ctx.fillStyle = colormap[block];
  //ctx.fillRect(x*this.tileSz, y*this.tileSz, 
                //this.tileSz-2, this.tileSz-2);
  this.board[y][x] = colormap[block];
} // drawBlock()

TetrisGame.prototype.handleInput = function (evt)
{
	if (evt == "left" || evt == "l")
	{
		let testX = this.pieceX - 1;
		if(this.canPieceMove(testX, this.pieceY, this.pieceRot))
		{
			this.pieceX = testX;
		}
	}
	
	else if (evt == "right" || evt == "r")
	{
		let testX = this.pieceX + 1;
		if(this.canPieceMove(testX, this.pieceY, this.pieceRot))
		{
		this.pieceX = testX;
		}
	}
	
	else if (evt == "rotc" || evt == "rot" || evt == "c")
	{
		 let testRot = (this.pieceRot-1) % pieceStructures[this.pieceType].length;
		if(testRot < 0)
			testRot += pieceStructures[this.pieceType].length;
    
		if(this.canPieceMove(this.pieceX, this.pieceY, testRot))
		{
			this.pieceRot = testRot;
		}
	}
	else if (evt == "rotcc" || evt == "cc")
	{
		 let testRot = (this.pieceRot+1) % pieceStructures[this.pieceType].length;
		
		if(this.canPieceMove(this.pieceX, this.pieceY, testRot))
		{
			this.pieceRot = testRot;
		}
	}
	else if (evt == "hold")
	{
		if(!this.holding)
		{
			this.holding = true;
			if(this.hold_piece == ' ')
			{
				console.log(this.pieceType);
				this.hold_piece = this.pieceType + 1;
				this.pieceType = this.nextpieceType;
				this.nextpieceType = this.sequence.pop();
				if(this.sequence.length === 0)
				{
					this.newSeq();
				}
			}
			else
			{
				temp = this.hold_piece - 1;
				this.hold_piece = this.pieceType + 1;
				this.pieceType = temp;
			}
			this.pieceX = 3;
			this.pieceY = 0;
			this.pieceRot = 0;
		}
	}
}
