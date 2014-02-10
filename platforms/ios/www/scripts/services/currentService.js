assetsApp.factory('currentService', function ($http, geolocation, $rootScope) {
  var CurrentService=function(){
        var self=this;
        var logged = false;
        this.club={};
        this.appUser={};
        this.device = undefined;
        this.geolocation = undefined;
  	};

  	CurrentService.prototype.setCurrentService = function(currentDataJson){
  		console.log("called setCurrentService: "+JSON.stringify(currentDataJson));
  		this.club.id = currentDataJson.club.id;
  		this.club.name = currentDataJson.club.name;
  		this.club.place = currentDataJson.club.place;

        this.appUser.id = currentDataJson.appUser.id;
        this.appUser.name = currentDataJson.appUser.name;
        this.appUser.surname = currentDataJson.appUser.surname;

        this.appUser.userRoleId = currentDataJson.appUser.userRoleId;
        this.appUser.userRole = currentDataJson.appUser.userRole;
    };

  	CurrentService.prototype.setClub = function(club){
  		if (!club) throw new Error ('club cannot be undefined');
  		this.club.id=club.clubId;
  		this.club.name=club.clubName;
  		this.club.place= club.place;
  	};

  	CurrentService.prototype.getClub = function(){
  		return this.club;
  	};

    CurrentService.prototype.getLogStatus = function(){
  		return this.logged;
  	};

  	CurrentService.prototype.setLogStatus = function(status){
        this.logged = status;
    };

  	CurrentService.prototype.setAppUser = function(appUser){
  		if (!appUser) throw new Error ('appUser cannot be undefined');
        this.appUser.id=appUser.id;
        this.appUser.name=appUser.name;
        this.appUser.surname= appUser.surname;
  	};

  	CurrentService.prototype.setAppUserRole = function(userRole){
      		if (!userRole) throw new Error ('userRole cannot be undefined');
            this.appUser.userRoleId=userRole.roleId;
            this.appUser.userRole=userRole.roleName;
    };

    CurrentService.prototype.getAppUser = function(){
      		return this.appUser;
    };

    CurrentService.prototype.getDevice = function(){
        if (!this.device){
            //if not set already, we set it up...
            this.device = window.device;
        }
        return this.device;
    };

    CurrentService.prototype.getLocation = function(){
        if (!self.geolocation){
           self.geolocation =geolocation.getCurrentPosition();
        }
        return self.geolocation;
    };

  	var currentService = new CurrentService();
  	return currentService;
});