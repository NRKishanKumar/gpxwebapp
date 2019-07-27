(function () {
  'use strict';

  function NavigationController($rootScope, $scope) {

    $scope.gpxml = "";

    function readXML() {
      var x = new XMLHttpRequest();
      x.open("GET", "https://dl.dropboxusercontent.com/s/8nvqnasci6l76nz/Problem.gpx", true);
      x.onreadystatechange = function () {
        if (x.readyState == 4 && x.status == 200)
        {
          $scope.gpxml = x.response;
          console.log($scope.gpxml);
          init();
          // …
        }
      };
      x.send(null);
    }

    function init() {
      var gpx = new gpxParser(); //Create gpxParser Object
      gpx.parse($scope.gpxml); //parse gpx file from string data
      console.log(gpx, "NavigationController loaded");
    }

    readXML();
  }

  var app = angular.module('myApp.view1', []),
      requires = [
          '$rootScope',
          '$scope',
          NavigationController
      ];
  app.controller('NavigationController', requires);

})();