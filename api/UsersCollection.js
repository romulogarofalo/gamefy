import { Meteor } from 'meteor/meteor'

Dates = new Mongo.Collection('dates');

Meteor.methods({ 
    'user.create': function (new_user){
        let starting_password = Math.random().toString(36).substr(2, 8);
        let userId = Accounts.createUser({name: new_user.name, email: new_user.email, password: starting_password, verificacao: false});
        let email = new_user.email;
        console.log(starting_password);
        console.log(userId);
        if (Meteor.isServer) {
            Email.send({
                to: email,
                from: "noreply@gamify.com",
                subject: "Confirmação de conta - Gamify",
                html: '<p>Senha provisória:<strong>'+ starting_password +'</strong>.</p> <a href="http://localhost:3000/verify-email/'+ userId +'">Link para confirmação:</a>',
            });
        }
    },

    'user.confirm': function (userId){
            const current_time = new Date();
            const creation_time = Meteor.users.findOne({_id: userId}).createdAt;
            const diffMs = current_time - creation_time;
            const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
            if(diffMins >= 2){ 
                console.log('errrrou');
                Meteor.users.remove({_id: userId});   
                throw new Meteor.Error(500, 'password expired');
            }
            Meteor.users.update({_id: userId}, {$set: {'emails.0.verified': true}});
    },

    'user.reset': function (email){
        let starting_password = Math.random().toString(36).substr(2, 8);
        let userID = Meteor.users.findOne({'emails.0.address': email})._id;
        console.log(starting_password);
        console.log(userID);
        if(Dates.findOne({user_id: userID})){
            Dates.update({user_id: userID}, {$set: {createdAt: new Date()}});
        }
        else{
            Dates.insert({user_id: userID, createdAt: new Date()});
        }
        Accounts.setPassword(userID, starting_password)
        if (Meteor.isServer) {
            Email.send({
                to: email,
                from: "noreply@gamify.com",
                subject: "Redefinição de senha - Gamify",
                html: '<p>Senha provisória:<strong>'+ starting_password +'</strong>.</p> <a href="http://localhost:3000/reset-password/' + userID +'">Link para redefinição:</a>',
            });
        }
    },

    'user.confirm-reset': function(userID){
            const current_time = new Date();
            const creation_time = Dates.findOne({user_id: userID}).createdAt;
            const diffMs = current_time - creation_time;
            const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
            if(diffMins >= 2){   
                throw new Meteor.Error(500, 'password expired');
            }
    },

    'add-role': function(user) {
        Roles.addUsersToRoles(user._id, user.profile.role);     
    } 
});