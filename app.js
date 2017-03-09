
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

function geoFail(error) {
   document.getElementById('geolocate-error').innerHTML = error;
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
      } else {
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

function createForm() {

  var form = document.getElementById('form');
  var addressGroup = document.getElementById('address-group');
  var address = document.getElementById('address');
  var zipGroup = document.getElementById('zip-group');
  var zip = document.getElementById('zip');
  var addressError = document.getElementById('address-error');
  var zipError = document.getElementById('zip-error');

  form.style.display = "block";

  form.onsubmit = function(event){

      event.preventDefault();

      if (address.validity.valueMissing === true) {
        addressError.innerHTML = 'Address is missing';
      } else {
        addressError.innerHTML = '';
      }

      if (zip.validity.valueMissing === true){
        zipError.innerHTML = 'Zip Code is missing';
      } else {
        zipError.innerHTML = '';
      }

      if (address.validity.valueMissing === false && zip.validity.valueMissing === false){

        var addressVal = address.value;
        var zipVal = zip.value;

        addressError.innerHTML = '';
        zipError.innerHTML = '';

        return geocode(addressVal, zipVal)
               .then(geocodeSuccess)
               .catch(geoFail);
      }
  };
}

function main(){

  findLocation()
  .then(geoSuccess)
  .catch(function(reason){
    geoFail(reason.message);
    createForm();
  });

}

document.getElementById('start').addEventListener('click', main);