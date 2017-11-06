Template.signUp.onRendered(function () {
    $('select').material_select();
});

Template.signUp.events({ 
    'submit .signup-form': function(event, template) { 
        event.preventDefault();
        const target = event.target;
        const new_user = {email: target.email.value, name: target.name.value, role: target.role.value};
        Meteor.call('user.create', new_user);
    }
});