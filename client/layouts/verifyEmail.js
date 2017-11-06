Template.verifyEmail.onCreated(function() {
    const self = this;
    const user_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('verify-user', user_id);
    });
});

Template.verifyEmail.events({ 
    'submit .password-form': function(event, template) { 
        event.preventDefault();
         const target = event.target;
         const old_password = target.old_password.value;
         const new_password = target.new_password.value
         const confirm_password = target.confirm_password.value
         const email = Meteor.users.findOne().emails[0].address;
         Meteor.call('user.confirm', FlowRouter.getParam('id'), function(){
            console.log(old_password);
            console.log(email);
            Meteor.loginWithPassword(email, old_password);
            Accounts.changePassword(old_password, new_password);
            Accounts.changePassword(new_password, confirm_password);
            Meteor.logout();
         });
    } 
});