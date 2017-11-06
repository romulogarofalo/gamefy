import { Meteor } from 'meteor/meteor'

Meteor.methods({ 
    'user.create': function (new_user){
        let starting_password = Math.random().toString(36).substr(2, 8);
        let userId = Accounts.createUser({name: new_user.name, email: new_user.email, password: starting_password, verificacao: false});
        let email = new_user.email;
        Email.send({
            to: email,
            from: "noreply@gamify.com",
            subject: "Confirmação de conta - Gamify",
            html: '<p>Senha provisória:<strong>'+ starting_password +'</strong>.</p> <a href="http://localhost:3000/verify-email/'+ userId +'">Link para confirmação:</a>',
        });
    },

    'user.confirm': function (userId){
            Meteor.users.update({_id: userId}, {$set: {'emails.0.verified': true}});
    },

    'add-role': function(user) {
        Roles.addUsersToRoles(user._id, user.profile.role);     
    } 
});