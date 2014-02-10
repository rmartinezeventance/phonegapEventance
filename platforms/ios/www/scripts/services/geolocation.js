assetsApp.factory('geolocation', function ($rootScope,phonegapReady, $q) {
  return {
    getCurrentPosition: function() {
      var deferred = $q.defer();
      phonegapReady().then(function(){
        navigator.geolocation.getCurrentPosition(function (onSuccess) {
            $rootScope.$apply(deferred.resolve(onSuccess));
        }, function (onError) {
            $rootScope.$apply(deferred.reject(onError));
        });
      });
      return deferred.promise;
    }
  };
});