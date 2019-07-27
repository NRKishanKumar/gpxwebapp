'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$window', '$scope', '$rootScope', '$http', function($window, $scope, $rootScope, $http) {

  function load()
  {
    if (!GBrowserIsCompatible())
      return;

    var copyOSM = new GCopyrightCollection("<a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a>");
    copyOSM.addCopyright(new GCopyright(1, new GLatLngBounds(new GLatLng(-90,-180), new GLatLng(90,180)), 0, " "));

    var tilesMapnik     = new GTileLayer(copyOSM, 1, 17, {tileUrlTemplate: 'https://tile.openstreetmap.org/{Z}/{X}/{Y}.png'});
    var tilesOsmarender = new GTileLayer(copyOSM, 1, 17, {tileUrlTemplate: 'https://tah.openstreetmap.org/Tiles/tile/{Z}/{X}/{Y}.png'});

    var mapMapnik     = new GMapType([tilesMapnik],     G_NORMAL_MAP.getProjection(), "Mapnik");
    var mapOsmarender = new GMapType([tilesOsmarender], G_NORMAL_MAP.getProjection(), "Osmarend");
    var map           = new GMap2(angular.getElementById("map"), { mapTypes: [mapMapnik, mapOsmarender] });

    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.setCenter(new GLatLng(55.95, -3.19), 13);
  }


  function init() {
    console.log("ViewCtrlcalled");
    var gpx = new gpxParser(); //Create gpxParser Object
    gpx.parse("<xml><gpx></gpx></xml>"); //parse gpx file from string data
    console.log(gpx, "NavigationController loaded");
  }

  init();
  $window.onload = load;


  function loadXML() {

    $http.get("https://dl.dropboxusercontent.com/s/8nvqnasci6l76nz/Problem.gpx")
        .then(data => {
          $scope.gpxml = data.data;
          console.log($scope.gpxml);
          parseXML();
        })
        .catch(error => {
          console.error(error);
        });

  }

  function parseXML() {
    var gpx = new gpxParser(); //Create gpxParser Object
    gpx.parse($scope.gpxml); //parse gpx file from string data
    console.log(gpx, "NavigationController loaded");
    $scope.totalDistance = gpx.tracks[0].distance.total / 1000 + "Km";
    $scope.elavationGained = gpx.tracks[0].elevation.max - gpx.tracks[0].elevation.min;
    $scope.maxSpeed = gpx.tracks[0].speed.max / 1000 + "Km/h";
    $scope.avgSpeed = gpx.tracks[0].speed.avg / 1000 + "Km/h";
    $scope.movingTime = secondsToHms(gpx.tracks[0].time.mv);
    $scope.timeElapsed = secondsToHms(gpx.tracks[0].time.el);
  }

  $scope.totalDistance = "";
  $scope.maxSpeed = "";
  $scope.avgSpeed = "";
  $scope.elavationGained = "";
  $scope.movingTime = "";
  $scope.timeElapsed = "";

  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  loadXML();
}]);