'use strict';
angular.module('assetsApp').controller('MainCtrl', function ($scope, $http, geolocation, $location, $log, localStorageService, $rootScope, queueService, currentService, $q, $timeout) {
    $rootScope.success=false;
    $rootScope.error=false;

    $scope.loading = false;
    $scope.config = false;
    $scope.noConnectivityClub = false;

    //var value = localStorageService.get('clubData');
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

    $scope.profileUrl = function(){
         $location.path('/profile').replace();
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

    $scope.checkSync = function(){
        clearTimeout(t);

        //timeout call GetData
        t = window.setTimeout(function(){$scope.synchronized = queueService.isSynchronized();},1500);
    }

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

    $scope.getData = function(id){
        $scope.loading = true;
        var deferred = $q.defer();

        if (!id) throw new Error({name:'Invalid reference', message:'Club Id cannot be undefined or null'});
        var downloadDataUrl = properties.base_url+'api/downloadData?clubId='+id+'&roleList=2&roleList=5';
        console.log("It´ll download the data from "+downloadDataUrl);
        //alert("It´ll download the data from "+downloadDataUrl);

        var httpGetData = $http({method: 'GET', url: downloadDataUrl}).
            success(function(data, status, headers, config) {
            localStorageService.add('clubData',JSON.stringify(data));
            console.log("clubData="+JSON.stringify(data));
            //alert("clubData="+JSON.stringify(data));
            $scope.clubData = data;
            //$scope.$apply();

            deferred.resolve(true);
        }).
        error(function(data, status, headers, config) {
            //$scope.loginError = true;
            alert("Error downloading Club promotions. Check your device connection");
            $scope.loading = false;

            deferred.reject(false);
        });

        httpGetData.then(function() {
            $scope.loading = false;
        });

        return deferred.promise;
    }

    $scope.plusEntrance = function(id,type){
        var promo_info = {
            type: 'promo',
            time: new Date(),
            data:{
                sourceReading: 'extra',
                promotion: '',
                qrCode: '',
                doormanUser: currentService.getAppUser(),
                club: { id: currentService.getCurrentClub().id,
                        name: currentService.getCurrentClub().name,
                        place: currentService.getCurrentClub().place,
                        placeName: currentService.getCurrentClub().placeName
                    },
                person: {
                    id: id,
                    name: type,
                    surname: 'Extra'
                },
                device: currentService.getDevice(),
                location: currentService.getLocation()
            }
        };
        //alert("promo_info: "+JSON.stringify(promo_info));
        queueService.add(promo_info);
        queueService.sync();
        $scope.checkSync();
    };

    $scope.saveCurrentService = function(){
        localStorageService.add('currentService',JSON.stringify(currentService));
    };

    $scope.setCurrentClub = function(club){
        //TODO CHANGE PERMISSIONS AND DATA DOWNLOAD
        if(club.role == 3 || club.role == 1){
            var getTheUserData;
            if(club.role == 3){
                getTheUserData = $scope.getData(club.id);
            }
            if(club.role == 1){
                getTheUserData = $scope.getStaff(club.id);
            }

            getTheUserData.then(function(done) {
                //alert('Success: ' + done);
                currentService.setCurrentClub(club);
                $scope.noConnectivityClub = false;

                $scope.selectionClub = currentService.getCurrentClub();
                $rootScope.currentClub = currentService.getCurrentClub();
            }, function(reason) {
                //alert('Failed: ' + reason);
                $scope.noConnectivityClub = true;

                $scope.selectionClub = currentService.getCurrentClub();
            }, function(update) {
                //alert('Got notification: ' + update);
            });
        } else{
            currentService.setCurrentClub(club);
            $scope.noConnectivityClub = false;
            $scope.selectionClub = currentService.getCurrentClub();
            $rootScope.currentClub = currentService.getCurrentClub();
        }
        $scope.config = false;
    }
    $scope.clubs = currentService.getClubs();
    $rootScope.currentLogStatus = currentService.getLogStatus();

    $rootScope.currentClub = currentService.getCurrentClub();
    $rootScope.currentPermissions = currentService.getCurrentPermissions();
    $scope.selectionClub = currentService.getCurrentClub();

    //alert("$rootScope.currentPermissions: "+JSON.stringify($rootScope.currentPermissions));
    if(($rootScope.currentPermissions.scanCodes || $rootScope.currentPermissions.digitalList.id)&& $rootScope.justLogged){
        $scope.getData($rootScope.currentClub.id);
    }

    var t = window.setTimeout(function(){$scope.checkSync();},0);
    $rootScope.justLogged = false;
});