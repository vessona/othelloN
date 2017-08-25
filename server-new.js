"use strict";

process.title = 'othello';

var http = require('http'),
    express = require('express'),
    app = express(),
    server = http.createServer(app),
    sio = require('socket.io').listen(server)
app.use(express.static('public_html')); //starting from public folder

var port = process.env.PORT || 8080;

server.listen(port, function() {
    console.log((new Date()) + " Server is listening on port "+ port);
});


var n = -1; //game number
var games = []; //array of game objestc
var size = 8; //size of the board


function count(board, color) { //function for counting result(how many cells were colored by one color)
    var res = 0;
    for (var i = 0; i < size; i++ ) {
        for ( var j = 0; j < size; j++ )
            if (board[i][j] == color)
                res++;
    }
    return res;
}

function check(current, action, i, j, p) { //we need to check action when we look for the moves availability ie sometimes we dont need to color
    i = parseInt(i);
    j = parseInt(j);
    var result = false;
    var k, l;

    if (games[p].board[i][j] == 'blank') { //if clicked on empty cell
        if(i > 1) { 
            if(games[p].board[i - 1][j] != 'blank' && games[p].board[i - 1][j] != current) //if top cell is not empty or current color
            {
                k = i - 2; //going to the left cell from i-1
                while(k > 0 && games[p].board[k][j] != 'blank' && games[p].board[k][j] != current) //going to the top untill cuurent or empty
                {
                    k--;
                }
                if(games[p].board[k][j] == current) while(k < i) //if current color going to
                {
                    k++;
                    if(action)
                        games[p].board[k][j] = current; // color to the current color all the cells back
                    result=true; //can move there
                }
            }

            if(j > 1) //if i >1 && j>1
            {
                if(games[p].board[i - 1][j - 1] != 'blank' && games[p].board[i - 1][j - 1] != current) //if top left cell is not empty or current color
                {
                    k = i - 2;
                    l = j - 2;
                    while(k > 0 && l > 0 && games[p].board[k][l] != 'blank' && games[p].board[k][l] != current) //moving to the left top diagonal untill empty or current color cell
                    {
                        k--;
                        l--;
                    }
                    if(games[p].board[k][l] == current) // if we went to the current players cell
                        while(k < i && l < j) 
                        {
                            k++;
                            l++;
                            if(action)
                                games[p].board[k][l] = current;//color all cells back we went thru
                            result=true; //can move there
                        }
                }
            }

            if(j < size-2) //if i>1 and j<6
            {
                if(games[p].board[i - 1][j + 1] != 'blank' && games[p].board[i - 1][j + 1] != current) //if top right cell blah blah blah
                {
                    k = i - 2;
                    l = j + 2;
                    while(k > 0 && l < size-1 && games[p].board[k][l] != 'blank' && games[p].board[k][l] != current) //going to top right until....
                    {
                        k--;
                        l++;
                    }
                    if(games[p].board[k][l] == current) while(k < i && l > j) 
                    {
                        k++;
                        l--;
                        if(action)
                            games[p].board[k][l] = current; //coloring all the way back
                        result=true; //can move there
                    }
                }
            }
      }

    if(i < size-2)
        {
            if(games[p].board[i + 1][j] != 'blank' && games[p].board[i + 1][j] != current) //if bottom cell is not empty or current
            {
                k = i + 2;
                while(k < size-1 && games[p].board[k][j] != 'blank' && games[p].board[k][j] != current)
                    k++;//moving to the bottom untill blah blah blh
                if(games[p].board[k][j] == current) while(k > i)
                {
                    k--;
                    if(action)
                        games[p].board[k][j] = current;//coloring all the way back
                    result=true; // can move there
                }
            }

            if( j < size-2) //if i<6 && j<6
            {
                if(games[p].board[i + 1][j + 1] != 'blank' && games[p].board[i + 1][j + 1] != current) //if bottom right cell .......
                {
                    k = i + 2;
                    l = j + 2;
                    while(k < size-1 && l < size-1 && games[p].board[k][l] != 'blank' && games[p].board[k][l] != current) //going bottom diagonal
                    {
                        k++;
                        l++;
                    }
                    if(games[p].board[k][l] == current) while(k > i && l > j)
                    {
                        k--;
                        l--;
                        if(action)
                            games[p].board[k][l] = current;
                        result=true;
                    }
                }
            }
        }


    if(j > 1)
        {
            if(games[p].board[i][j - 1] != 'blank' && games[p].board[i][j - 1] != current) //if left cell.....
            {
                l = j - 2;
                while(l > 0 && games[p].board[i][l] != 'blank' && games[p].board[i][l] != current) //going to the left
                    l--;
                if(games[p].board[i][l] == current) while(l < j)
                {
                    l++;
                    if(action)
                        games[p].board[i][l] = current;
                    result=true;
                }
            }
            if(i < size-2)
            {
                if(games[p].board[i + 1][j - 1] != 'blank' && games[p].board[i + 1][j - 1] != current) //if bottom left cell.....
                {
                    k = i + 2;
                    l = j - 2;
                    while(k < size-1 && l > 0 && games[p].board[k][l] != 'blank' && games[p].board[k][l] != current)
                    {
                        k++;
                        l--;
                    }
                    if(games[p].board[k][l] == current) while(k > i && l < j)
                    {
                        k--;
                        l++;
                        if(action)
                            games[p].board[k][l] = current;
                        result=true;
                    }
                }
            }
        }


        if(j < size-2)
            {
                if(games[p].board[i][j + 1] != 'blank' && games[p].board[i][j + 1] != current) //if right cell......
                {
                    l = j + 2;
                    while(l < size-1 && games[p].board[i][l] != 'blank' && games[p].board[i][l] != current)
                        l++;
                    if(games[p].board[i][l] == current) while(l > j)
                    {
                        l--;
                        if(action)
                            games[p].board[i][l] = current;
                        result=true;
                    }
                }
          }
    if(result && action) games[p].board[i][j] = current; //finally coloru=ing clicked cell
    }
    return result; //returning result showing that player can actually move
}



sio.sockets.on('connection', function(socket) { //https://socket.io/docs/
    var game;
    console.log("connected");
    socket.emit('message', 'Connected'); //sending message about connection to connected client
	
    if ((n == -1) || (games[n].players > 1)) { //if there were no games yet or there is more than one player
        console.log('new game'); 
        n++; //incrementing game number
        games[n] = { //creating game object
            player1: {}, //player1 object will include name and socket
            player2: {}, //player2 object will include name and socket
            players: 0, //number of players
            turn: 0, // turn = 0 black, turn =1 white
            board: [], //array to fill and send to color the table
            status: 'On hold' //string with messages for users displayed in html ie on hold, started 
        }
    }

    if (games[n].players == 0) { //if soccket connected and there is no players in the currennt object of game awaiting
        games[n].player1 = { //filling the object with data
            socket: socket, //socket = current socket
            username: '' //name is just empty string untill filled by user
        };
        games[n].players = 1; //since 1 user(socket connected) incrementing number of players by 1

        for ( var i = 0; i < size; i++ ) { //filling array for starting position
            games[n].board[i] = [];
            for ( var j = 0; j < size; j++ )
                games[n].board[i][j] = 'blank';

        }
        games[n].board[3][3] = 'w';
        games[n].board[3][4] = 'b';
        games[n].board[4][3] = 'b';
        games[n].board[4][4] = 'w';

        games[n].player1.socket.emit('message', 'Waiting for opponent'); //message to dispaly in index that there is onlyy current player awaiting for his opponent
    } else { //if there is already player awaiting )(games[n].players == 1) 
        games[n].player2 = { //filling 2player object via data same as did with 1st one
            socket: socket,
            username: ''
        };
        games[n].players = 2; //now there are 2 players

        games[n].player1.socket.emit('message', 'Opponent connected'); //sending messages about opponent connection
        games[n].player2.socket.emit('message', 'Connected to opponent');
    }

    game = games[n]; // just to make it shorter

    socket.on('username', function (username) { //what to do if user sent username
        if (game.player1.socket.id == socket.id) //if socket.is of sending user matches with socket id of player1 then
            game.player1.username = username; //writing name to this player1 object
        else
            game.player2.username = username;

        if ((game.players == 2) && (game.player1.username != '') && (game.player2.username != '')) { //if users filled the names and there are 2 playrs
            game.status = 'started'; //string to make users know that game started
            game.player1.socket.emit('game', game.board); //sending array to player1st
            game.player1.socket.emit('message', 'Your turn'); //sending text that it is his turn to player1st
            game.player2.socket.emit('game', game.board);  //same with player2
            game.player2.socket.emit('message', 'Your enemy\'s turn');
            game.player1.socket.emit('status', game.status); 
            game.player2.socket.emit('status', game.status);
            //////////now player1 clicks on the cell and sends move////////////
        }
    });

    socket.on('disconnect', function () { //what happened if one of players disconnected
        console.log('disconnect');
        if (game.status != 'finished') { //if game not finished yet
            if (game.player1.socket.id == socket.id) { //if player 1 disconnected
                if (game.players == 2) { //if here were 2 players
                    if (game.status == 'started') { //if game  started already (players entered their names)
                        var cw = count(game.board, 'w'); //counting how many cells colored by player2 who is playing for whit
                        game.player2.socket.emit('result', {
                            'player1': game.player2.username, 
                            'score1': cw,
                            'player2': game.player1.username,
                            'score2': '0'
                        });
                    }

//either if game was started or not
                    game.player2.socket.emit('message', 'Your enemy disconnected. You won!');
                    game.player2.socket.emit('status', game.status);
                } else { // if (game.players != 2) 
                    game.players = 3; //closing current game with making players = 3
                    game.status = 'finished';
                }
            } else { //if player2 disconnected
            	if (game.players == 2) {  //same as from line 283
                if (game.status == 'started') {
                    var cb = count(game.board, 'b');
                    game.player1.socket.emit('result', {
                        'player1': game.player1.username,
                        'score1': cb,
                        'player2': game.player2.username,
                        'score2': '0'
                    });
                }

                game.player1.socket.emit('message', 'Your enemy disconnected. You won!');
                game.player1.socket.emit('status', game.status);}
                   else {
                    game.players = 3;
                    game.status = 'finished';
                }
            }
          //finally changing game status 
            game.status = 'finished';
        }
        //if game status - finished nothing happens doesnt matter if either anyone disconnected
    });

    socket.on('move', function (data) { //recieveing move from player
        for ( var i = 0; i < games.length; i++ ) {
            //если игра с этим сокетом и твой ход
            if ((games[i].status == 'started') && (games[i].players == 2)
                && (games[i].player1.socket.id == socket.id) && (games[i].turn == 0)) { //if game started and there is 2 players and player1 sent this message and it is his/her turn (0 -- for black (player1))
                if (check('b', true, data.x, data.y, i)) {
                    
                    var finished = true; //game status
                    var hasMove = false; //if player has moves

                    for (var i1 = 0; i1 < size; i1++) //checking if player2 has available moves
                        for (var j1 = 0; j1 < size; j1++)
                            if( check('w', false, i1, j1, i) > 0) {//if player2 has moves
                                finished = false;
                                hasMove = true;
                            }

                
                    if (!hasMove) { //if not
                        for (var i1 = 0; i1 < size; i1++)
                            for (var j1 = 0; j1 < size; j1++)
                                if( check('b', false, i1, j1, i) > 0) { //if player1 has moves --checking if game haven't finished yet
                                    finished = false; //player1 still has moves
                                }
                    }

                    
                    if (finished) { //if player1 and player2 doesnt have available moves counting results 
                        var w = 0, b = 0;
                        for (var i1 = 0; i1 < size; i1++)
                            for (var j1 = 0; j1 < size; j1++)
                                if ( games[i].board[i1][j1] == 'w')
                                    w++;
                                else if (games[i].board[i1][j1] == 'b')
                                    b++;


                        var message1 = 'Game over',
                            message2 = 'Game over';
                        if (b > w) {
                            message1 += ' You won ' + b + ':' + w;
                            message2 += ' You loose ' + w + ':' + b;
                        } else if (w > b) {
                            message1 += ' You loose ' + b + ':' + w;
                            message2 += ' You won ' + w + ':' + b;
                        } else {
                            message1 += ' Tire ' + w + ':' + b;
                            message2 += ' Tire ' + b + ':' + w;
                        }

  					   game.player1.socket.emit('result', {
                            'player1': game.player1.username,
                            'score1': b,
                            'player2': game.player2.username,
                            'score2': w
                        });
                        games[i].player1.socket.emit('message', message1); 
                        games[i].player2.socket.emit('message', message2);
                        games[i].turn = 3; //3 shows that its finished
                    } else if (hasMove) { //if player2 has moves
                        games[i].turn = 1; //changing turn to whites
                        games[i].player1.socket.emit('message', 'Your enemy\'s turn');
                        games[i].player2.socket.emit('message', 'Your turn');
                    } else { //if player2 doesnt have moves
                        games[i].player1.socket.emit('message', 'Your enemy passes. You move again.');
                        games[i].player2.socket.emit('message', 'You are passing');
                    }

         
                    games[i].player1.socket.emit('status', games[i].status);
                    games[i].player2.socket.emit('status', games[i].status);
                    games[i].player1.socket.emit('game', games[i].board); //sending board and status to both players
                    games[i].player2.socket.emit('game', games[i].board);
                }

               //if move is not valid (not player1 turnn - noting is happen)
            } else if ((game.status == 'started') && (games[i].players == 2) && (games[i].player2.socket.id == socket.id) && (games[i].turn == 1)) { // if player2 making a move and it is his/her turn
                if (check('w', true, data.x, data.y, i)) {
//check if player2 has moves
                    var finished = true; //if game finished or not
                    var hasMove = false; //if player has moves

                    for (var i1 = 0; i1 < size; i1++)
                        for (var j1 = 0; j1 < size; j1++)
                            if( check('b', false, i1, j1, i) > 0) { //if 1st player has moves
                                finished = false;
                                hasMove = true;
                            }

                    if (!hasMove) { //if player1 doesnt have moves
                        for (var i1 = 0; i1 < size; i1++)
                            for (var j1 = 0; j1 < size; j1++)
                                if( check('w', false, i1, j1, i) > 0) { //if player2 still has moves game is not finished
                                    finished = false;
                                }
                    }


                    if (finished) { //but if finished lets show so
                        //counting results
                        var w = 0, b = 0;
                        for (var i1 = 0; i1 < size; i1++)
                            for (var j1 = 0; j1 < size; j1++)
                                if ( games[i].board[i1][j1] == 'w')
                                    w++;
                                else if (games[i].board[i1][j1] == 'b')
                                    b++;

                        var message1 = 'Game Over',
                            message2 = 'Game Over';
                        if (b > w) {
                            message1 += ' You won ' + b + ':' + w;
                            message2 += ' You loose ' + w + ':' + b;
                        } else if (w > b) {
                            message1 += ' You loose ' + b + ':' + w;
                            message2 += ' You won ' + w + ':' + b;
                        } else {
                            message1 += ' Tire ' + w + ':' + b;
                            message2 += ' Tire ' + b + ':' + w;
                        }

                       game.player1.socket.emit('result', {
                            'player1': game.player1.username,
                            'score1': b,
                            'player2': game.player2.username,
                            'score2': w
                        });
                        games[i].player1.socket.emit('message', message1);
                        games[i].player2.socket.emit('message', message2);

                        games[i].turn = 3; //finished
                        games[i].status = 'finished';


                    } else if (hasMove) { //if player1 has moves
                        games[i].turn = 0; //changing turn for player1
                        games[i].player1.socket.emit('message', 'Your turn');
                        games[i].player2.socket.emit('message', 'Your enemy\'s turn');
                    } else { //if player1 doesnt have moves and game isnt finished yet player2 moves another time, player1 passes
                        games[i].player2.socket.emit('message', 'Your enemy passes. You move again');
                        games[i].player1.socket.emit('message', 'You are passing');
                    }

                    //sending board and game status to both players
                    games[i].player1.socket.emit('status', games[i].status);
                    games[i].player2.socket.emit('status', games[i].status);
                    games[i].player1.socket.emit('game', games[i].board);
                    games[i].player2.socket.emit('game', games[i].board);
                }
                //if it is not player2 turn - nothing is happens
            }
        }
    });
});
