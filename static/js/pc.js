;(function (){

var u = navigator.userAgent,

w = window.innerwidth;

if (!u.match(/applewebkit.*mobile.*/) || u.indexof('ipad') > -1) {

window.innerwidth = 750*(w / 1920);

window.onload = function() {

window.innerwidth = w;

}

}

})();
