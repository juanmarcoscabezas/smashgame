var socket;

var player,r = 50, air = false;
var players = [];

var meteors = [], meteorsGroup, meteorImage;

var enemys, enemyImage;

var bgImg;

const width = 640;
const height = 200;
//doubleJump = 0;

function setup() {
	createCanvas(640, 200);

	enemys = new Group();
  meteorsGroup = new Group();

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

  enemyImage = loadImage('assets/blue-player/playerBlue_stand1.png');

  bgImg = loadImage("assets/set2_hills.png")

  meteorImage = loadImage('assets/redgem.png')

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
  //RECIBIENDO LOS METEOROS
  socket.on('meteors', function (data) {
      meteors = data;
  });
}

function draw() {
  background(0);
	border();
	move();
	emitPosition();
	drawEnemys();
  drawMeteors();
  player.collide(enemys);
  camera.off();
  //image(bgImg,0,-200);
  camera.on();

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
	for (var i = 0; i < players.length; i++) {
		var newEnemy = createSprite(players[i].x, players[i].y);
    newEnemy.addImage(enemyImage);
    newEnemy.life = 1;
		enemys.add(newEnemy);
	}
}

function drawMeteors(){
	for (var i = 0; i < meteors.length; i++) {
		var newMeteor = createSprite(meteors[i].x, meteors[i].y);
    newMeteor.addImage(meteorImage);
    newMeteor.life = 1;
		meteorsGroup.add(newMeteor);
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
