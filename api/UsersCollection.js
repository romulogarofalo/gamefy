Meteor.methods({
    //adiciono o usuário que acabou de se cadastrar a role escolhida 
    'add-role': function(user) {
        Roles.addUsersToRoles(user._id, user.profile.role);     
    } ,

    'edit-avatar': function (avatar) {
        Meteor.users.update({_id:Meteor.user()._id}, { $set: {'profile.avatar': avatar} });
    },

    'user.delete': function (password) {

        const userId = Meteor.userId()

        if(Roles.userIsInRole(Meteor.user(), ['student'])){
            Enrollments.remove({student_id: userId});
        }
        else{
            Classes.find({owner: userId}).fetch().forEach(function (one_class) {
                Enrollments.remove({class_id: one_class._id})
            })
        }
        Meteor.users.remove({_id: userId});
    }

});