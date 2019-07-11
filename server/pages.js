// add page //checked
function addPage(pageObj, pageImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (pageImageFile <= size && pageImageFile != undefined) {
        if (pageObj.title.en != "" && pageObj.title.ar != "" && pageObj.title.ar != undefined && pageObj.title.en != undefined) {
            var key = firebase.database().ref('/pages/').push(pageObj).key;
            var uploadTask = firebase.storage().ref('/images/pages/' + key).put(pageImageFile);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                assignlogmsg('Upload is ' + progress.toFixed(0));
            }, function (error) {
                assignlogmsg("error in uploading");
            }, function () {
                firebase.database().ref('/pages/' + key).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                    var link = {
                        ar: pageObj.title.ar,
                        linkName: pageObj.title.en,
                        link: key,
                    }
                    addNavLink(link, function (msg1) {
                        assignlogmsg("done");
                    }).catch(function (error) {
                        assignlogmsg("error");
                    })
                });
            })
        } else {
            assignlogmsg("check your page info");
        }
    } else {
        assignlogmsg("page image is too large");
    }
}

//edit page checked
function editPage(sid, editedPart, deletedLink, pageObject, assignlogmsg) {
    if (sid != "" && editedPart != "" && editedPart != undefined && deletedLink != "" && pageObject.ar != "" && pageObject.en != "") {
        if (editedPart == 'title') {
            firebase.database().ref('/pages/' + sid).child(editedPart).set(pageObject).then(function () {
                var newLink = {
                    linkName: pageObject.en,
                    ar: pageObject.ar,
                    link: sid
                };
                editSpecialNavLink(deletedLink, newLink, function (assignlogmsg) {
                    assignlogmsg(assignlogmsg);
                });

            }).catch(function (error) {
                if (error) {
                    assignlogmsg("error");
                }
            });
        }
        else {
            firebase.database().ref('/pages/' + sid).child(editedPart).set(pageObject).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                if (error) {
                    assignlogmsg("error");
                }
            });
        }
    } else {
        assignlogmsg("check your page info");
    }
}

// edit page image //checked
function editPageImage(sid, pageImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (sid != "" && pageImageFile != undefined && pageImageFile.size <= size) {
        var uploadTask = firebase.storage().ref('/images/pages/' + sid).put(pageImageFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/pages/' + sid).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                assignlogmsg("error");
            })
        });
    } else {
        assignlogmsg("image is too large");
    }
}


//delete page with its navlink //checked
function deletePage(sid, linkName, assignlogmsg) {
    if (sid != "" && linkName != "" && linkName != undefined) {
        firebase.database().ref('/pages/' + sid).remove().then(function () {
            firebase.storage().ref('/images/pages/' + sid).delete().then(function () {
                deleteNavLink(linkName, function (msg) {
                    assignlogmsg(msg);
                })
            })
        })
    } else {
        assignlogmsg("check your deleted link");
    }
}


//get page by id //checked
function getPage(sid, pageCallBack) {
    firebase.database().ref('/pages/' + sid).on('value', function (snapshot_1) {
        page = {
            pageKey: sid,
            link: snapshot_1.child('link').val(),
            content: snapshot_1.child('content').val(),
            image: snapshot_1.child('imageUrl').val(),
            title: snapshot_1.child('title').val()
        };
        console.log(page);
        pageCallBack(page);
    });
}