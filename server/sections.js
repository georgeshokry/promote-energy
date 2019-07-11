/**
 * Created by Peter on 13/11/2017.
 * Updated by basel on 16/11/2017
 */
/*var sectionImageFile;
function changeSliderName(event) {
    sectionImageFile = this.event.target.files[0];
}*/


// add section //checked
/*function createSection(sectionName, sectionObject, sectionImageFile, assignLogMsg) {
    /*var obj = {
        title: {
            ar: "تايتل تست",
            en: "test2 title"
        },
        content: {
            ar: "يستلاس",
            en: "csdcsdcsdc2"
        }
    }
    var link = {
        linkName: sectionObject.title.en,
        link: sectionName,
        ar: sectionObject.title.ar,
    }
    addNavLink(link, function (msg1) {
        firebase.database().ref('/sections/' + sectionName).set(sectionObject).then(function () {
            var uploadTask = firebase.storage().ref('/images/specialSections/' + sectionName).put(sectionImageFile);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress);
            }, function (error) {
                console.log("error in uploading");
            }, function () {
                firebase.database().ref('/sections/' + sectionName).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                    // assignlogmsg("done");
                }).catch(function (error) {
                    //assignlogmsg("error");
                })
            });
        }).catch(function (error) {
            if (error) {
                //assignLogMsg("error");
            }
        });
    });
}



//get special sections //checked
function getSpecialSections(sectionsCallBack) {
    firebase.database().ref('/sections').on('value', function (snapshot_1) {
        var sections = [];
        snapshot_1.forEach(function (section) {

            if (section.key != 'slider' && section.key != 'aboutUs'
                && section.key != 'projects' && section.key != 'contactUs') {

                sections[section.key] = ({
                    title: section.child('title').val(),
                    imageUrl: section.child('imageUrl').val(),
                    content: section.child('content').val()
                });
            }
        });
        sectionsCallBack(sections);
    });
}*/


//get static sections //checked
function getStaticSections(sectionsCallBack) {
    firebase.database().ref('/sections').on('value', function (snapshot_1) {
        var sections = [];
        snapshot_1.forEach(function (section) {

            if (section.key == 'slider' || section.key == 'aboutUs'
                || section.key == 'projects' || section.key == 'contactUs') {

                sections[section.key] = section.val();

            }
        });
        sectionsCallBack(sections);
    });
}



// get all sections //checked
/*function getAllSections(sectionsCallBack) {
    var sections = {};
    getSpecialSections(function (specialSections) {
        sections['special'] = specialSections;
        getStaticSections(function (staticSections) {
            sections['static'] = staticSections;
            sectionsCallBack(sections);
        })
    });
}*/



//edit section checked
function editSection(sectionName, editedPart, sectionObject, assignlogmsg) {
    if (sectionName != "" && editedPart != "") {
        //updated object
        var obj = {
            title: {
                ar: "مشاريعنا",
                en: "projects"
            },
            content: {
                ar: "راتلاسراتلاس",
                en: "content 3"
            },
            email: {
                ar: "الايميل",
                en: "email"
            }
        }
        firebase.database().ref('/sections/' + sectionName).child(editedPart).set(sectionObject).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        });
    } else {
        assignlogmsg("check your section info");
    }
}



// edit section image //checked
function editSectionImage(sectionName, sectionImageFile, assignlogmsg) {
    var size = 700 * 1024;
    if (sectionName != "" && sectionImageFile != undefined && sectionImageFile.size <= size) {
        if (sectionName == 'projects') {
            var uploadTask = firebase.storage().ref('/images/projects.jpg').put(sectionImageFile);
        }
        else {
            var uploadTask = firebase.storage().ref('/images/' + sectionName).put(sectionImageFile);
        }
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/sections/' + sectionName).child('imageUrl').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                assignlogmsg("error");
            })
        });
    } else {
        assignlogmsg("section image is too large");
    }
}


