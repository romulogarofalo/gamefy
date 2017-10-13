Template.NewEnrollment.events({ 
    'submit .new-enrollment-form': function(event, template) {
    
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const id = FlowRouter.getParam('id');
    const current_class = Classes.findOne({_id: id});
    const new_enrollment = {student_name: target.name.value, class_id: current_class._id};
    Meteor.call('enrollments.insert', new_enrollment, (error, result) => {
        if(error){
            $('#student-name').addClass('invalid');
        }
        else{
            $('#new-enrollment').modal('close');
            template.find(".new-enrollment-form").reset();

        }
    });
         
    } 
});