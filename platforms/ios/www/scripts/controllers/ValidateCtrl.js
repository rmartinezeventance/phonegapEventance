'use strict';

angular.module('assetsApp')
  .controller('ValidateCtrl', function ($scope, geolocation,$location, $routeParams, localStorageService, $rootScope, queueService, currentService) {
	$scope.currentLocation = currentService.getLocation();
	$scope.currentLocation.then(function(data){
	    $scope.currentLocation= data;
	});
    $scope.validate = function(){
        $scope.ticket = undefined;
        $scope.ticked = undefined;
        $scope.identity=undefined;
        $rootScope.success=false;
        $rootScope.error=false;
     	$scope.queue= queueService.get();
     	$scope.validated = false;

        $scope.currentDate=new Date();
        $scope.clubData = JSON.parse(localStorageService.get('clubData'));

        console.log("current data="+JSON.stringify($scope.clubData));
        _.each($scope.clubData.promotions, function(promo){
            _.each(promo.rrpps, function(rrpp){

                _.each(rrpp.qrs, function(qr){
                     if (qr.key==$routeParams.id){
                        //alert("ticket found");
                        $scope.ticket={
                            text : promo.promoText,
                            sourceReading: $scope.sourceRead,
                            rrpp : {
                                id: rrpp.rrppId,
                                name: rrpp.name,
                                surname: rrpp.surname
                            },
                            type: qr.type.labelCode,
                            club: currentService.getClub()
                        }
                      }

                });

            });
        });


        if ($scope.ticket && $scope.ticket.type=='qrtype.promo'){
            //alert("esto es una promo");
            $scope.identity=false;
            $scope.success=true;
            $rootScope.success = true;
            //$scope.promo();
        }
        else if ($scope.ticket && $scope.ticket.type=='qrtype.identity'){
            //alert("esto es una identidad");
            //alert ("ticked");
            //alert($scope.ticked);
            $scope.identity=true;
        }
        else {
             $scope.error=true;
             $rootScope.error = true;
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }

    };
    $scope.promo = function(){
        //alert("called promo");
        var promo_info = {
                type:'promo',
                time: new Date(),
    			data:{
    			    sourceReading: $routeParams.source,
    				promotion: $scope.ticket.text,
    				qrCode: $routeParams.id,
    				doormanUser: currentService.getAppUser(),
                    club: currentService.getClub(),
    				rrpp: $scope.ticket.rrpp,
    				device: currentService.getDevice(),
    				location: currentService.getLocation()
    			}
        }
        //console.log("Promo info: "+ JSON.stringify(promo_info));
        //alert("promoInfo: "+JSON.stringify(promo_info));
        //alert("veces: "+$scope.ticketsNumber.number);
        console.log("Number of promos in group: "+$scope.ticketsNumber.number);
        for(var i=0; i<$scope.ticketsNumber.number; i++){
            queueService.add(promo_info);
        }
    	queueService.sync();
     	$scope.validated = true;
    };

    $scope.enter = function(){
        var enter_info = {
            type:'identity',
            time: new Date(),
			data:{
				subtype:'enter',
				doormanUser: currentService.getAppUser(),
                club: currentService.getClub(),
				rrpp: $scope.ticket.rrpp,
				device: currentService.getDevice(),
				location: currentService.getLocation()
			}
        };
		console.log("Enter info: "+ JSON.stringify(enter_info));
		queueService.add(enter_info);
		$scope.entered=true;
		$scope.common();
    };

	$scope.common = function(){
		$scope.queue = queueService.get();
		$scope.ticked=true;
		$scope.currentTime= new Date();
		console.log("going to post this object");
		console.log(JSON.stringify($scope.queue));
		queueService.sync();
	};

    $scope.leave = function(){
         var leave_info = {
            type:'identity',
            time:new Date(),
            data:{
                subtype:'leave',
				doormanUser: currentService.getAppUser(),
                club: currentService.getClub(),
				rrpp: $scope.ticket.rrpp,
				device: currentService.getDevice(),
				location: currentService.getLocation()
            }
        };
        console.log("Leave info: "+ JSON.stringify(leave_info));
		queueService.add(leave_info);
		$scope.left=true;
		$scope.common();
    };


    $scope.ticketsNumber = {};
    $scope.ticketsNumber.number = 1;
    $scope.ticketsNumber.less = function(){
        if($scope.ticketsNumber.number >=2)    $scope.ticketsNumber.number--;
    }
    $scope.ticketsNumber.more = function(){
        $scope.ticketsNumber.number++;
    }



    $scope.scanCode = function(){
          var scanner = cordova.require("cordova/plugin/BarcodeScanner");
          scanner.scan(
                function (result) {
                    //var data = JSON.parse(result.text);
                    var url='validate/'+result.text
                    if (!result.cancelled){
                        console.log("location path="+$location.path());
                        console.log("url to compare="+"/"+url);
                        if ($location.path()!="/"+url){
                          $location.path(url).replace();
                          if(!$scope.$$phase) {
                            $scope.$apply();
                          }

                        }
                        else{
                            //alert("need to validate");
                          $scope.validate();
                        }
                    }
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
          );
     };
     $scope.sourceReading = $routeParams.source;
     console.log("sourceReading "+$scope.sourceReading);

     $scope.currentLogStatus = currentService.getLogStatus();
     $scope.validate();
  });