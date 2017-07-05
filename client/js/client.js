var sock = io();

sock.on('draw', onDraw);

function onDraw(table){
	$("#t1").css("background-color", "#34B233");
	for(var i = 0; i < 8; i++)
        for(var j = 0; j < 8; j++)
        {
            	if(table[i][j] == 'white')
            	{
            		$("#"+i+j).css("background-color", "white").css("transition","all 0.8s ease");
            	} 
            	else if(table[i][j]=='black')
            	{
            		$("#"+i+j).css("background-color", "black").css("transition","all 0.8s ease");
            	}
            	
        }

}

