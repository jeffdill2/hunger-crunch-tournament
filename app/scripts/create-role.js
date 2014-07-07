function createRole() {
// var roleACL = new Parse.ACL();
// roleACL.setWriteAccess(Parse.User.current(), true);
// roleACL.setPublicReadAccess(true);
// var role = new Parse.Role("GroupAdmin", roleACL);

// var roleACL = new Parse.ACL();
// roleACL.setRoleWriteAccess(role,true);
// roleACL.setPublicReadAccess(true);

    var currentUser = Parse.User.current();

    var query = new Parse.Query(Parse.Role);
    query.equalTo('name', 'GroupAdmin');
    query.first().then(function(role){
      role.getUsers().add(currentUser);
      return role.save();
    }).then(function(role){
        // The object was saved successfully.
        alert('role creation done');
        getUser(); 
    }, function(error){
        // The save failed.
        window.alert("ln19: Failed creating role with error: " + error.code + ":"+ error.message);
        //assignRoles();
    });

// role.save(null, {
//     success: function(saveObject) {
//         // The object was saved successfully.
//         alert('role creation done');
//         getUser(); 
//      },
//      error: function(saveObject, error) {
//         // The save failed.
//         window.alert("ln19: Failed creating role with error: " + error.code + ":"+ error.message);
//         //assignRoles();
//      }
// });
}

function getUser() {

var query = new Parse.Query(Parse.User);
query.get( Parse.User.current.id,{
    success: function(returnObj) {
        alert(returnObj.get("username"));
        getRole(returnObj);
    },
    error: function(returnObj, error) {
        window.alert("ln34: Failed with error: " + error.code + ":"+ error.message);
    } 
});
}

function getRole (user) {

var query = new Parse.Query(Parse.Role);
query.equalTo("name", "GroupAdmin");

query.get(null, {
    success: function(returnObj) {
        alert("found role: "+ returnObj.id + ' '+returnObj.get("name"));
        returnObj.getUsers().add(user);
        updateRole(returnObj);
    },
    error: function(returnObj, error) {
        window.alert("ln51: Failed with error: " + error.code + ":"+ error.message);
    }
});         
}

function updateRole(role) {

role.save(null, {
    success: function(saveObject) {
        // The object was saved successfully.
        alert('update role done'); 
    },
    error: function(saveObject, error) {
        // The save failed.
        window.alert("ln65: Failed with error: " + error.code + ":"+ error.message);
    }
});
}