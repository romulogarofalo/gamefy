Template.NewTask.onRendered(function () {
    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        //min: new Date(),
        closeOnSelect: false, // Close upon selecting a date,
        onStart: function() {
              var date = new Date()
              this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
        }
    });
    console.log('oi');
});


Template.NewTask.events({ 
'submit .new-task-form': function(event, template) {
    
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const id = FlowRouter.getParam('id');
    const current_class = Classes.findOne({_id: id});
    const new_enrollment = {name: target.name.value, description: target.description.value, points: target.points.value, grade: target.grade.checked, class_id: current_class._id, due: target.due.value, students: []};
    console.log(new_enrollment);
    Meteor.call('tasks.insert', new_enrollment, (error, result) => {
            if(!error){
                $('#new-task').modal('close');
                template.find(".new-task-form").reset();
            }
        
        });
         
    }
}); 