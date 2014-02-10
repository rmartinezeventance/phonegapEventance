'use strict';
angular.module('assetsApp').controller('DigitalListCtrl', function ($scope, $http, geolocation, $location, $log, localStorageService, $rootScope, queueService, currentService) {

    //ignore Accents
    var removeAccents = function(value) {
        return value
            .replace(/á/g, 'a')
            .replace(/é/g, 'e')
            .replace(/í/g, 'i')
            .replace(/ó/g, 'o')
            .replace(/ú/g, 'u');
    }

   $scope.getStaffList = function(){
        $scope.staffList = [];

        //GET STAFF ----------
        $scope.clubData = JSON.parse(localStorageService.get('clubData'));
        console.log("Club data from localStorage: "+JSON.stringify($scope.clubData));

//[{"person":{"id":7,"nif":null,"male":true,"firstName":"Carlos","secondName":"Pelayo","lastName":null,"birthDate":489492000000,"email":"carlospelayo@eventance.com","phone":"637748825","alias":null},"qrs":[{"qrId":2,"typeId":1,"key":"793748c3-9cbf-4652-8b00-a183ee4feab3"},{"qrId":3,"typeId":2,"key":"4a132ff9-b830-4dce-9f66-4b84d9d8c923"}],"permission":{"privatePromotion":true,"publicPromotion":true},"promotions":[{"promotion":{"id":4,"type":{"id":173,"labelCode":"promotion_types.free_entrance_until_two_thirty","languageCode":"spa","label":"Entrada gratis hasta las 2:30 - 1 copa 12 € toda la noche","labelGroup":"promotion_types.entrance"},"start":null,"stop":null,"max_people":300,"deleted_date":null,"created":null,"updated":null},"promotionType":2}]},{"person":{"id":13,"nif":null,"male":true,"firstName":"Prueba","secondName":"Man","lastName":null,"birthDate":537188400000,"email":"prueba_me@eventance.com","phone":"696969690","alias":null},"qrs":[],"permission":{"privatePromotion":true,"publicPromotion":true},"promotions":[{"promotion":{"id":4,"type":{"id":173,"labelCode":"promotion_types.free_entrance_until_two_thirty","languageCode":"spa","label":"Entrada gratis hasta las 2:30 - 1 copa 12 € toda la noche","labelGroup":"promotion_types.entrance"},"start":null,"stop":null,"max_people":300,"deleted_date":null,"created":null,"updated":null},"promotionType":2}]},{"person":{"id":15,"nif":null,"male":true,"firstName":"Jesús","secondName":"Lavara","lastName":null,"birthDate":null,"email":null,"phone":null,"alias":null},"qrs":[],"permission":{"privatePromotion":true,"publicPromotion":true},"promotions":[{"promotion":{"id":4,"type":{"id":173,"labelCode":"promotion_types.free_entrance_until_two_thirty","languageCode":"spa","label":"Entrada gratis hasta las 2:30 - 1 copa 12 € toda la noche","labelGroup":"promotion_types.entrance"},"start":null,"stop":null,"max_people":300,"deleted_date":null,"created":null,"updated":null},"promotionType":2}]}]

        _.each($scope.clubData, function(staff){
            var person = {
                         id: staff.person.id,
                         name: staff.person.firstName+" "+staff.person.secondName,
                         filter: removeAccents((staff.person.firstName+" "+staff.person.secondName).toLowerCase()),
                         role: 0,
                         qrKey: ''
                     };

            var qrType = 0;
            if(staff.permission.publicPromotion){ // rrpp
                //alert("Role detected 2");
                person.role = "glyphicon glyphicon-user";
                qrType = $rootScope.qrType.promo; //promocion
            }
            else {
                if(staff.permission.privatePromotion && !staff.permission.publicPromotion){ // colaborador
                    //alert("Role detected 5");
                    person.role = "glyphicon glyphicon-glass";
                    qrType = $rootScope.qrType.identity; //identidad
                }
            }

            _.each(staff.qrs, function(qr){
                if(qr.typeId == qrType){
                    person.qrKey = qr.key;
                }
            });
            $scope.staffList.push(person);
        });
        console.log("Completed StaffList: "+JSON.stringify($scope.staffList));
    };


    $scope.validate = function(key){
        var url='validate/'+key+'/list';
        //alert("URL validation: "+url);
        $location.path(url).replace();
    }

    $scope.goHome = function(){
        $location.path('/home').replace();
    };

    $scope.getStaffList();
    //alert("Staff list: "+JSON.stringify($scope.staffList));

});