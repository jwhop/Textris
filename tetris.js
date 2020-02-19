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

module.exports = class TetrisGame{
	constructor(gW,gH,tS){
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
			this.time_length = 1000*60*15;
			this.scoring = false;
			this.scoring_rows = [];
			this.last_moves = [];
			this.infomsg = "";
			
			for(var y=0; y<this.gridHgt; y++){
				
				this.inert[y] = [];
				
				for(var x=0; x<this.gridWdt; x++){
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
	reset(){
		for(var y=0; y<this.gridHgt; y++){
			for(var x=0; x<this.gridWdt; x++){
				this.inert[y][x] = ' ';
			}
		}
		
		this.single = false;
		this.doub = false;
		this.triple = false
		this.quadruple = false;
		this.holding = false;
		this.scoring = false;
		this.scoring_rows = [];
		this.time_length = 1000*60*15;
		this.newSeq();
		this.nextpieceType = this.sequence.pop();
		this.hold_piece = ' ';
		this.last_moves = [];
		this.newPiece();
		this.infomsg = "";


	}
	
	newPiece(){
		this.pieceX = 3;
		this.pieceY = 0;
		this.pieceRot = 0;
		this.pieceType = this.nextpieceType;
		this.nextpieceType = this.sequence.pop();
		
		if(this.sequence.length === 0){
			this.newSeq();
		}
	}
	
	getnextPiece(){
		return this.nextpieceType;
	}
	
	get_hold_piece(){
		return this.hold_piece;
	}
	
	clear_board(){
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
	
	newSeq(){
		let seq = [0, 1, 2, 3, 4, 5, 6]; // n=7

		for(var i=0; i<5; i++){
			let j = Math.floor(Math.random() * (7-i)) + i;
			let t = seq[j];
			seq[j] = seq[i];
			seq[i] = t;
		} // bottom-up Fisher-Yates

		this.sequence = seq;
	}
	
	update(){
		this.single = false;
		this.doub = false;
		this.triple = false
		this.quadruple = false;
		let scoreChange = 0;
		let temp_score_change = 0;
		let testY = this.pieceY + 1;

		if(this.canPieceMove(this.pieceX, testY, this.pieceRot)){
			this.pieceY = testY;
		} // piece can fall
		else{
			// stamp block into inert grid
			for(var y=0; y<4; y++){
				for(var x=0; x<4; x++){
					let block = pieceStructures[this.pieceType][this.pieceRot][y][x];
				
					if(block !== ' '){
						this.inert[this.pieceY + y][this.pieceX + x] = block; 
					}
				}
			}

			// scan top (0) to bottom (gridHgt) for filled rows
			for(var y=0; y<this.gridHgt; y++){
      
				if(this.isRowFilled(y)){
					if(this.scoring){
						this.shiftBoardDownFrom(y);
					}
					else{
						temp_score_change += 10;
						this.scoring_rows.push(y);
					}
				}
			}
			
			if(temp_score_change == 0){
				this.newPiece();
				this.holding = false;
				this.scoring = false;
				this.scoring_rows = [];
			}
			else{
				this.scoring = true;
			}

			if(!this.canPieceMove(this.pieceX, this.pieceY, this.pieceRot)){
				console.log("should be losing!");
				scoreChange = -1;
			}
		} // piece hits ground
	
		if(temp_score_change == 10){
			this.single = true;
			scoreChange = 100;
		}
	
		else if (temp_score_change == 20){
			this.doub = true;
			scoreChange = 400;
		}
	
		else if (temp_score_change == 30){
			this.triple = true;
			scoreChange = 900;
		}
	
		else if (temp_score_change == 40){
			this.quadruple = true;
			scoreChange = 1600;
		}
	
		if(this.time_length == 1000*60*5){
			return scoreChange*2.0;
		}
	
		else if(this.time_length == 1000*60*7){
		return scoreChange*1.75;
		}
	
		else if (this.time_length == 1000*60*10){
			return scoreChange * 1.5;
		}
	
		else{
		 return scoreChange;
		}
	}
	
	isRowFilled(row){
		
		for(var x=0; x<this.gridWdt; x++){
			if(this.inert[row][x] === ' '){
				return false;
			}
		}
		
		return true;
	}
	
	shiftBoardDownFrom(row){
		
		// scans from bottom (row) to 2nd-to-top row (1)
		for(var y=row; y>1; y--){
			for(var x=0; x<this.gridWdt; x++){
				this.inert[y][x] = this.inert[y-1][x];
			} // row y-1 is copied down onto row y
		}

		for(var x=0; x<this.gridWdt; x++){
			this.inert[0][x] = ' ';
		} // when top row (0) is copied onto row 1, it should not be replaced
  
	}
	
	canPieceMove(testX, testY, testRot){
		let orientation = pieceStructures[this.pieceType][testRot];
		for(var y=0; y<4; y++){
			for(var x=0; x<4; x++){      
				let testXLoc = testX + x;
				let testYLoc = testY + y;
				
				if((orientation[y][x] !== ' ') && (  (testXLoc < 0) || 
					(testXLoc >= this.gridWdt) || 
					(testYLoc >= this.gridHgt) || 
					(this.inert[testYLoc][testXLoc] !== ' ')  )
				){
					return false;
				}
			}
		}

		return true;
	}
	
	draw(){
		// draw inert blocks
		for(var y=0; y<this.gridHgt; y++){
			for(var x=0; x<this.gridWdt; x++){
				let block = this.inert[y][x]
				if(this.scoring_rows.includes(y)){
					this.drawBlock('w', x, y);
				}
				else{
					this.drawBlock(block, x, y);
				}
			}
		}

		// draw current block
		for(var y=0; y<4; y++){
			for(var x=0; x<4; x++){
				let block = pieceStructures[this.pieceType][this.pieceRot][y][x];
				if(block !== ' '){
					if(this.scoring_rows.includes(y + this.pieceY)){
						this.drawBlock('w', x + this.pieceX, y + this.pieceY);
					}
					else{
						if(this.highlight){
							this.drawBlock('x', x + this.pieceX, y + this.pieceY);
						}
						else{
							this.drawBlock(block, x + this.pieceX, y + this.pieceY);
						}
					}
				}
      
			}
		}
	}
	drawBlock(block, x, y){
		this.board[y][x] = colormap[block];
	}
	
	handleInput(evt){
		if(!this.scoring){
			if (evt == "left" || evt == "l"){
				let testX = this.pieceX - 1;
				if(this.canPieceMove(testX, this.pieceY, this.pieceRot)){
					this.pieceX = testX;
				}
			}
	
			else if (evt == "right" || evt == "r"){
				let testX = this.pieceX + 1;
				if(this.canPieceMove(testX, this.pieceY, this.pieceRot)){
					this.pieceX = testX;
				}
			}
	
			else if (evt == "rotc" || evt == "rot" || evt == "c"){
				let testRot = (this.pieceRot-1) % pieceStructures[this.pieceType].length;
			
				if(testRot < 0){
					testRot += pieceStructures[this.pieceType].length;
				}
    
				if(this.canPieceMove(this.pieceX, this.pieceY, testRot)){
					this.pieceRot = testRot;
				}
			}
	
			else if (evt == "rotcc" || evt == "cc"){
				let testRot = (this.pieceRot+1) % pieceStructures[this.pieceType].length;
		
				if(this.canPieceMove(this.pieceX, this.pieceY, testRot)){
					this.pieceRot = testRot;
				}
			}
	
			else if (evt == "hold"){
				if(!this.holding){
					this.holding = true;
					if(this.hold_piece == ' '){
						console.log(this.pieceType);
						this.hold_piece = this.pieceType + 1;
						this.pieceType = this.nextpieceType;
						this.nextpieceType = this.sequence.pop();
					
						if(this.sequence.length === 0){
							this.newSeq();
						}
					}
					else{
						var temp = this.hold_piece - 1;
						this.hold_piece = this.pieceType + 1;
						this.pieceType = temp;
					}
			
					this.pieceX = 3;
					this.pieceY = 0;
					this.pieceRot = 0;
				}
			}
		}
	}
}

