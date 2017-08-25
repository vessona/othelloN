var host = 'http://ec2-34-207-252-72.compute-1.amazonaws.com:8080';
var connection = io.connect(host);


$(function () {
    connection.on('message', function(message) {
        $("#message").html(message);
    });


    connection.on('result', function (result) {
        alert(result.player1 + ':' +  result.score1 + ', ' + result.player2 + ':' + result.score2);
        $.post("process.php",
        {
            player1Name: result.player1,
            score1: result.score1,
            player2Name: result.player2,
            score2: result.score2,
        }
        ,function(dataFromtheServer) {
            alert(dataFromtheServer);
        });
    });
    connection.on('status', function(status) {
        $('#game_status').html('Game status:' + status);
    });

   connection.on('game', function(board) {
        for ( var i = 0; i < 8; i++ )
            for ( var j = 0; j < 8; j++ )
                if (board[i][j] == 'w')
                       $( "td[x='" + i + "'][y='" + j + "']").css('background-color', 'white');
                else if (board[i][j] == 'b')
                    $( "td[x='" + i + "'][y='" + j + "']").css('background-color', 'black');

    }); 
    
 /*  connection.on('game', function(board) {
        for ( var i = 0; i < 8; i++ )
            for ( var j = 0; j < 8; j++ )
                if (board[i][j] == 'w')
                       $( "td[x='" + i + "'][y='" + j + "']").css('backgroundImage', 'url(white.gif)');
                else if (board[i][j] == 'b')
                    $( "td[x='" + i + "'][y='" + j + "']").css('backgroundImage', 'url(black.gif)');
			 }); */

    $("#t1 td").on('click', function() {
        var x = $(this).attr('x');
        var y = $(this).attr('y');

        connection.emit('move', {'x': x, 'y': y});
    });

    $("#username_submit").on('submit', function() {
        var username = $(this).find('input').val();
        if (username != '') {
            connection.emit('username', username);
            $('#username').html('Username: ' + username);
            $('#username_form').hide();
        }
        return false;
    });

});
