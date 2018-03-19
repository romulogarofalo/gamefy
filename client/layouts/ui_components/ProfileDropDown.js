Template.ProfileDropDown.onRendered(function () {
    //crio e configuro o dropdown no perfil do usuario
     $('.dropdown-button').dropdown({
         belowOrigin: true,
         hover: true
     })
     $('.modal').modal();
});

Template.ProfileDropDown.events({ 
    'click .logout': ()=>{ 
         FlowRouter.go('/logout');
    }, 

    'click .delete-user': () =>{
        $('#delete-user').modal('open')
    },

    'click .avatar': () =>{
        $('#edit-avatar').modal('open')
    }
}); 
