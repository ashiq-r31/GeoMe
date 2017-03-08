
function findLocation() {
	return new Promise(function(resolve, reject) {
		navigator.geolocation.getCurrentPosition(resolve, reject, {
			maximumAge:0, 
			timeout: 10000  
		});
	});
}

function geoSuccess(position) {
	document.getElementById('lat').innerHTML = position.coords.latitude.toFixed(10);
	document.getElementById('long').innerHTML = position.coords.longitude.toFixed(10);
}

function geocode(address, zip) {

  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + 
  address + '&components=postal_code:' + zip + '&key=AIzaSyC327NeDTkgJjz8ZJF2PZfg0YUUJ22Gb5A';

  return new Promise(function(resolve, reject) {

    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {

      if (req.status == 200) {
      	var response = JSON.parse(req.response);
      	console.log(response);
        resolve(response.results[0].geometry.location);
      }

      else {
        reject(Error(req.statusText));
      }

    };

    req.onerror = function() {
      reject("Network error");
    };

    req.send();

  });
 
}

function geocodeSuccess(location) {
   document.getElementById('lat').innerHTML = location.lat.toFixed(10);
   document.getElementById('long').innerHTML = location.lng.toFixed(10);
}


function geocodeFail(error) {
   document.getElementById('error').innerHTML = "Error: " + error;
}

function showForm() {
	document.getElementById('form').style.display = "block";
	document.getElementById('form').onsubmit = function(event){
		event.preventDefault();
		var address = document.getElementById('address').value;
		var zip = document.getElementById('zip').value;
		document.getElementById('error').innerHTML = "";
		return geocode(address, zip).then(geocodeSuccess).catch(geocodeFail);
		;
	};
}



findLocation()
.then(geoSuccess)
.catch(function(reason){
	document.getElementById('error').innerHTML = "Error: " + reason.message;
	showForm();
});

