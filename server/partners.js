//edit partners //checked
function editPartners(editedPart, partnerObject, assignlogmsg) {
    if (editedPart != "" && partnerObject.en != "" && partnerObject.ar != "") {
        firebase.database().ref('/partners/').child(editedPart).set(partnerObject).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        });
    } else {
        assignlogmsg("check partner info");
    }
}

//function to edit partners image //checked
function editPartnersImage(partnersImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (partnersImageFile != undefined && partnersImageFile.size <= size) {
        var uploadTask = firebase.storage().ref('/images/partners.jpg').put(partnersImageFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/partners/').child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                assignlogmsg("error");
            })
        });
    } else {
        assignlogmsg("image is too large");
    }
}

//function to add logo in partner //checked
function addPartnersLogo(logoObj, partnersImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (logoObj.href != "" && partnersImageFile != undefined && partnersImageFile.size <= size) {
        var key = firebase.database().ref('/partners/logos/').push(logoObj).key;
        var uploadTask = firebase.storage().ref('/images/partners/' + key).put(partnersImageFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/partners/logos/' + key).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                assignlogmsg("error");
            })
        });
    } else {
        assignlogmsg("image is too large");
    }
}

//edit partners logo //checked
function editPartnersLogo(Sid, logoHref, assignlogmsg) {
    if (Sid != "" && logoHref) {
        firebase.database().ref('/partners/logos/' + Sid).child('href').set(logoHref).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            assignlogmsg("error");
        })
    } else {
        assignlogmsg("chech your logo id");
    }
}

//delete partners logo //checked
function deletePartnersLogo(Sid, assignlogmsg) {
    if (Sid != "") {
        firebase.database().ref('/partners/logos/' + Sid).remove().then(function () {
            firebase.storage().ref('/images/partners/' + Sid).delete().then(function () {
                assignlogmsg("deleted");
            }).catch(function (error) {
                assignlogmsg("error");
            });
        }).catch(function (error) {
            assignlogmsg("error");
        })
    } else {
        assignlogmsg("check you deleted logo");
    }
}

//get partners //checked
function getPartners(partnerCallBack) {
    firebase.database().ref('/partners').on('value', function (snapshot_1) {
        var partners = [];
        partners.push({
            title: snapshot_1.child('title').val(),
            image: snapshot_1.child('imageUrl').val(),
        });
        partners['logos'] = [];
        snapshot_1.child('logos').forEach(function (logo) {
            partners['logos'].push({
                logoKey: logo.key,
                logoImage: logo.child('imageUrl').val(),
                logoHref: logo.child('href').val(),
            });
        });
        partnerCallBack(partners);
    });
}