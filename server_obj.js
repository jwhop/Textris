module.exports = class serverObject{
	constructor(n, g, ch, m1,m2){
		this.name = n;
		this.game = g;
		if(m1===undefined){
			this.msg1Id = "";
		} else{
			this.msg1Id = m1;
		}
		
		if(m2===undefined){
			this.msg2Id = "";
		} else{
			this.msg2Id = m2;
		}
		
		this.move = false;
		this.channel = ch;
		this.game_interval = null;
		this.game_report = null;
	}
	
	
	
}