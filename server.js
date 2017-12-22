//INICIACION DE EXPRESS
var express = require('express');
var app = express();
var server = app.listen(3000);
//INICIACION JUGADORES
players = [];
//SERVER INICIADO
console.log("server inciado");
//CARPETA PARA COMPARTIR
app.use(express.static('public'));
// INICIACION SOCKET
var socket = require('socket.io');
var io = socket(server);
//CONEXIÖN SOCKET
io.on('connection', function (socket) {
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
	/*setInterval(function() {
		for (var i = 0 ; i < players.length; i++) {
			if (players[i].id !== socket.id) {
				var player = players[i];
				var playersData = {
					id: player.id,
					x: player.x,
					y: player.y
				}
				socket.broadcast.emit('enemys', player);
			}
		}
	}, 1000 / 60);
	*/
});
