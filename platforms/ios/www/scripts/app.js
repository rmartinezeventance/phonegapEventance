'use strict';
var assetsApp = angular.module('assetsApp', ['solvver.ready','LocalStorageModule','ngMobile'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/validate/:id/:source', {
              templateUrl: 'views/validate.html',
              controller: 'ValidateCtrl'
      })
      .when('/manage', {
              templateUrl: 'views/manage.html',
              controller: 'ManageCtrl'
      })
      .when('/digitalList', {
              templateUrl: 'views/digitalList.html',
              controller: 'DigitalListCtrl'
      })
      .when('/login', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl'
       })
      .when('', {
              templateUrl: 'views/login.html',
              controller: 'LoginCtrl'
       })

      .otherwise({
        redirectTo: '/home'
      });
  });

var handleDeviceBackButton = function(e){
    //e.preventDefault();

    //document.removeEventListener("backbutton", handleDeviceBackButton, false);
    //alert("Prueba");
    //alert("RouteParms "+$routeParams);
    //alert("Location path "+$location.path());
    //$location.path('/home').replace();
    //navigator.app.exitApp();
}

var onDeviceReady = function(){
    navigator.app.overrideBackbutton(true);
    document.addEventListener("backbutton", handleDeviceBackButton(e), false);
}

document.addEventListener("deviceready", onDeviceReady, false);