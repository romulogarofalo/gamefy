Template.EditTest.events({
    'click #cancel': function (event, instance) {
        event.preventDefault();
        $('#edit-test').modal('close');
    },

    'submit .edit-test-form': function (event, template) {
        event.preventDefault();
        let name = $('#name-test').val();
        let points = $('#points-test').val();
        let desc = $('#description-test').val();
        let test_id = $('#test-id').val();
        Meteor.call('tests.update', name, points, desc, test_id, function(error, success) {
            if(error){ 
                alert('Este teste já foi publicado e não pode ser mais editado');
            } 
            else{ 
                 Materialize.toast('Questionário Editado com Sucesso!', 3000);  
            }
            template.find(".edit-test-form").reset();
            $('#edit-test').modal('close'); 
        });
    }
});