Template.EditTest.events({
    'click #cancel': function (event, instance) {
        event.preventDefault();
        $('#edit-test').modal('close');
    },

    'click #update': function (event, template) {
        event.preventDefault();
        let name = $('#name-test').val();
        let points = $('#points-test').val();
        let desc = $('#description-test').val();
        let test_id = $('#test-id').val();
        console.log(test_id)
        Meteor.call('tests.update', name, points, desc, test_id, function(error, success) { 
            if (error.error === 'test-already-published') { 
                alert('Este teste já foi publicado e não pode ser mais editado');
            } 
            if (success) { 
                 Materialize.toast('Questionário Editado com Sucesso!', 3000);  
            }
            template.find(".edit-test-form").reset();
            $('#edit-test').modal('close'); 
        });
    }
});