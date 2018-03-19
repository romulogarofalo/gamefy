Template.DeleteUser.events({
    'submit .delete-user-form': function (event, template) {
		event.preventDefault();

		const password = event.target.password.value;
        Accounts.changePassword(password, password, function (error) {
           if(!error){
                Meteor.call('user.delete', password, function (params){
                     FlowRouter.go('/logout');
                });
           }  
        });    
        template.find(".delete-user-form").reset();
		$('#delete-user').modal('close');
    }
});