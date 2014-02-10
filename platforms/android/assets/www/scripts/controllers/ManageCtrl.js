'use strict';
angular.module('assetsApp').controller('ManageCtrl', function ($scope, $http, geolocation, $q, $location, $log, localStorageService, $rootScope, queueService, currentService ) {

    var promoPromise;
    var identityPromise;
    var workingSonsPeoplePromise;
    $scope.staffInClub = [];
    $scope.loading = false;

    $scope.showData = function(){
        // modal
        $scope.loading = true;

        synchronizeData();

        $q.all([promoPromise, identityPromise, workingSonsPeoplePromise]).then(function (data) {
            //alert("Data promised: "+JSON.stringify(data));
            //alert("Data[2] PERSONS: "+JSON.stringify(data[2]));

            $scope.staffInClub = [];
            $scope.extraStaff = [];

            //TODO get Staff Working in club by DATE
            //$scope.clubStaff = JSON.parse(localStorageService.get('clubData'));
            //alert("CLUBSTAFF: "+JSON.stringify($scope.clubStaff));
            //console.log("CLUBSTAFF: "+JSON.stringify($scope.clubStaff));

            //[{"person":{"id":7,"nif":null,"male":true,"firstName":"Carlos","secondName":"Pelayo","lastName":null,"birthDate":489492000000,"email":"carlospelayo@eventance.com","phone":"637748825","alias":null}]

            _.each(data[2].data,function(person){
                $scope.staffInClub.push({
                    id: person.id,
                    name: person.firstName+" "+(person.secondName).substring(0,9),
                    surname: person.secondName,
                    workingState: '',
                    arrival: '',
                    departure: '',
                    people: 0
                });
            });

            //alert("$scope.staffInClub: "+JSON.stringify($scope.staffInClub));

            //Set people from staff ----------
            //alert("Promos JSON: "+JSON.stringify(data[0]));
            console.log("Promo data: "+JSON.stringify(data[0]));
            //alert("Identity: "+JSON.stringify(data[1]));
            console.log("Identity data: "+JSON.stringify(data[1]));

            var promoData = data[0].data;
            var identityData = data[1].data;

            // Promo data: {"data":[{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:07.913Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":4,"name":"Elena","surname":"Vazquez Marin"}}},{"time":"2013-10-04T10:19:07.913Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":4,"name":"Elena","surname":"Vazquez Marin"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:45.205Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}}],"status":200,"config":{"method":"GET","url":"http://192.168.1.158:8080/eventance/api/cube/get?request=promo(rrpp,doormanUser).eq(club.id,1)&start=2013-10-04T10:00:00.000Z&stop=2013-10-05T10:00:00.000Z"}} at file:///android_asset/app/scripts/controllers/ManageCtrl.js:10

            //alert("$rootScope.currentPermissions.clubReport: "+$rootScope.currentPermissions.clubReport);
            var finded;
            _.each(promoData, function(dataObject){
                finded = false;
                _.each($scope.staffInClub, function(staff){
                    if(staff.id == dataObject.data.person.id) {
                        staff.people++;
                        finded = true;
                    }
                });
                if(!finded && $rootScope.currentPermissions.clubReport){
                    //alert("No encontrado: "+JSON.stringify(dataObject));
                    $scope.staffInClub.push({
                        id: dataObject.data.person.id,
                        name: dataObject.data.person.name+" "+(dataObject.data.person.surname).substring(0,9),
                        surname: dataObject.data.person.surname,
                        workingState: '',
                        arrival: '',
                        departure: '',
                        people: 1
                    });
                }
            });
            //alert("RRPP STAFF ARRIVALS people: "+JSON.stringify($scope.staffInClub));

            //set arriva and departure time
            // Identity data: {"data":[{"time":"2013-10-04T13:32:45.433Z","data":{"subtype":"enter","doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T13:32:37.163Z","data":{"subtype":"leave","doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":4,"name":"Elena","surname":"Vazquez Marin"}}},{"time":"2013-10-04T13:32:24.509Z","data":{"subtype":"leave","doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}}],"status":200,"config":{"method":"GET","url":"http://192.168.1.158:8080/eventance/api/cube/get?request=identity(subtype,rrpp,doormanUser).eq(club.id,1)&start=2013-10-04T10:00:00.000Z&stop=2013-10-05T10:00:00.000Z"}}
            _.each(identityData, function(dataObject){
                _.each($scope.staffInClub, function(staff){
                    if(staff.id == dataObject.data.person.id){
                        if(dataObject.data.subtype == "enter") {
                            staff.arrival = dataObject.time;
                            if(staff.workingState=='') staff.workingState = 'working';
                        }
                        if(dataObject.data.subtype == "leave" && staff.departure=='') {
                            staff.departure = dataObject.time;
                            staff.workingState = 'finished';
                        }
                        //alert("staff: "+staff.name+" state: "+staff.workingState);
                    }
                });
            });
            //alert("RRPP STAFF ARRIVALS time: "+JSON.stringify($scope.staffInClub));

            //TODO set clinet arrivals in hour groupss

            // total counter extra first
            var i = 0;
            while($scope.staffInClub[i] != null){
                //alert("Search: "+JSON.stringify($scope.staffInClub[i]));
                if($scope.staffInClub[i].id <= 0){
                    $scope.extraStaff.push($scope.staffInClub[i]);
                    $scope.staffInClub.splice(i,1);
                    i--;
                }
                i++;
            };

            // modal
            $scope.loading = false;
        });
    };

    var synchronizeData = function(){
        var promoPath =     "?request=promo(person).eq(club.id,"+currentService.getCurrentClub().id+")";
        var identityPath =  "?request=identity(subtype,person).eq(club.id,"+currentService.getCurrentClub().id+")";
        //console.log("promoPath: "+promoPath);
        //console.log("identityPath: "+identityPath);

        var searchDateRange = getDateRange($scope.selectedDate);
        //console.log("searchData: "+searchDateRange);

        var formedPromoUrl = properties.cubeGet_url+promoPath+searchDateRange+"&avoidCache="+new Date().getTime();
        var formedIdentityUrl = properties.cubeGet_url+identityPath+searchDateRange+"&avoidCache="+new Date().getTime();
        var formedSonsUrl = "";
        if($rootScope.currentPermissions.clubReport)
            formedSonsUrl = properties.base_url+'api/getIndividualEmployees?clubId='+currentService.getCurrentClub().id+'&superPersonId='+currentService.getAppUser().id+'&clubReport=true'+searchDateRange+"&avoidCache="+new Date().getTime();
        else
            formedSonsUrl = properties.base_url+'api/getIndividualEmployees?clubId='+currentService.getCurrentClub().id+'&superPersonId='+currentService.getAppUser().id+'&clubReport=false'+searchDateRange+"&avoidCache="+new Date().getTime();

        console.log("formedPromoUrl: "+formedPromoUrl);
        console.log("formedSonsUrl: "+formedSonsUrl);
        //alert("formedPromoUrl: "+formedPromoUrl);
        //alert("formedSonsUrl: "+formedSonsUrl);

        var promoDataReturn = "";
        var identityDataReturn = "";
        var sonsDataReturn = "";

        promoPromise = $http({method: 'GET', url: formedPromoUrl}).
           success(function(data, status, headers, config) {
            console.log("The datas: "+JSON.stringify(data));
                //alert("status: "+JSON.stringify(status));
                promoDataReturn = data;
                return promoDataReturn;
           }).
           error(function(data, status, headers, config) {
            console.log("Error getting promotions data");
                alert("Error getting promotion data. Check Out your connection");
           });

        identityPromise = $http({method: 'GET', url: formedIdentityUrl}).
          success(function(data, status, headers, config) {
            console.log("The datas: "+JSON.stringify(data));
                identityDataReturn = data;
                return identityDataReturn;
          }).
          error(function(data, status, headers, config) {
            console.log("Error getting identity data");
                alert("Error getting identity data. Check Out your connection");
          });

        workingSonsPeoplePromise = $http({method: 'GET', url: formedSonsUrl}).
          success(function(data, status, headers, config) {
            console.log("The datas: "+JSON.stringify(data));
            sonsDataReturn = data;
            return sonsDataReturn;
          }).
          error(function(data, status, headers, config) {
            console.log("Error getting promotions data");
            alert("Error getting promotion data. Check Out your connection");
          });


    };

    var getDateRange = function(dateDay){
        //TODO change offset to local TZ
        var today = new Date(dateDay);
        console.log("Today: "+today.toISOString())
        //alert("Today: "+today.toISOString());
        var startRange = new Date(today.setHours(12,0,0,0));
        console.log('Start: '+startRange.toISOString());
        //alert('Start: '+startRange.toISOString());
        var stopRate = new Date(today.setDate(today.getDate()+1));
        console.log('Stop: '+stopRate.toISOString());
        //formar : &start=2013-09-30T10:00:00.000Z&stop=2013-09-27T20:00:17.434Z
        var dateRangeFormat = '&start='+startRange.toISOString()+'&stop='+stopRate.toISOString();
        //var dateRangeFormat = '&start=2013-10-02T10:00:00.000Z&stop='+stopRate.toISOString();
        console.log("Final Date range: "+dateRangeFormat);
        //alert("Final Date range: "+dateRangeFormat);
        return dateRangeFormat;
    };
    $scope.changeSelectedDate = function(more){
        clearTimeout(t);

        //timeout call GetData
        t = window.setTimeout(function(){$scope.showData();},900);

        if(more) $scope.selectedDate.setDate($scope.selectedDate.getDate()+1);
        else $scope.selectedDate.setDate($scope.selectedDate.getDate()-1);
    }

    $scope.goHome = function(){
        $location.path('/home').replace();
    };

    $scope.selectedDate = new Date();
    var offset = 12; //12
    $scope.selectedDate.setHours($scope.selectedDate.getHours()-offset); //offset 12h
    //alert("Will call Synchronized");
    //$scope.showData();
    var t = window.setTimeout(function(){$scope.showData();},0);
  });