

var canvas;
var canvasContext;
                               		//Ball Position and Speed
var ballX = 50;
var ballSpeedX = 10;
var ballY = 50;
var ballSpeedY = 4;

                                	//Paddle Specification
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

                                	//Score Conditions
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE =3;

                               		//Initially the WIN Screen is closed
var showingWinScreen = false;



function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left -root.scrollLeft;
	var mouseY = evt.clientY - rect.top -root.scrollTop;
	return{

		x:mouseX,
		y:mouseY
	};

}

                                	//Click Function to "Click to Continue" & Initialise WIN SCREEN
function handleMouseClick(evt) {
if(showingWinScreen) {          	//Closes the WIN SCREEN
		player1Score = 0;
		player2Score = 0;
		showingWinScreen =false;
	}

}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	var framePerSecond = 30;
	setInterval(function (){							//After every 1000/30 milliseconds, moveEverything()
								moveEverything();			//and drawEverything() will be executed
								drawEverything();
							}, 1000/framePerSecond);
	canvas.addEventListener('mousedown', handleMouseClick);   //Calls Click Function
	canvas.addEventListener('mousemove',                      //mouse position to paddleY -> mousePos.y (Therefore Scrolled omly Vertically)
							function(evt){
										var mousePos = calculateMousePos(evt);
										paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
										});
}

                                    //Retrieve Mouse Position


function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {

		showingWinScreen = true;				//Initialize WIN SCREEN
	}
	ballX = canvas.width/2;							//Starts from middle
	ballY = canvas.height/2;
	ballSpeedX = -ballSpeedX;

}


function computerMovement() {							//Computer Movement using Simple Maths
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
	if(paddle2YCenter + 35 < ballY ) {
		paddle2Y = paddle2Y + 6;

	} else if(paddle2YCenter - 35 > ballY ) {
		paddle2Y = paddle2Y - 6;

	}
}


function moveEverything(){

	if(showingWinScreen) {                   //When moving, WIN SCREEN IS RETURNED FALSE
		return;
	}

	computerMovement();						// Calls computer movement
	ballX = ballX + ballSpeedX;				//The postion of ball moving in horizontal direction
	ballY= ballY + ballSpeedY;				//The postion of ball moving in vertical direction

	if(ballX > canvas.width) {
		if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {  	//ball in between paddles bounce back horizontally
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2); 		//to Speed ones the ball bounces vertically
			ballSpeedY = deltaY * 0.35;

		} else {											//else it bounces from wall without paddle
			player1Score++; 								// so OPPOSITE PLAYER scores +1
			ballReset();									//else it bounces from wall without paddle  and starts from middle (reset func)

		}
	}
	if(ballX < 0) {
		if(ballY > paddle1Y &&
			ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;

		} else {
			player2Score++; //BEFORE WINNING
			ballReset();

		}
	}

	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}


function drawNet() {
	for(i=0;i<canvas.height; i+=40) {
	colorRect(canvas.width/2 -1,i,2,20,'#66ffff');
	}
}

function drawEverything() {


	//blanks the screen with black
	colorRect(0,0,canvas.width,canvas.height,'#000099');


	if(showingWinScreen) {    // In ballreset, the INITIALISED WIN SCREEN DISPLAY THIS

		canvasContext.fillStyle = 'white';
		if(player1Score >= WINNING_SCORE){

			canvasContext.font='30px verdana';
			canvasContext.fillText("Yay! Left Player Won ;)", 270, 200, 300);

		} else if( player2Score >= WINNING_SCORE){

			canvasContext.font='30px verdana';
			canvasContext.fillText("Yay! Right Player Won ;)", 270, 200, 300);
		}
		canvasContext.font='30px verdana';
		canvasContext.fillText("Let's Play Again!", 300, 500,300);
		return;
	}

	drawNet();


	canvasContext.fillText(player1Score, 100, 100,10); 						//STYLE FOR SCREEN DISPLAY
	canvasContext.fillText(player2Score, canvas.width-100, 100,10);


																		//paddle (players)
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'#66ffff');

																	// this is right computer paddle
	colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'#66ffff');

																					//the ball
	colorCircle(ballX,ballY,10,'yellow');


}

function colorRect(leftX, topY, width, height, drawColor){				//MAKE RECTANGLE
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect (leftX,topY,width,height);
}

function colorCircle( centerX, centerY, radius, drawColor){      //MAKE CIRCLE

 	canvasContext.fillStyle = drawColor;
 	canvasContext.beginPath();
 	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2,true);
 	canvasContext.fill();

}
