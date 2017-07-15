var blueIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-blue.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var redIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-red.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-green.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-orange.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-yellow.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-violet.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-grey.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blackIcon = new L.Icon({
	iconUrl: './public/stylesheets/bootstrap/img/marker-icon-2x-black.png',
	shadowUrl: './public/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

const url = 'http://api.beelan.mx/v1/upLink/054201125412ff12';
    // ------------------------------------------------------------  //
var i = 0;

const getData = () => {
  fetch(url, {
        method: "GET",
        headers: {
          "Authorization": 'rpmDTu2rLmyH6NgjGpGs8fubaHg='
        }
      })
        .then((response) => response.json())
        //.then((response) => console.log(response))
        .then((response) => parseData(response.slice(0 , Math.min(20, response.length-1)))) //-10
        .then((response) => ShowMap(response) ) //-10
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


var mymap = L.map('mimapa',{
	 center: [21.9008, -102.3163]
	,zoom:12
});

function onScript(){

	tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; 2016 OpenStreetMap contributors, &copy; 2016 Electronic Cats',
		key: 'BC9A493B41014CAABB98F0471D759707'
	});

	mymap.addLayer(tiles);

	mymap.locate({
		enableHighAccuracy: true
	});

	mymap.on('locationfound', onlocation);


	function onRecive(data){
		console.log(data);
		var pos = data.latlng;
		var computer = L.marker([pos.lat,pos.lng]);
		mymap.addLayer(computer);
		computer.bindPopup("Usuarios aqui");
	}

	function onlocation(position){
		//console.log(position);
		var pos = position.latlng;
		var computer = L.marker([pos.lat,pos.lng],{icon: greyIcon});
		mymap.addLayer(computer)
		computer.bindPopup("Computadora").openPopup();

	}

	var posizioni = [];

}

function ShowMap(data) {
	 console.warn('data', data);
	 //mymap.removelayer(marcadores);
	 var markers = data.map(function (item) {
		 //console.log(item.color);
		 // usando el mismo color para todos los nodos
			 return L.marker([item.data.lat, item.data.lng], {icon: blueIcon}).bindPopup(`El fCnt ${item.fCnt} , con altura de: ${item.data.alt} m`);
	 })
	 var marcadores = L.layerGroup(markers).addTo(mymap);

 };


getData()
$(document).on('ready',onScript);
//Lat: 19.210216666666668 Lon: -96.17367333333334
