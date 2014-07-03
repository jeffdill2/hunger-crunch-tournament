function createRole() {
var roleACL = new Parse.ACL();
roleACL.setWriteAccess("Administrator",true); 
roleACL.setPublicReadAccess(true);
var role = new Parse.Role("Administrator", roleACL);
role.getUsers().add(Parse.User.current());

role.save(null, {
    success: function(saveObject) {
        // The object was saved successfully.
        alert('role creation done');
        getUser(); 
     },
     error: function(saveObject, error) {
        // The save failed.
        window.alert("Failed creating role with error: " + error.code + ":"+ error.message);
        //assignRoles();
     }
});
}

function getUser() {

var query = new Parse.Query(Parse.User);
query.get("maMVD1fwLs",{
    success: function(returnObj) {
        alert(returnObj.get("username"));
        getRole(returnObj);
    },
    error: function(returnObj, error) {
        window.alert("Failed with error: " + error.code + ":"+ error.message);
    } 
});
}

function getRole (user) {

var query = new Parse.Query(Parse.Role);
query.equalTo("name", "Administrator");

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
        // The object was saved successfully.
        alert('update role done'); 
    },
    error: function(saveObject, error) {
        // The save failed.
        window.alert("Failed with error: " + error.code + ":"+ error.message);
    }
});
}