import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});



AccountsTemplates.configure({
  postSignUpHook: function(userId, info){
    let user = Meteor.users.findOne({_id: userId});
    console.log(user);
    Meteor.call('add-role', user);
    },
});
