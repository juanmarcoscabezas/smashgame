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

io.on('connection', (socket) => {
  //RECIBIENDO NUEVOS JUGADORE
	socket.on('newPlayer', function (data) {
			players.push({
				id: socket.id,
				x: data.x,
				y: data.y
			});
			console.log("nueva conexión " + socket.id);
  });
	//EMITIOENDO ID
	io.sockets.emit('id', socket.id);
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
		var enemys = [];
		for (var i = 0 ; i < players.length; i++) {
			if(socket.id !== players[i].id){
				enemys.push(players[i]);
			}
		}
		socket.emit('enemys', enemys);

		//meteors
		if(meteors.length < 1){
			let meteor = {
				x: random(0,width),
				y: 0,
				r: random(3,10)
			}
			meteors.push(meteor);
		}
		for (var i = 0; i < meteors.length; i++) {
			meteors[i].y++;
			if(meteors[i].y > height - meteors[i].r){
				meteors.splice(i);
			}
		}
		socket.emit('meteors', meteors);

	}, 1000 / 60);
});

function random (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
