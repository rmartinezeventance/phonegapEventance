'use strict';
angular.module('assetsApp')
  .controller('LoginCtrl', function ($scope,$http, geolocation, $location, $log, localStorageService, $rootScope, currentService) {
    $rootScope.success=false;
    $rootScope.error = false;

    //-- only in debug --
    //$scope.username='pruebaManager'; //pruebaManager
    //$scope.password='prueba2013';

    //precalentando
    currentService.getLocation();

    $scope.loginError = false;
    $scope.login = function(){
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($scope.username + ':' + $scope.password);
        var getLogin = $http({method: 'GET', url: properties.base_url+'api/mobileLoginData?username='+$scope.username}).
                success(function(data, status, headers, config) {
                    console.log("DATA");
                    console.log(JSON.stringify(data));
                    //alert(JSON.stringify(data));
                    //alert("successfully retrieved the data");
                    //TODO si hay más de uno pedir en qué club se loga
                    currentService.setAppUser(data.staff);
                    currentService.setClub(data.clubs[0]);
                    currentService.setAppUserRole(data.cfRole);
                    currentService.setLogStatus(true);
                    //$scope.getData(data.clubs[0].clubId);
                    localStorageService.add('currentService',JSON.stringify(currentService));
                }).
                error(function(data, status, headers, config) {
                  if (status!=0){
                      $scope.noConnectivity = false;
                      $scope.loginError = true;
                  }
                  else{
                    $scope.noConnectivity = true;
                    $scope.loginError = false;
                    //alert("local get currentService: "+localStorageService.get('currentService'));
                    //alert("local get clubData: "+localStorageService.get('clubData'));
                    $scope.workOffline = false;
                    if(localStorageService.get('currentService') != null && localStorageService.get('clubData')){
                        $scope.workOffline = true;
                    }
                  }
        });

        getLogin.then(function(){
                $scope.getData(currentService.getClub().id);
                switch(currentService.getAppUser().userRoleId){
                    case 1: //manager
                        $location.path('/home').replace();
                        break;
                    case 2: //rrpp
                      $scope.loginError = true;
                        break;
                    case 3: //doorman
                        $location.path('/home').replace();
                        break;
                    case 4: //barman
                      $scope.loginError = true;
                        break;
                }
        });

        $scope.logOffline = function(){
            console.log("current service Local: "+localStorageService.get('currentService'));
            currentService.setCurrentService(JSON.parse(localStorageService.get('currentService')));
            //alert("Returned currentService: "+JSON.stringify(currentService));


            $location.path('/home').replace();
        }


        $scope.getData = function(id){
            if (!id) throw new Error({name:'Invalid reference', message:'Club Id cannot be undefined or null'});
            $http({method: 'GET', url: properties.base_url+'api/promotionData?clubId='+id}).
            success(function(data, status, headers, config) {

              localStorageService.add('clubData',JSON.stringify(data));
              //alert ("got club data");
              console.log("clubData="+JSON.stringify(data));
              $scope.clubData = data;

              //$location.path('/home').replace();
              //$scope.$apply();
            }).
            error(function(data, status, headers, config) {
              $scope.loginError = true;
            });
        }

    };
    var browser_height = window.innerHeight;
    $rootScope.browser_height = 'min-height: '+browser_height+'px;';
    //alert("Browser_height: "+$rootScope.browser_height);
    console.log("Browser_height: "+$rootScope.browser_height);

    var browser_width = window.innerWidth;
    $rootScope.browser_width = 'min-width: '+browser_width+'px;';
    $rootScope.login_input_width = 'min-width: '+(browser_width - 65)+'px;';
    $rootScope.search_input_width = 'min-width: '+(browser_width - 65)+'px;';
    //alert("Browser width: "+$rootScope.browser_width+" login_input_width: "+ $rootScope.login_input_width );
    //alert("Browser_width: "+$rootScope.browser_width);
    console.log("Browser_width: "+$rootScope.browser_width);


});