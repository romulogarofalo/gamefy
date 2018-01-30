Template.NewTest.events({

'submit .new-test-form': function(event, template) {
    
    event.preventDefault();
 
    const target = event.target;
    const id = FlowRouter.getParam('id');
    const current_class = Classes.findOne({_id: id});

    //crio o objeto questionario para enviar para o servidor
    const new_test = {
        name: target.name.value, 
        description: target.description.value, 
        points: target.points.value, 
        class_id: current_class._id, 
    };

    //chamo o metodo insert na API TestCollection no servidor
    Meteor.call('tests.insert', new_test, (error, result) => {
            if(!error){
                $('#new-test').modal('close');
                template.find(".new-test-form").reset();
            }
        });
         
    }
}); 