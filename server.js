'use strict';

const express = require('express');
const app = express();
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = app.listen(PORT);
app.use(express.static('public'));

const io = socketIO(server);

const width = 640;
const height = 200;

var players = [];
var meteors = [];
const SPEED = 2;

io.on('connection', (socket) => {
  //RECIBIENDO NUEVOS JUGADORE
	socket.on('newPlayer', function (data) {
			players.push({
				id: socket.id,
				x: data.x,
				y: data.y,
				points: 0
			});
			console.log("nueva conexión " + socket.id);
  });
  //EMISION POSICION JUGADOR
	socket.on('player', function (data) {
		for (var i = 0; i < players.length; i++) {
			if(players[i].id == socket.id){
				players[i].x = data.x;
				players[i].y = data.y;
			}
		}
	});
	//MANEJO DE LAS DESCONEXIONES
	socket.on('disconnect', function () {
    for (var i = players.length - 1; i >= 0; i--) {
			if(players[i].id === socket.id){
				console.log("se ha desconectado: "+ players[i])
				players.splice(i,1);
			}
		}
	});
	//ENVIANDO INFORMACION DE JUGADORES
	setInterval(function() {
		//SENDING ENEMYS
		var enemys = [];
		for (var i = 0 ; i < players.length; i++) {
			if(socket.id !== players[i].id){
				enemys.push(players[i]);
			}
		}
		socket.emit('enemys', enemys);
		//SENDING POINTS
		for (var i = 0; i < players.length; i++) {
			if(players[i].id === socket.id){
				socket.emit('points', players[i].points);
			}
		}

	}, 1000 / 60);
	//REMOVING METEORS
	socket.on('removeMeteor', function(data){
		for (var i = 0; i < players.length; i++) {
			if(socket.id === players[i].id){
				players[i].points ++;
			}
		}
		if(data){
			meteors.splice(0);
		}
	});
});
//METEORS
setInterval(function (){
	if(meteors.length < 1){
		let meteor = {
			x: random(0,width),
			y: -10,
			r: random(3,10)
		}
		meteors.push(meteor);
	}
	for (var i = 0; i < meteors.length; i++) {
		meteors[i].y += SPEED;
		if(meteors[i].y > height - meteors[i].r){
			meteors.splice(i);
		}
	}
	io.emit('meteors', meteors);
}, 1000 / 60);
//RANDOM NUMBERS
function random (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
