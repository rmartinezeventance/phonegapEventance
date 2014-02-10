'use strict';
angular.module('assetsApp')
  .controller('LoginCtrl', function ($scope,$http, geolocation, $location, $log, localStorageService, $rootScope, currentService) {
    $rootScope.success=false;
    $rootScope.error = false;
    $rootScope.justLogged = true;
    $rootScope.qrType = qrType;

    $scope.loading = false;

    //-- TODO only in debug --
    $scope.username='cpelayo'; //prueba
    $scope.password='cpelayo';

    //precalentando
    currentService.getLocation();

    $scope.loginError = false;
    $scope.login = function(){
        $scope.loading = true;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode($scope.username + ':' + $scope.password);
        var getLogin = $http({method: 'GET', url: properties.base_url+'api/mobileLoginData?username='+$scope.username}).
                success(function(data, status, headers, config) {
                    console.log("DATA");
                    console.log(JSON.stringify(data));
                    //alert(JSON.stringify(data));
                    currentService.setAppUser(data.user);
                    currentService.setClubs(data.clubs);
                    currentService.setPermissions(data.permissions);
                    currentService.setLogStatus(true);
                }).
                error(function(data, status, headers, config) {
                  $scope.loading = false;
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
                  }
        });

        getLogin.then(function(){
            $scope.loading = false;
            $location.path('/home').replace();
                //$scope.getData(currentService.getClub().id);
        });

        /*$scope.logOffline = function(){
        currentService.setCurrentService(JSON.parse(localStorageService.get('currentService')));
            if($scope.username == currentService.getAppUser().userName){
                console.log("current service Local: "+localStorageService.get('currentService'));
                //currentService.setCurrentService(JSON.parse(localStorageService.get('currentService')));
                //alert("Returned currentService: "+JSON.stringify(currentService));

                $location.path('/home').replace();
            }
            else {
                $scope.loginError = true;
            }
        }*/

    };
    var browser_height = window.innerHeight;
    $rootScope.browser_height = 'min-height: '+browser_height+'px;';
    //alert("Browser_height: "+$rootScope.browser_height);
    console.log("Browser_height: "+$rootScope.browser_height);

    var browser_width = window.innerWidth;
    $rootScope.browser_width = 'min-width: '+browser_width+'px;';

    if(browser_width - 65 > 700){
        $rootScope.login_input_width = 'min-width: '+(700 - 65)+'px;';
        $rootScope.search_input_width = 'min-width: '+(700 -65)+'px;';
    } else {
        $rootScope.login_input_width = 'min-width: '+(browser_width - 65)+'px;';
        $rootScope.search_input_width = 'min-width: '+(browser_width -65)+'px;';
    }

    //alert("Browser width: "+$rootScope.browser_width+" login_input_width: "+ $rootScope.login_input_width );
    //alert("Browser_width: "+$rootScope.browser_width);
    console.log("Browser_width: "+$rootScope.browser_width);


});