function onScript(){

	var socket = io.connect(window.location.href);


	var mymap = L.map('mimapa',{
		 center: [21.9008, -102.3163]
		,zoom:12
	});

	tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 18,
		attribution: 'Map data &copy; 2016 OpenStreetMap contributors, Sacitec &copy; 2016 Electronic Cats',
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

		var markers = data.latlng.map(function (item) {
	  return L.marker([item.data.lat, item.data.lng]).bindPopup(`Color es ${item.color} y el fCnt ${item.fCnt}`);
    })
		//console.log(markers);

		var cities = L.layerGroup(markers).addTo(mymap);


	});

}

$(document).on('ready',onScript);
		//Lat: 19.210216666666668 Lon: -96.17367333333334
