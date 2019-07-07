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
  j: ":rosette:",
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

var game_collection = [];

const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    // List servers the bot is connected to
    console.log("Ready :D")
});

function find_game(currentValue, index, array)
{
	return currentValue.name === this;
}

client.on('message', message => {
  
  if (message.content.startsWith('!'))
  {
	 
  if (typeof game_collection.find(server => server.name === message.guild) === 'undefined')
	{
	  if (message.content !== '!start' && message.channel.name === "textris")
	  {
		  message.reply("currently no game found on server. type '!start' to start a game.");
	  }
	  else if (message.channel.name === "textris")
	  {
		new_game = new TetrisGame(10,15,1);
		var sent_msg = message.channel.send("Starting");
		var moving = false;
		var running = true;
		
		game_collection.push({name: message.guild, game: new_game, msg: sent_msg, move: moving, run: running, channel: message.channel.id});
		var tg = game_collection[game_collection.findIndex(find_game, message.guild)];
		var interval = setInterval (function(){
			
			if(!tg.run)
			{
				clearInterval(interval);
				message.channel.send('type !start to play again');
				game_collection.splice(game_collection.findIndex(find_game, message.guild), 1);
				
			}
			
			if (tg.game.update() < 0)
			{
				tg.run = false;
				//break;
				return;
			}
			else{
			tg.game.clear_board();
			tg.game.draw();
			msg = "";
			for(i = 0; i < 15; i++){
				for (j = 0; j < 10; j++){
					msg += tg.game.board[i][j];
				}
				msg += '\n'
			}
			msg += ('\n' + tg.getnextPiece());
			sent_msg.then((new_message) => {new_message.edit(msg);});
			}
			}, 10000); 
	  }
	}
	
	else if (message.channel.name === "textris")
	{
		var tg = game_collection[game_collection.findIndex(find_game, message.guild)].game;
		var sending_msg = game_collection[game_collection.findIndex(find_game, message.guild)].msg
		if (message.content === '!start')
		{
			message.reply("you already have a game running");
		}
		
		if (message.content === '!left' || message.content === '!right' ||
			message.content === '!rot')
			{
			if (!tg.move)
			{
				tg.move = true;
			tg.handleInput(message.content.substr(1));
			tg.clear_board();
			tg.draw();
			msg = "";
			for(i = 0; i < 15; i++){
				for (j = 0; j < 10; j++){
					msg += tg.board[i][j];
				}
				msg += '\n'
			}
			msg += tg.nextpieceType;
			sending_msg.then((new_message) => {new_message.edit(msg);});
			tg.move = false;
			}
			}
	}
	
  }
   if(message.author.bot || (message.channel.name !== "textris"))
   {
	   return;
   }
	else
	{
		
   message.delete(1000);
	}
});
client.login(process.env.BOT_TOKEN); // Replace XXXXX with your bot token

TetrisGame.prototype.getnextPiece = function(){
	return this.nextpieceType;
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

  this.newSeq();
  this.nextpieceType = this.sequence.pop();
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
  
  let scoreChange = 0;

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
        scoreChange += 10;
      }
    }

    this.newPiece();
    
	if(!this.canPieceMove(this.pieceX, this.pieceY, this.pieceRot))
      scoreChange = -1;
  } // piece hits ground

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
	if (evt == "left")
	{
		let testX = this.pieceX - 1;
		if(this.canPieceMove(testX, this.pieceY, this.pieceRot))
		{
			this.pieceX = testX;
		}
	}
	
	else if (evt == "right")
	{
		let testX = this.pieceX + 1;
		if(this.canPieceMove(testX, this.pieceY, this.pieceRot))
		{
		this.pieceX = testX;
		}
	}
	
	else if (evt == "rot")
	{
		 let testRot = (this.pieceRot-1) % pieceStructures[this.pieceType].length;
		if(testRot < 0)
			testRot += pieceStructures[this.pieceType].length;
    
		if(this.canPieceMove(this.pieceX, this.pieceY, testRot))
		{
			this.pieceRot = testRot;
		}
	}
}
