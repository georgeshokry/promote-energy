//add special link to navbar //checked
function addNavLink(linkObj, assignlogmsg) {
    if (linkObj.linkName != "" && linkObj.ar != "" && linkObj.link != "" && linkObj.link != undefined) {
        var linkName = linkObj.linkName;
        var obj = {
            ar: linkObj.ar,
            link: linkObj.link
        }
        firebase.database().ref('/navbar/specialLinks/' + linkName).set(obj).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        })
    } else {
        assignlogmsg("check your inputs");
    }
}


//upload logo and put the link in database //checked
function editNavLogo(selectedLogoFile, assignlogmsg) {
    var size = 700 * 1024;
    if (selectedLogoFile != undefined && selectedLogoFile.size <= size) {
        var uploadTask = firebase.storage().ref('/images/logo.jpg').put(selectedLogoFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload Pic is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/navbar/logo').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                if (error) {
                    assignlogmsg("error");
                }
            });
        });
    } else {
        assignlogmsg("logo image is too large");
    }
}

//upload logo icon and put the link in database //checked
function editTabIcon(selectedIconFile, assignlogmsg) {
    var size = 700 * 1024;
    if (selectedIconFile != undefined && selectedIconFile.size <= size) {
        var uploadTask = firebase.storage().ref('/images/icon.jpg').put(selectedIconFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            assignlogmsg('Upload Icon is ' + progress.toFixed(0));
        }, function (error) {
            assignlogmsg("error in uploading");
        }, function () {
            firebase.database().ref('/navbar/icon').set(uploadTask.snapshot.downloadURL).then(function () {
                assignlogmsg("done");
            }).catch(function (error) {
                if (error) {
                    assignlogmsg("error");
                }
            });
        });
    } else {
        assignlogmsg("logo icon is too large");
    }
}

//delete navlink
function deleteNavLink(linkName, assignlogmsg) {
    if (linkName != "") {
        firebase.database().ref('/navbar/specialLinks/' + linkName).remove().then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            if (error) {
                assignlogmsg("error");
            }
        });
    } else {
        assignlogmsg("check deleted link name")
    }
}

//edit static link in navbar /checked
function editStaticNavLink(linkNumber, linkObj, assignlogmsg) {
    if (linkNumber != "" && linkObj.link != "" && linkObj.link != undefined && linkObj.linkName != "" && linkObj.ar != "") {
        var obj = {
            ar: linkObj.ar,
            en: linkObj.linkName,
            link: linkObj.link,
        };
        ///en(deleted), ar, linkName(new en), link(href)
        firebase.database().ref('/navbar/staticLinks/' + linkNumber).set(obj).then(function () {
            assignlogmsg("done");
        }).catch(function (error) {
            assignlogmsg("error");
        });
    } else {
        assignlogmsg("please check your link info");
    }
}


//edit special link in navbar /checked
function editSpecialNavLink(deletedName, linkObj, assignlogmsg) {
    if (linkObj.link != "" && linkObj.link != undefined && linkObj.linkName != "" && linkObj.ar != "") {
        var obj = {
            ar: linkObj.ar,
            link: linkObj.link
        };
        firebase.database().ref('/navbar/specialLinks/' + deletedName).remove().then(function () {
            firebase.database().ref('/navbar/specialLinks/' + linkObj.linkName).set(obj);
        }).catch(function (error) {

            if (error) {
                assignlogmsg("error");
            }
        });
    } else {
        assignlogmsg("check link info");
    }
}


//get navbar links  //checked
function getNavbar(navbar) {
    firebase.database().ref('/navbar/staticLinks').on('value', function (snapshot_1) {
        var links = [];
        links['static'] = [];
        snapshot_1.forEach(function (link) {
            links['static'].push({
                linkNumber: link.key,
                linkName: link.child('en').val(),
                arValue: link.child('ar').val(),
                link: link.child('link').val(),
            });
        });
        firebase.database().ref('/navbar/specialLinks').on('value', function (snapshot_1) {
            links['special'] = [];
            snapshot_1.forEach(function (link) {
                links['special'].push({
                    linkName: link.key,
                    arValue: link.child('ar').val(),
                    link: link.child('link').val(),
                });
            });
            navbar(links);
        });
    });
}
//get logo  //checked
function getNavLogo(navLogoCallBack) {
    firebase.database().ref('/navbar/logo').on('value', function (snapshot_1) {
        navLogoCallBack(snapshot_1.val());
    });
}