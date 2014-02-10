assetsApp.factory('currentService', function ($http, geolocation, $rootScope) {
    var CurrentService=function(){
        var self=this;
        var logged = false;
        this.clubs = [];
        this.permissions = [];
        this.appUser = {};
        this.device = undefined;
        this.geolocation = undefined;
        this.currentClub = {};
        this.currentPermissions = {};
    };

    CurrentService.prototype.setClubs = function(clubs){
        //alert("Clubs: "+JSON.stringify(clubs));
        if (!clubs) throw new Error ('club cannot be undefined');

        var listClubs = [];
        _.each(clubs,function(club){
            if(club.iconImage != null)
                listClubs.push({id:club.clubId, name:club.clubName, place:club.placeId, placeName:club.place, clubImageUrl:properties.base_url+club.iconImage.imageUrl});
            else
                listClubs.push({id:club.clubId, name:club.clubName, place:club.placeId, placeName:club.place, clubImageUrl:properties.base_url+'resources/images/miscellany/transparent.png'});
        });

        this.clubs = listClubs;
        console.log("Clubs: "+JSON.stringify(this.clubs));
        //alert("Clubs asigned: "+JSON.stringify(this.clubs));
        this.currentClub = this.clubs[0];
    };

    CurrentService.prototype.setPermissions = function(permissions){
            if (!permissions) throw new Error ('permissions cannot be undefined');

            this.permissions = permissions;
            console.log("Permissions: "+JSON.stringify(this.permissions));
            //alert("Permissions asigned: "+JSON.stringify(this.permissions));

            var currentClubId = this.currentClub.id;
            var currentServicesTem = {};
            //set current Permissions:
            _.each(permissions, function(perm){
                if(perm.clubId == currentClubId){
                    currentServicesTem = perm.permissions;
                }
            });
            this.currentPermissions = currentServicesTem;
    };

  	CurrentService.prototype.getClubs = function(){
  		return this.clubs;
  	};

  	CurrentService.prototype.getPermissions = function(){
  		return this.permissions;
  	};

    CurrentService.prototype.getLogStatus = function(){
  		return this.logged;
  	};

  	CurrentService.prototype.setLogStatus = function(status){
        this.logged = status;
    };

    CurrentService.prototype.getCurrentClub = function(){
        return this.currentClub;
    };

    CurrentService.prototype.setCurrentClub = function(club){
        this.currentClub = club;
    };

    CurrentService.prototype.getCurrentPermissions = function(){
        return this.currentPermissions;
    };

    CurrentService.prototype.setCurrentPermissions = function(permissions){
        this.currentPermissions = permissions;
    };

  	CurrentService.prototype.setAppUser = function(appUser){
  		if (!appUser) throw new Error ('appUser cannot be undefined');
        this.appUser.id = appUser.id;
        this.appUser.name = appUser.personDTO.firstName;
        this.appUser.surname = appUser.personDTO.secondName;
        this.appUser.userName = appUser.username;
        this.appUser.alias = appUser.personDTO.alias;
        if(appUser.photoUrl != null)
            this.appUser.userPhoto =  properties.base_url+appUser.photoUrl;
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
           self.geolocation = geolocation.getCurrentPosition();
        }
        return self.geolocation;
    };

  	var currentService = new CurrentService();
  	return currentService;
});