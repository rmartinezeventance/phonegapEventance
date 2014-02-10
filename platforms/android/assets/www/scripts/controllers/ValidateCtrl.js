'use strict';

angular.module('assetsApp')
  .controller('ValidateCtrl', function ($scope, geolocation,$location, $routeParams, localStorageService, $rootScope, queueService, currentService) {
	$scope.currentLocation = currentService.getLocation();
	$scope.currentLocation.then(function(data){
	    $scope.currentLocation = data;
	});

    $scope.validate = function(){
        $scope.ticket = undefined;
        $scope.ticked = undefined;
        $scope.identity=undefined;
        $rootScope.success=false;
        $rootScope.error=false;
     	$scope.queue = queueService.get();
     	$scope.validated = false;

        $scope.currentDate = new Date();
        $scope.clubData = JSON.parse(localStorageService.get('clubData'));

        console.log("current data="+JSON.stringify($scope.clubData));

    //[{"person":{"id":7,"nif":null,"male":true,"firstName":"Carlos","secondName":"Pelayo","lastName":null,"birthDate":489492000000,"email":"carlospelayo@eventance.com","phone":"637748825","alias":null},"qrs":[{"qrId":2,"typeId":1,"key":"793748c3-9cbf-4652-8b00-a183ee4feab3"},{"qrId":3,"typeId":2,"key":"4a132ff9-b830-4dce-9f66-4b84d9d8c923"}],"permission":{"privatePromotion":true,"publicPromotion":true},"promotions":[{"promotion":{"id":4,"type":{"id":173,"labelCode":"promotion_types.free_entrance_until_two_thirty","languageCode":"spa","label":"Entrada gratis hasta las 2:30 - 1 copa 12 € toda la noche","labelGroup":"promotion_types.entrance"},"start":null,"stop":null,"max_people":300,"deleted_date":null,"created":null,"updated":null},"promotionType":2}]},{"person":{"id":13,"nif":null,"male":true,"firstName":"Prueba","secondName":"Man","lastName":null,"birthDate":537188400000,"email":"prueba_me@eventance.com","phone":"696969690","alias":null},"qrs":[],"permission":{"privatePromotion":true,"publicPromotion":true},"promotions":[{"promotion":{"id":4,"type":{"id":173,"labelCode":"promotion_types.free_entrance_until_two_thirty","languageCode":"spa","label":"Entrada gratis hasta las 2:30 - 1 copa 12 € toda la noche","labelGroup":"promotion_types.entrance"},"start":null,"stop":null,"max_people":300,"deleted_date":null,"created":null,"updated":null},"promotionType":2}]},{"person":{"id":15,"nif":null,"male":true,"firstName":"Jesús","secondName":"Lavara","lastName":null,"birthDate":null,"email":null,"phone":null,"alias":null},"qrs":[],"permission":{"privatePromotion":true,"publicPromotion":true},"promotions":[{"promotion":{"id":4,"type":{"id":173,"labelCode":"promotion_types.free_entrance_until_two_thirty","languageCode":"spa","label":"Entrada gratis hasta las 2:30 - 1 copa 12 € toda la noche","labelGroup":"promotion_types.entrance"},"start":null,"stop":null,"max_people":300,"deleted_date":null,"created":null,"updated":null},"promotionType":2}]}]
        _.each($scope.clubData, function(staff){
            _.each(staff.qrs, function(qr){
                //alert("qr: "+JSON.stringify(qr)+" | $routeParams.id: "+$routeParams.id);
                if(qr.key == $routeParams.id){
                    $scope.ticket={
                        text : '',
                        sourceReading: $scope.sourceReading,
                        person : {
                            id: staff.person.id,
                            name: staff.person.firstName,
                            surname: staff.person.secondName
                        },
                        type: qr.typeId,
                        club: currentService.getCurrentClub()
                    }
                    _.each(staff.promotions, function(promo){
                        //alert("Promotion: "+JSON.stringify(promo));
                        if($scope.ticket.type == promo.promotionType){
                            $scope.ticket.text = promo.promotion.type.label;
                        }
                    });
                }
            });
        });

        if ($scope.ticket && $scope.ticket.type==qrType.promo){
            //alert("esto es una promo");
            $scope.identity=false;
            $scope.success=true;
            $rootScope.success = true;
            //$scope.promo();
        }
        else if ($scope.ticket && $scope.ticket.type==qrType.identity){
            //alert("esto es una identidad");
            //alert ("ticked");
            //alert($scope.ticked);
            $scope.identity=true;
        }
        else {
            //alert("alert error");
            $scope.error=true;
            $rootScope.error = true;
        }
        if(!$scope.$$phase) {
            $scope.$apply();
        }

    };

    $scope.promo = function(){
        var promo_info = {
                type:'promo',
                time: new Date(),
    			data:{
    			    sourceReading: $routeParams.source,
    				promotion: $scope.ticket.text,
    				qrCode: $routeParams.id,
    				doormanUser: currentService.getAppUser(),
                    club: { id: currentService.getCurrentClub().id,
                            name: currentService.getCurrentClub().name,
                            place: currentService.getCurrentClub().place,
                            placeName: currentService.getCurrentClub().placeName
                        },
    				person: $scope.ticket.person,
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
                club: currentService.getCurrentClub(),
				person: $scope.ticket.person,
				device: currentService.getDevice(),
				location: currentService.getLocation()
			}
        };
        //alert("enter_info: "+JSON.stringify(enter_info));
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
                club: currentService.getCurrentClub(),
				person: $scope.ticket.person,
				device: currentService.getDevice(),
				location: currentService.getLocation()
			}
        };
        //alert("Leave info: "+ JSON.stringify(leave_info));
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
                    var url='validate/'+result.text+'/qr';
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