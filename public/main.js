var player;
var socket;
var players = [];
var enemys;
var r = 50;
air = false;
//doubleJump = 0;

var player_frames =[
  {"name":"playerBlue_walk1", "frame":{"x":0,"y":53,"width":45,"height":54}},
  {"name":"playerBlue_walk2", "frame":{"x":46,"y":46,"width":45,"height":54}},
  {"name":"playerBlue_walk3", "frame":{"x":0,"y":0,"width":45,"height":52}},
  {"name":"playerBlue_walk4", "frame":{"x":46,"y":0,"width":49,"height":45}},
  {"name":"playerBlue_walk5", "frame":{"x":0,"y":108,"width":64,"height":40}}
];

function preload(){
		//player_sprite_sheet = loadSpriteSheet('assets/blue-player.png', player_frames);
		//player_walk = loadAnimation(player_sprite_sheet);
}

function setup() {
	createCanvas(640, 200);
	enemys = new Group();
	player = createSprite(random(0, width),height);
	player.addAnimation('walk',
		'assets/blue-player/playerBlue_walk1.png',
		'assets/blue-player/playerBlue_walk2.png',
		'assets/blue-player/playerBlue_walk3.png',
		'assets/blue-player/playerBlue_walk4.png');
	player.addAnimation('stand',
		'assets/blue-player/playerBlue_stand1.png',
		'assets/blue-player/playerBlue_stand1.png',
		'assets/blue-player/playerBlue_stand2.png',
		'assets/blue-player/playerBlue_stand3.png');
	player.addAnimation('up',
		'assets/blue-player/playerBlue_up1.png');
		player.addAnimation('fall',
			'assets/blue-player/playerBlue_fall.png');
	player.maxSpeed = 10;

  //socket = io.connect('http://localhost:3000');
  socket = io.connect('/');

	//ENVIANDO POSICION INICIAL
  var data = {
      x: player.position.x,
      y: player.position.y
  }
  socket.emit('newPlayer', data);
	//RECIBIENDO INFO DE LOS ENEMIGOS
  socket.on('enemys', function (data) {
      players = data;
  });
}

function draw() {
  background(0);
	border();
	move();
	emitPosition();
	drawEnemys();
  drawSprites();
}

function emitPosition(){
	var data = {
      x: player.position.x,
      y: player.position.y
  }
  socket.emit('player', data);
}

function drawEnemys(){
	/*for (var i = players.length - 1; i >= 0; i--) {
 			fill(0, 0, 255);
      ellipse(players[i].x, players[i].y, r, r);
 	}*/
	for (var i = 0; i < players.length; i++) {
		//var newEnemy = createSprite(players[i].x, players[i].y, r, r);
		//newEnemy.addToGroup(enemys);
	}
}

function move(){
  if(keyIsDown(LEFT_ARROW)){
		if(!air) player.changeAnimation('walk');
		player.mirrorX(-1);
		player.position.x += -3;
	}else if(keyIsDown(RIGHT_ARROW)){
		if(!air) player.changeAnimation('walk');
		player.mirrorX(1);
		player.position.x += 3;
	}else if(!air){
		player.changeAnimation('stand');
	}
	if(keyIsDown(UP_ARROW) && !air) {
		player.changeAnimation('up');
		player.addSpeed(8,270);
	}
}

function border(){
	//TOP-BOTTOM BORDERS
  if(player.position.y < 0 + r ) player.position.y = 0 + r;
  if(player.position.y > height - r/2) {
		player.position.y = height - r/2;
		air = false;
	}
	if(player.position.y < height - r/2) {
		//if(player.previousPosition.y < player.position.y) player.changeAnimation('fall');
		player.addSpeed(0.5,90);
		air = true;
	}
	//LEFT-RIGHT BORDERS
	if(player.position.x < 0 + r/2 ) player.position.x = 0 +r/2;
	if(player.position.x > width - r/2) player.position.x = width - r/2;
}
