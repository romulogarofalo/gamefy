Meteor.methods({
    //adiciono o usuário que acabou de se cadastrar a role escolhida 
    'add-role': function(user) {
        Roles.addUsersToRoles(user._id, user.profile.role); 
         
    } 
});