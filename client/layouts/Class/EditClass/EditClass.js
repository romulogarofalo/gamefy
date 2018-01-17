Template.EditClass.events({
    'click #cancela': function (event, instance) {
        event.preventDefault();
        $('#edit-class').modal('close');
    },

    'click #atualiza': function (event, template) {
        event.preventDefault();
        let nome = $('#nomeClasse').val();
        let desc = $('#descricaoClasse').val();
        //TO DO: trocar o span por um input type=hidden 
        let idClasse = document.querySelector('#spanId').textContent;
        Meteor.call('classes.update', nome,desc,idClasse);
        template.find(".edit-class-form").reset();
        $('#edit-class').modal('close');

    }
});
