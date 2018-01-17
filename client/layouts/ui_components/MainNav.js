Template.MainNav.onRendered(function () {
    //crio e configuro o dropdown no perfil do usuario
     $('.dropdown-button').dropdown({
         belowOrigin: true,
         hover: true
     })
});

Template.MainNav.helpers({
    username: ()=> {
        return Meteor.user().profile.name       
    }
});


Template.MainNav.events({ 
    'click .logout': ()=>{ 
         FlowRouter.go('/logout');
    } 
}); 
