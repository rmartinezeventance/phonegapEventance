'use strict';
angular.module('assetsApp').controller('MainCtrl', function ($scope, $http, geolocation, $location, $log, localStorageService, $rootScope, queueService, currentService, $q, $timeout) {
    $rootScope.success=false;
    $rootScope.error=false;
    var value = localStorageService.get('clubData');
    $scope.scanCode = function(){
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan(function(result) {
            //var data = JSON.parse(result.text);
            var url='validate/'+result.text+'/qr';
            //alert(data.url);
            if (!result.cancelled){
                $location.path(url).replace();
                $scope.$apply();
            }
        },function (error) {
            alert("Scanning failed: " + error);
        });
    };

    $scope.manageUrl = function(){
         $location.path('/manage').replace();
    }
    $scope.digitalList = function(){
        $location.path('/digitalList').replace();
    }

    //Sync the queueService
    $scope.busy = false;
    $scope.noConnectivity=false;
    $timeout(function(){
        $scope.synchronized = queueService.isSynchronized();
    },1500);



    $scope.goSynchronize = function(){
        if(!$scope.busy){
            $scope.busy = true;
            var sync = queueService.sync();
            sync.then(function(done){
                //alert("Done: "+done+" !Done: "+!done);
                $scope.noConnectivity = false;
                $scope.synchronized = true;
            }, function(reason) {
                //alert('Failed: ' + reason);
                $scope.noConnectivity = true;
                $scope.busy = false;
            }, function(update) {
                //alert('Got notification: ' + update);
            });
        }
    }

    $rootScope.currentRole = currentService.getAppUser();
    $rootScope.currentLogStatus = currentService.getLogStatus();
});