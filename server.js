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

var players = [];

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
		for (var i = 0 ; i < players.length; i++) {
			socket.broadcast.emit('enemys', players);
		}
	}, 1000 / 60);
});
