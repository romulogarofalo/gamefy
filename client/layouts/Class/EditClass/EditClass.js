Template.EditClass.events({
    'click #cancela': function (event, instance) {
        event.preventDefault();
        $('#edit-class').modal('close');
    },

    'submit .edit-class-form': function (event, template) {
        console.log('oi')
        event.preventDefault();
        let nome = $('#nomeClasse').val();
        let desc = $('#descricaoClasse').val();
        //TO DO: trocar o span por um input type=hidden 
        let idClasse = document.querySelector('#spanId').textContent;
        Meteor.call('classes.update', nome,desc,idClasse);
        Materialize.toast('Classe Editada com Sucesso!', 3000);
        template.find(".edit-class-form").reset();
        $('#edit-class').modal('close');

    }
});
