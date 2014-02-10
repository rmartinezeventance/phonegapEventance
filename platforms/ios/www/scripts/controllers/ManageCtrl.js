'use strict';
angular.module('assetsApp').controller('ManageCtrl', function ($scope, $http, geolocation, $q, $location, $log, localStorageService, $rootScope, queueService, currentService) {

    var promoPromise;
    var identityPromise;
    $scope.staffInClub = [];
    $scope.loading = false;

    $scope.showData = function(){
        // modal
        $scope.loading = true;

        synchronizeData();
        //alert("RRPP STAFF: "+JSON.stringify($scope.staffInClub));

        $q.all([promoPromise, identityPromise]).then(function (data) {

        $scope.staffInClub = [];
        //Set STAFF ----------
        $scope.clubData = JSON.parse(localStorageService.get('clubData'));
        //alert("CLUBDATA: "+JSON.stringify($scope.clubData));

            _.each($scope.clubData.promotions, function(promo){
                _.each(promo.rrpps, function(rrpp){
                    //alert("rrpp: "+JSON.stringify(rrpp));
                    if (rrpp.qrs[0].type.labelCode == "qrtype.identity"){
                        //alert("rrpp QR TYPE:: "+JSON.stringify(rrpp.qrs[0].type));
                        $scope.staffInClub.push({
                            id: rrpp.rrppId,
                            name: rrpp.name+" "+(rrpp.surname).substring(0,9),
                            surname: rrpp.surname,
                            workingState: '',
                            arrival: '',
                            departure: '',
                            people: 0
                        });
                    }

                });
            });


            //Set people from staff ----------
            //alert("Promo: "+JSON.stringify(data[0]));
            console.log("Promo data: "+JSON.stringify(data[0]));
            //alert("Identity: "+JSON.stringify(data[1]));
            console.log("Identity data: "+JSON.stringify(data[1]));

            var promoData = data[0].data;
            var identityData = data[1].data;

            //alert("Promo Length: "+promoData.length);

            // Promo data: {"data":[{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:22.787Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}},{"time":"2013-10-04T10:19:07.913Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":4,"name":"Elena","surname":"Vazquez Marin"}}},{"time":"2013-10-04T10:19:07.913Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":4,"name":"Elena","surname":"Vazquez Marin"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:59.272Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T10:18:45.205Z","data":{"doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":2,"name":"Loreto","surname":"Jimenez Rubio"}}}],"status":200,"config":{"method":"GET","url":"http://192.168.1.158:8080/eventance/api/cube/get?request=promo(rrpp,doormanUser).eq(club.id,1)&start=2013-10-04T10:00:00.000Z&stop=2013-10-05T10:00:00.000Z"}} at file:///android_asset/app/scripts/controllers/ManageCtrl.js:10

            _.each(promoData, function(dataObject){
                _.each($scope.staffInClub, function(staff){
                    if(staff.id == dataObject.data.rrpp.id)     staff.people++;
                });
            });
            //alert("RRPP STAFF ARRIVALS people: "+JSON.stringify($scope.staffInClub));


            //set arriva and departure time
            // Identity data: {"data":[{"time":"2013-10-04T13:32:45.433Z","data":{"subtype":"enter","doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}},{"time":"2013-10-04T13:32:37.163Z","data":{"subtype":"leave","doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":4,"name":"Elena","surname":"Vazquez Marin"}}},{"time":"2013-10-04T13:32:24.509Z","data":{"subtype":"leave","doormanUser":{"id":5,"name":"Prueba","surname":"Man","userRoleId":3,"userRole":"doorman"},"rrpp":{"id":1,"name":"Carlos","surname":"Pelayo"}}}],"status":200,"config":{"method":"GET","url":"http://192.168.1.158:8080/eventance/api/cube/get?request=identity(subtype,rrpp,doormanUser).eq(club.id,1)&start=2013-10-04T10:00:00.000Z&stop=2013-10-05T10:00:00.000Z"}}
            _.each(identityData, function(dataObject){
                _.each($scope.staffInClub, function(staff){
                    if(staff.id == dataObject.data.rrpp.id){
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


            // modal
            $scope.loading = false;

        });
    };

    var synchronizeData = function(){
        var promoPath =     "?request=promo(rrpp).eq(club.id,"+currentService.getClub().id+")";
        var identityPath =  "?request=identity(subtype,rrpp).eq(club.id,"+currentService.getClub().id+")";
        console.log("promoPath: "+promoPath);
        console.log("identityPath: "+identityPath);
        var searchDateRange = getDateRange($scope.selectedDate);
        console.log("searchData: "+searchDateRange);
        var formedPromoUrl = properties.cubeGet_url+promoPath+searchDateRange;
        var formedIdentityUrl = properties.cubeGet_url+identityPath+searchDateRange;
        console.log("formedPromoUrl: "+formedPromoUrl);
        //alert("formedPromoUrl: "+formedPromoUrl);
        console.log("formedIdentityUrl: "+formedIdentityUrl);
        var promoDataReturn = "";
        var identityDataReturn = "";

        promoPromise = $http({method: 'GET', url: formedPromoUrl}).
           success(function(data, status, headers, config) {
            console.log("The datas: "+JSON.stringify(data));
                promoDataReturn = data;
                return promoDataReturn;
           }).
           error(function(data, status, headers, config) {
            console.log("Error getting promotions data");
                alert("Error getting promotions data");
           });

        identityPromise = $http({method: 'GET', url: formedIdentityUrl}).
          success(function(data, status, headers, config) {
            console.log("The datas: "+JSON.stringify(data));
                identityDataReturn = data;
                return identityDataReturn;
          }).
          error(function(data, status, headers, config) {
            console.log("Error getting identity data");
                alert("Error getting identity data");
          });

    };

    var getDateRange = function(dateDay){
        var offset = 10; //12 - 2 h
        //TODO change offset to local TZ
        var today = new Date(dateDay);
        console.log("Today: "+today.toISOString())
        //alert("Today: "+today.toISOString());
        today.setHours(today.getHours()-offset); //offset 12h
        console.log("Today offset:"+today.toISOString());
        //alert("Today offset:"+today.toISOString());
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
        if(more) $scope.selectedDate.setDate($scope.selectedDate.getDate()+1);
        else $scope.selectedDate.setDate($scope.selectedDate.getDate()-1);
    }
    $scope.selectedDate = new Date();
     //alert("Will call Synchronized");
     $scope.showData();
  });