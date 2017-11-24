Template.startReset.events({ 
    'submit .start-reset-form': function(event, template) { 
        event.preventDefault();
        const target = event.target;
        const email = target.email.value;
        Meteor.call('user.reset', email, function(error){
            if(error){
                alert("Esse e-mail não está cadastrado no sistema");
            }
            else{
                alert("Um e-mail para redefinição de sua senha foi enviado. Verifique sua caixa de entrada");
            }
        });
    }
});