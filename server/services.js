
// add service //checked
function addService(serviceObj, serviceImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (serviceImageFile.size <= size && serviceImageFile != undefined) {
        if (serviceObj.title.ar != "" && serviceObj.title.en != "" && serviceObj.link.ar != "" && serviceObj.link.en != "") {
            var key = firebase.database().ref('/services/').push(serviceObj).key;
            var uploadTask = firebase.storage().ref('/images/services/' + key).put(serviceImageFile);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress);
            }, function (error) {
                console.log("error in uploading");
            }, function () {
                firebase.database().ref('/services/' + key).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                    assignlogmsg("done");
                }).catch(function (error) {
                    assignlogmsg("error");
                })
            });
        } else {
            assignlogmsg("check your service info");
        }
    } else {
        assignlogmsg("service image is too large");
    }
}

//edit service //checked
function editService(Sid, editedPart, Obj, assignlogmsg) {
    if (Sid != "" && editedPart != "" && editedPart != undefined && Obj.ar != "" && Obj.en != "") {
        firebase.database().ref('/services/' + Sid).child(editedPart).set(Obj
            /*{
                ar: "الاتالاتالااتلاتلاا",
                en: "ababababasdcsdc"
            }*/
            /*{
                link: {
                    ar:"اتراتر",
                    en: "test text",
                    reference: "test reference"
                },
                title: {
                    ar: "title",
                    en: "تايتل"
                },
                content: {
                    ar: "يستلاس",
                    en: "csdcsdcsdc"
                }
            }*/
        ).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        })
    } else {
        assignlogmsg("check service info");
    }
}


//edit service image //checked
function editServiceImage(Sid, serviceImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (Sid != "" && serviceImageFile != undefined && serviceImageFile.size <= size) {
        var uploadTask = firebase.storage().ref('/images/services/' + Sid).put(serviceImageFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/services/' + Sid).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                assignlogmsg("error");
            })
        });
    } else {
        assignlogmsg("service image is too large");
    }
}

//get navbar service menu //checked
function getNavService(serviceCallBack) {
    firebase.database().ref('/services').on('value', function (snapshot_1) {
        var menu = [];
        snapshot_1.forEach(function (service) {
            menu.push({
                serviceKey: service.key,
                link: service.child('link').val(),
            });
        });
        serviceCallBack(menu);
    });
}

//get all services //checked
function getAllServices(serviceCallBack) {
    firebase.database().ref('/services').on('value', function (snapshot_1) {
        var services = [];
        snapshot_1.forEach(function (service) {
            var enString = service.child('content').val().en;
            var arString = service.child('content').val().ar;
            var length = 1;
            // var enContent = enString.substring(0, length);
            // var arContent = arString.substring(0, length);
            var enContent = enString.split("\n", length);
            var arContent = arString.split("\n", length);
            var content = {
                en: enContent + " . . .",
                ar: arContent + " . . ."
            }
            var fullContent = {
                en: enString,
                ar: arString
            }
            services.push({
                serviceKey: service.key,
                link: service.child('link').val(),
                content: content,
                fullContent: fullContent,
                image: service.child('imageUrl').val(),
                title: service.child('title').val()
            });
        });
        serviceCallBack(services);
    });
}

//get service by id //checked
function getService(sid, serviceCallBack) {
    firebase.database().ref('/services/' + sid).on('value', function (snapshot_1) {
        var service = {
            serviceKey: sid,
            //link: snapshot_1.child('link').val(),
            content: snapshot_1.child('content').val(),
            image: snapshot_1.child('imageUrl').val(),
            title: snapshot_1.child('title').val()
        };
        serviceCallBack(service);
    });
}