Meteor.methods({ 
    'add-role': function(user) {
        Roles.addUsersToRoles(user._id, user.profile.role); 
         
    } 
});