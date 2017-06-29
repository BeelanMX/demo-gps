var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
const fs = require('fs');

var fetch = require('node-fetch');
var atob = require('atob');
var Highcharts = require('highcharts');

var math = require('mathjs');
var convertHex = require('convert-hex')

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var pos;
var lng,lat;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

const url = 'http://api.beelan.mx/v1/upLink/1020120129128129';
    // ------------------------------------------------------------  //
    var i = 0;
    var SendSocket = []

const getData = () => {
  fetch(url, {
        method: "GET",
        headers: {
          "Authorization": 'L/Hnr55ZiI+t3FQ8cQ2jKrzu+p4='
        }
      })
        .then((response) => response.json())
        //.then((response) => console.log(response))
        .then((response) => parseData(response.slice(Math.max(response.length-1000, 1)))) //-10
        .then((response) => SendSocket = response) //-10
        .catch((err) => console.log(err));
  }

// La data de cada uno de los paquetes recividos esta en base64
const parseData = (data) => {
  // la data de cada uno de los objetos sera convertida de base64 a hexa y de hexa a decimal
  return data.map((item) => {
    //console.log(base64toHEX(item.data))
    let wero = {};
     wero.data = corrimiento(parseHexString(base64toHEX(item.data)));
      wero.color = colores(item.macGateway);
      wero.fCnt = item.fCnt;
     return wero;
  })
}
const runArray = (data) => {
  return data.map((item) => {
    return parseHexString(item.data);
  })
}
const base64toHEX = (base64) => {
  const raw = atob(base64);
  let HEX = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    HEX += (hex.length === 2 ? hex : `0${hex}`);
  }
  return HEX.toUpperCase();
}



io.sockets.on('connection', function(socket){
	socket.on('coords:me', function(data){
		//console.log(data);
		socket.broadcast.emit('coords:user', data);
	});
  //setInterval(() => {
    getData()
    i++;
    //console.log(SendSocket)
    socket.emit('coords:gps', {
           latlng: SendSocket
        });
  }, 20000);

//});

function parseHexString(str) {
  console.log(str);
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);

    }
    console.log(result);
    return result;
}

function colores(gateway) {
  switch (gateway) {
    case '008000000000aaaa':
      return '#f51035'
      break;
    case '009000000000aabb':
        return '#bafc5c'
        break;
    case 'b827ebffffbe86a6':
        return '#ffae34'
        break;
    default:

  }

}

function corrimiento(data) {
    pos = {
       lat: (data[4] + (data[3] << 8) + (data[2] <<16 )) / 10000,
       lng: (-1)*((data[7] + (data[6] << 8) + (data[5] <<16 )) / 10000),
       alt: ((data[10] + (data[9] << 8) + (data[8] <<16 )) / 100)
    };
    console.log(pos);
    return pos;
}

function parseHexString(str) {
    var result = [];
    while (str.length >= 2) {
        result.push(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }
    return result;
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
