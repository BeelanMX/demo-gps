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

	var gps = L.marker([21.9008, -102.3163]);
	var gps1 = L.marker([21.9008, -102.3163]);
	mymap.addLayer(gps);
	mymap.addLayer(gps1);
	var posizioni = [];

	socket.on('coords:gps', function (data) {
		console.log(data);
		console.log(data.latlng[0].data.lat);
		console.log(data.latlng[0].data.lng);
		/*let pos = {
			data.latlng[0].data.lat,
			data.latlng[0].data.lat
		}*/
		gps.setLatLng([data.latlng[0].data.lat,data.latlng[0].data.lng]).update();
		//posizioni.push(pos);
		gps.bindPopup( "RFM95").openPopup();
		gps1.setLatLng([data.latlng[1].data.lat,data.latlng[1].data.lng]).update();
		gps1.bindPopup( "RFM94").openPopup();
		//var polyline = L.polyline(posizioni, {color: 'red'}).addTo(mymap);
		//mymap.fitBounds(polyline.getBounds());

	});

}

$(document).on('ready',onScript);
		//Lat: 19.210216666666668 Lon: -96.17367333333334
