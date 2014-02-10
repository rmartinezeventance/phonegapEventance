assetsApp.factory('deviceInfo', function ($rootScope, cordovaReady) {
  return {
    getDevice: cordovaReady(function (onSuccess, onError, options) {
      window.device;
    })
  };
});