'use strict';
angular.module('assetsApp').controller('ProfileCtrl', function ($scope, $http, $q, $location, $log, $rootScope, queueService, currentService) {

    $scope.loading = false;
    $scope.user = currentService.getAppUser();
    $scope.goHome = function(){
            $location.path('/home').replace();
        };

    //http://192.168.1.131:8080/eventance/api/downloadProfileData?personId=7&clubId=1
    var profileDownloadUrl =  properties.base_url+'api/downloadProfileData?personId='+currentService.getAppUser().id+'&clubId='+currentService.getCurrentClub().id;

    $scope.loading = true;
    //alert("profileDownloadUrl: "+profileDownloadUrl);
    var httpGetProfile = $http({method: 'GET', url: profileDownloadUrl}).
                success(function(data, status, headers, config) {
                    return data;
            }).
            error(function(data, status, headers, config) {
                alert("Error downloading Profile Data. Check your device connection");
            });

    httpGetProfile.then(function(data){
        var profileDataContent = data.data;
        console.log("Profile data: "+JSON.stringify(profileDataContent));
        //alert("Profile data: "+JSON.stringify(profileDataContent));
        $scope.id = null;
        $scope.promotion = null;
       _.each(profileDataContent, function(content){
            content.img = properties.base_url+"api/document/"+content.ticketId;
            switch(content.promotion.promotionType){
                case 1:
                    $scope.id = content;
                    //alert("id: "+JSON.stringify($scope.id));
                    break;
                case 2:
                    $scope.promotion = content;
                    //alert("promotion: "+JSON.stringify($scope.promotion));
                    break;
                default:
                  //nothing
                }

        });

        $scope.loading = false;
    });



    $scope.download = function(url){
        alert("I´ll download");
       var fileTransfer = new FileTransfer();

       fileTransfer.download(
           url,
           "culo.jpg",
           function(entry) {
           alert("download complete: " + entry.fullPath);
           },
           function(error) {
               alert("download error source " + error.source);
               console.log("download error target " + error.target);
               console.log("upload error code" + error.code);
           }
       );
    };


});