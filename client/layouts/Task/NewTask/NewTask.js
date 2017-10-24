
Template.NewTask.events({ 
'submit .new-task-form': function(event, template) {
    
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const id = FlowRouter.getParam('id');
    const current_class = Classes.findOne({_id: id});
    const new_enrollment = {name: target.name.value, description: target.description.value, points: target.points.value, grade: target.grade.checked, class_id: current_class._id};
    console.log(new_enrollment);
    Meteor.call('tasks.insert', new_enrollment, (error, result) => {
            if(!error){
                $('#new-task').modal('close');
                template.find(".new-task-form").reset();
            }
        
        });
         
    }
}); 