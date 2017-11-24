import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  process.env.MAIL_URL = "smtp://postmaster%40sandboxcc7887c70bc847928384a748163de249.mailgun.org:1327c7de8993a54f1df886f6ff6d5365@smtp.mailgun.org:587";
});

Accounts.validateLoginAttempt(function(user){
    console.log(user);
    console.log(user.user._id);
    let id = user.user._id;
    let verified = Meteor.users.findOne({_id: id}).emails[0].verified;
    if(verified){
        return true;
    }
    else{
      return false;
    }
});


AccountsTemplates.configure({
  postSignUpHook: function(userId, info){
    let user = Meteor.users.findOne({_id: userId});
    console.log(user);
    Meteor.call('add-role', user);
    },
});
