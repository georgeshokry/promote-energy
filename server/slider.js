//function to add slider //checked
function addSlider(sliderObj, sliderImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (sliderImageFile.size <= size && sliderImageFile != undefined) {
        if (sliderObj.title.ar != "" && sliderObj.title.en != "" && sliderObj.content.en && sliderObj.content.ar && sliderObj.link.ar != "" && sliderObj.link.en) {
            /*var obj = {
                link: {
                    ar: "ترايلاسات",
                    en: "slider3 link",
                    reference: "link reference"
                },
                title: {
                    ar: "slider3",
                    en: "سليدر3"
                },
                content: {
                    ar: "سليدر كونتنت",
                    en: "slider3 content"
                }
            }*/
            var key = firebase.database().ref('/sections/slider/').push(sliderObj).key;
            var uploadTask = firebase.storage().ref('/images/sliders/' + key).put(sliderImageFile);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                assignlogmsg('Upload is ' + progress.toFixed(0));
            }, function (error) {
                assignlogmsg("error in uploading");
            }, function () {
                firebase.database().ref('/sections/slider/' + key).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                    assignlogmsg("done");
                }).catch(function (error) {
                    assignlogmsg("error");
                })
            });
        } else {
            assignlogmsg("check slider info");
        }
    } else {
        assignlogmsg("slider image is too large");
    }
}

//function to delete slider //checked
function deleteSlider(Sid, assignlogmsg) {
    if (Sid != "") {
        firebase.database().ref('/sections/slider/' + Sid).remove().then(function () {
            firebase.storage().ref('/images/sliders/' + Sid).delete().then(function () {
                assignlogmsg("deleted");
            }).catch(function (error) {
                assignlogmsg("error");
            });
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        })
    } else {
        assignlogmsg("check slider id");
    }
}

//function to edit slider //checked
function editSlider(Sid, editedPart, Obj, assignlogmsg) {
    if (Sid != "" && editedPart != "" && Obj.ar != "" && Obj.en != "") {
        firebase.database().ref('/sections/slider/' + Sid).child(editedPart).set(Obj
        ).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        })
    } else {
        assignlogmsg("check slider info");
    }
}

//edit slider image //checked
function editSliderImage(Sid, sliderImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (Sid != "" && sliderImageFile != undefined && sliderImageFile.size <= size) {
        var uploadTask = firebase.storage().ref('/images/sliders/' + Sid).put(sliderImageFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/sections/slider/' + Sid).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                assignlogmsg("error");
            })
        });
    } else {
        assignlogmsg("slider image is too large");
    }
}

//get slider //checked
function getSlider(sliderCallBack) {
    firebase.database().ref('/sections/slider').on('value', function (snapshot_1) {
        var sliderSections = [];
        snapshot_1.forEach(function (sliderSection) {
            sliderSections.push({
                sliderKey: sliderSection.key,
                link: sliderSection.child('link').val(),
                title: sliderSection.child('title').val(),
                imageUrl: sliderSection.child('imageUrl').val(),
                content: sliderSection.child('content').val()
            });
        });
        sliderSections['numOfChild'] = snapshot_1.numChildren();
        sliderCallBack(sliderSections);
    });
}
