'use strict';


let express = require('express');


let app = express();
let server = require('http').createServer(app);

let io = require('socket.io')(server);
var table = [[],[],[],[],[],[],[],[]];
let waitingPlayer;

io.on('connection', onConnection );

app.use(express.static(__dirname + '/client'));
server.listen(8080, () => console.log('reday to work'));

function onConnection(sock){
	if(waitingPlayer){
		console.log(sock + " , " + waitingPlayer);
		startGame(sock,waitingPlayer);
		waitingPlayer = null;	
	}
	else{
		waitingPlayer = sock;
	}
}

function startGame(sock1, sock2){
	console.log("startGame");
	var turn = 'black'; //black plays first
	for(var i = 0; i<8; i++) //setting up starting position
		for(var j = 0; j<8; j++)
			table[i][j]='blank';
	table[3][3]='white'; 
	table[4][4]='white';
	table[3][4]='black';
	table[4][3]='black';
	console.log(table);
	sock1.broadcast.emit('draw', {array: table});
	sock2.broadcast.emit('draw', {array: table});
}

