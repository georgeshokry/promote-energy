/**
 * Created by Peter on 13/11/2017.
 */

function signInUser(email, password, assignUserStat) {
    var logMsg;
    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                document.cookie = user.uid;
                console.log(document.cookie);
                logMsg = 'logged in';
                assignUserStat(logMsg);
                getSignedUser();
            }
        });
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;

        if (errorCode === 'auth/wrong-password') {
            logMsg = 'wrong password';
            assignUserStat(errorCode);
        } else if (errorCode === 'auth/user-not-found') {
            logMsg = 'wrong email';
            assignUserStat(errorCode);
        }
        else {
            console.log(errorMessage);
        }

    });
}


function getSignedUser(assign) {
    var user = firebase.auth().currentUser;
    assign(user);
    console.log(user);
    // firebase.auth().onAuthStateChanged(function (user) {
    //     var cok = document.cookie;
    //     console.log(cok);
    //     if (user) {
    //         console.log(user.uid);
    //         console.log(user.email);
    //         assign(user);
    //     } else {
    //         assign(user);
    //     }
    // });
}

///sign out function///
function signOutUser() {
    var logMsg;
    firebase.auth().signOut().then(function () {
        logMsg = 'Logged Out';
        document.cookie = "";
        console.log(logMsg);
    }).catch( function (error) {
        logMsg = 'Error';
        console.log(logMsg);
    });
}

function checkSignIn(assignLogCok) {
    var cok = document.cookie;
    assignLogCok(cok);
}