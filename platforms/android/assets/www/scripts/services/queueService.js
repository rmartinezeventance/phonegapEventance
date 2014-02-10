assetsApp.factory('queueService', function ($http, localStorageService, $q, queueTempService) {
    var QueueService=function(){
		var localStorage = localStorageService.get('queue');
		if (localStorage!=null){
			this.queue= JSON.parse(localStorage);
		}
  		else {
			this.queue = [];
		}
  	};

  	QueueService.prototype.add = function(message){
  		if (!message) throw new Error ('message cannot be undefined');
  		this.queue.push(message);
  		localStorageService.add('queue', JSON.stringify(this.queue));
  	};

  	QueueService.prototype.get = function(){
  		return this.queue;
  	};

  	QueueService.prototype.clear = function(){
  		this.queue=[];
  	};

	QueueService.prototype.sync = function(){
        var deferred = $q.defer();

        if(queueService.get().length > 0){
            var savedQueue = {};

            /*HASH queueService*/
            savedQueue.queue = queueService.get();
            savedQueue.checksum = cryptoManagerEventance.sha1(JSON.stringify(savedQueue.queue)).toString();
            //alert("queueService: " + JSON.stringify(savedQueue.queue));
            //alert("cryptedCode: " + savedQueue.checksum);
            console.log("Content POST: "+JSON.stringify(queueService.get())+" | checksum:" +cryptoManagerEventance.sha1(JSON.stringify(queueService.get())));

            //Insert into queTemp {[ARRAY],CHECKSUM}
            queueTempService.add(savedQueue);

            //$http.post(properties.cubePost_url, queueService.get())     //savedQueue.queue)  "application/json;charset=UTF-8"
            var confirmedChecksum = '';
            var postPromise = $http({
                method: 'POST',
                url: properties.cubePost_url,
                data: queueService.get(),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })
            .success(function(returnData, status, headers, config){
                console.log("Posted to URL: "+ properties.cubePost_url);
                console.log("Just posted to cube this JSON : "+JSON.stringify(queueService.get()));
                confirmedChecksum = returnData.checksum;
                //alert("SUCCESS code: "+status+" | DATA: "+JSON.stringify(returnData));
                deferred.resolve(true);
            })
            .error(function(returnData, status, headers, config) {
                console.log("Error found: returnData->"+returnData+",status->"+status+",headers->"+headers+",config->"+config);
                //alert("Error found: returnData->"+returnData+",status->"+status+",headers->"+headers+",config->"+config);
                if(status == 409){
                    console.log("It has found the same checksum. Duplicate data cannot be posted");
                    //alert("It has found the same checksum. Duplicate data cannot be posted");
                    //alert("ERROR code: "+status+" | DATA: "+JSON.stringify(returnData));
                    confirmedChecksum = returnData.checksum;
                    deferred.resolve(true);
                }else{
                    console.log("will post when I can");
                    deferred.reject(false);
                }
            });

            queueService.clear();
            localStorageService.add('queue', JSON.stringify(queueService.get()));
            postPromise.then(function(){
                //alert("PROMISED data: "+confirmedChecksum);
                queueTempService.deleteByChecksum(confirmedChecksum);

                if(!queueTempService.isSynchronized()){
                    //alert("I´LL upload the TEMP after the QUEUE");
                    var def = queueTempService.sync();
                    def.then(function(done){
                        deferred.resolve(true);
                    }, function(reason) {
                        deferred.reject(false);
                    }, function(update) {
                        //alert('Got notification: ' + update);
                    });
                }
            });
        }
        else{
            if(!queueTempService.isSynchronized()){
                //alert("I´LL upload the TEMP");
                var def = queueTempService.sync();
                def.then(function(done){
                    deferred.resolve(true);
                }, function(reason) {
                    deferred.reject(false);
                }, function(update) {
                    //alert('Got notification: ' + update);
                });
            }
            else{
                deferred.resolve(true);
            }
        }

        return deferred.promise;
	};

    QueueService.prototype.isSynchronized = function(){
	    //alert("Called the NEW QueueService - "+ queueService.get());
	    var queVoid = false;
	   //alert("TEMP SYN: "+queueTempService.isSynchronized());
        if(queueService.get().length <1 && queueTempService.isSynchronized()){
            queVoid = true;
        }

	    return queVoid;
    };

  	var queueService = new QueueService();
  	return queueService;
});