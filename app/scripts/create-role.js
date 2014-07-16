function createRole() {
    var currentUser = Parse.User.current();
    var query = new Parse.Query(Parse.Role);

    query.equalTo('name', 'GroupAdmin');

    query.first().then(function(role) {
        role.getUsers().add(currentUser);
        return role.save();
    }).then(function(role) {
        alert('role creation done');
        getUser();
    }, function(error){
        window.alert("Error: " + error.code + ":"+ error.message);
    });
}

function getUser() {
    var query = new Parse.Query(Parse.User);

    query.get(Parse.User.current.id, {
        success: function(returnObj) {
            alert(returnObj.get("username"));
            getRole(returnObj);
        },
        error: function(returnObj, error) {
            window.alert("Error: " + error.code + ":"+ error.message);
        }
    });
}

function getRole(user) {
    var query = new Parse.Query(Parse.Role);

    query.equalTo("name", "GroupAdmin");

    query.get(null, {
        success: function(returnObj) {
            alert("found role: "+ returnObj.id + ' '+returnObj.get("name"));
            returnObj.getUsers().add(user);
            updateRole(returnObj);
        },
        error: function(returnObj, error) {
            window.alert("Failed with error: " + error.code + ":"+ error.message);
        }
    });
}

function updateRole(role) {
    role.save(null, {
        success: function(saveObject) {
            alert('update role done');
        },
        error: function(saveObject, error) {
            window.alert("Error: " + error.code + ":"+ error.message);
        }
    });
}