var blueIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-blue.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var redIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-red.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-green.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-orange.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-yellow.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-violet.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-grey.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blackIcon = new L.Icon({
	iconUrl: '/stylesheets/bootstrap/img/marker-icon-2x-black.png',
	shadowUrl: '/stylesheets/bootstrap/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

function onScript(){

	var socket = io.connect(window.location.href);

	var mymap = L.map('mimapa',{
		 center: [21.9008, -102.3163]
		,zoom:12
	});

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

	socket.on('coords:user', onRecive);

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
		var computer = L.marker([pos.lat,pos.lng]);
		mymap.addLayer(computer)
		computer.bindPopup("Computadora").openPopup();
		socket.emit('coords:me', {latlng: pos});

	}

	var posizioni = [];

	socket.on('coords:gps', function (data) {
		console.log(data);
		//mymap.removelayer(marcadores);
		var markers = data.latlng.map(function (item) {
			//console.log(item.color);
			if(item.color == '#f51035'){
	  		return L.marker([item.data.lat, item.data.lng], {icon: blackIcon}).bindPopup(`El fCnt ${item.fCnt}`);
			}
			if(item.color == '#ffae34'){
	  		return L.marker([item.data.lat, item.data.lng], {icon: yellowIcon}).bindPopup(`El fCnt ${item.fCnt}`);
			}
			if(item.color == '#bafc5c'){
	  		return L.marker([item.data.lat, item.data.lng], {icon: redIcon}).bindPopup(`El fCnt ${item.fCnt}`);
			}
    })
		//console.log(markers);
		var marcadores = L.layerGroup(markers).addTo(mymap);


	});

}

$(document).on('ready',onScript);
		//Lat: 19.210216666666668 Lon: -96.17367333333334
