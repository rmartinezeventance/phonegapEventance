assetsApp.factory('queueTempService', function ($http, localStorageService, $q) {
    var QueueTempService=function(){
		var localTempStorage = localStorageService.get('queueTemp');
		if (localTempStorage!=null){
			this.queueTemp= JSON.parse(localTempStorage);
		}
  		else {
			this.queueTemp = [];
		}
  	};
  	QueueTempService.prototype.add = function(queueObject){
  		if (!queueObject) throw new Error ('message cannot be undefined');
  		this.queueTemp.push(queueObject);
  		localStorageService.add('queueTemp', JSON.stringify(this.queueTemp));
  	//	alert("QUEUE-TEMP"+ JSON.stringify(this.queueTemp));
  		console.log("QUEUE-TEMP"+ JSON.stringify(this.queueTemp));
  		//alert("CHECKSUM: "+this.queueTemp[0].checksum)
  	};

  	QueueTempService.prototype.deleteByChecksum = function(confirmedChecksum){
  	    _.each(QueueTempService.get(), function(dataCollection, index){
  	        //alert("[]: "+JSON.stringify(dataCollection));
  	        if(dataCollection.checksum == confirmedChecksum){
  	            QueueTempService.get().splice(index, 1);
                console.log("deleted queue with checksum: "+confirmedChecksum);
                //alert("deleted queue with checksum: "+confirmedChecksum);
  	        }
  	    });
  		//alert("DELETED QUE TEMP - "+ JSON.stringify(QueueTempService.get()));

        localStorageService.add('queueTemp', JSON.stringify(QueueTempService.get()));
  	};

  	QueueTempService.prototype.get = function(){
  		return this.queueTemp;
  	};

  	QueueTempService.prototype.clear = function(){
  		this.queueTemp=[];
  	};

	QueueTempService.prototype.sync = function(){
        var deferred = $q.defer();
        var promiseArray = [];
        _.each(QueueTempService.get(), function(dataCollection){
            //alert("Will sync: "+JSON.stringify(dataCollection.queue));
            var postPromise = $http.post(properties.cubePost_url, dataCollection.queue)
            .success(function(returnData, status, headers, config) {
                console.log("Posted to URL: "+ properties.cubePost_url);
                //alert("Posted to URL: "+ properties.cubePost_url);
                console.log("Just posted to cube this JSON : "+JSON.stringify(QueueTempService.get()));
                //alert("delete checksum:  "+returnData.checksum);
                QueueTempService.deleteByChecksum(returnData.checksum);
                localStorageService.add('queueTemp', JSON.stringify(QueueTempService.get()));
                //deferred.resolve(true);
                return true;
            })
            .error(function(returnData, status, headers, config) {
                if(status == 409){
                    //alert("Duplicated queueTEMP");
                    QueueTempService.deleteByChecksum(returnData.checksum);
                    //deferred.resolve(true);
                    return true;
                }
                else{
                    console.log("will post when I can");
                    //alert("will post when I can");
                    //deferred.reject(false);
                    return false;
                }
            });

            promiseArray.push(postPromise);
        });

        $q.all(promiseArray).then(function (data) {
            //alert("Finished all the promises");
            var result = _.every(data);
            if(result){
                //alert ("resolving true");
                deferred.resolve(true);
            }
            else{
                //alert ("resolving false");
                deferred.reject(false);
            }
        }, function(reason) {
                //alert ("REJECTED");
                var result = _.every(reason);
                if(result){
                    //alert ("resolving true");
                    deferred.resolve(true);
                }
                else{
                    //alert ("resolving false");
                    deferred.reject(false);
                }
        });

        return deferred.promise;
	};

    QueueTempService.prototype.isSynchronized = function(){
	    //alert("Called the NEW QueueTempService - "+ QueueTempService.get());
	    var queVoid = false;
        if(QueueTempService.get().length <1){
            queVoid = true;
	    }
	    return queVoid;
    };

  	var QueueTempService = new QueueTempService();
  	return QueueTempService;
});