var sock = io();

$(document).ready (function() {
	sock.on('draw', onDraw);
function onDraw(table){
                $("#t1").css("background-color", "#34B233");
                console.log(table.array[0][0]);
                for(var i = 0; i < 8; i++)
                       for(var j = 0; j < 8; j++)
                       {
                                       if(table.array[i][j] == 'white')
                                       {
                                               $("#"+i+j).css("background-color", "white").css("transition","all 0.8s ease");
                                       } 
                                       else if(table.array[i][j]=='black')
                                       {
                                               $("#"+i+j).css("background-color", "black").css("transition","all 0.8s ease");
                                       }
                                       
                       }
        
        }

});

