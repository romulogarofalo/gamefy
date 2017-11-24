Template.resetPassword.onCreated(function() {
    const self = this;
    const user_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('resetPassword', user_id);
    });
});

Template.resetPassword.events({ 
    'submit .reset-password-form': function(event, template) { 
        event.preventDefault();
         const target = event.target;
         const old_password = target.old_password.value;
         const new_password = target.new_password.value
         const confirm_password = target.confirm_password.value
         if(new_password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)){
         if(confirm_password === new_password)
         {
         const email = Meteor.users.findOne({_id: FlowRouter.getParam('id')}).emails[0].address;
         Meteor.call('user.confirm-reset', FlowRouter.getParam('id'), function(error){
            if(error){
                console.log(error);
                alert("Sua senha expirou. Favor realizar uma nova redefinição");
            }
            else{
                Meteor.loginWithPassword(email, old_password, function(){
                    Accounts.changePassword(old_password, new_password);
                    Accounts.changePassword(new_password, confirm_password);
                    Meteor.logout();
                    alert("Sua conta foi confirmada com sucesso");
                });
          }
        });
      }
      else{
          alert("A senha e sua confirmação não são iguais");
      }
    }
    else{
        alert("A senha deve possuir pelo menos 6 digitos, dentre eles um caracter e um numero")
     }
    },

       'keypress #new-password': function(event) { 
        if(event.target.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)){
            if(event.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)){
                $('#password-strength').css('color', 'green');
                $('#password-strength').text("Forte");
            }
            else{
            $('#password-strength').css('color', 'yellow');
            $('#password-strength').text("Média")
            }
        }
        else{
            $('#password-strength').css('color', 'red');
            $('#password-strength').text("Fraca") 
        }
        $('#password-strength').removeClass("hide")
    } 
});