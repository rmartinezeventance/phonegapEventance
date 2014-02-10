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

        _.each($scope.clubData.promotions, function(promo){
            _.each(promo.rrpps, function(rrpp){
                if (rrpp.qrs[0].type.labelCode == "qrtype.promo"){
                    //alert("rrpp QR TYPE: "+JSON.stringify(rrpp.qrs[0].type));
                    $scope.staffList.push({
                        id: rrpp.rrppId,
                        name: rrpp.name+" "+rrpp.surname,
                        filter: removeAccents((rrpp.name+" "+rrpp.surname).toLowerCase()),
                        qrKey: rrpp.qrs[0].key
                    });
                }
            });
        });
    };


    $scope.validate = function(key){
        var url='validate/'+key+'/list';
        $location.path(url).replace();
    }

    $scope.getStaffList();
    //alert("Staff list: "+JSON.stringify($scope.staffList));

});