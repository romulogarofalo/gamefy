Template.StudentTask.helpers({
    getGrade(){
        console.log('aaaaaaa')
        const instance = Template.instance();
        console.log(instance.data.tasks[0].grade)
        return instance.data.tasks[0].grade;
    },

    taskDone(enrollment_id){
        console.log(Enrollments.findOne({_id: enrollment_id}).tasks[0].done)
        return Enrollments.findOne({_id: enrollment_id}).tasks[0].done;
    },

     isTest(){
        return Tasks.findOne({}).grade;
    },
})

Template.StudentTask.events({ 
    'click .toggle-done' (event, template) {
        const task_id = FlowRouter.getParam('task_id');
        let done_parameters = {enrollment_id: this._id, task_id: task_id, set_checked: !this.tasks[0].done};
        console.log(template.$('.rating').data('userrating'));
        if(Tasks.findOne({}).grade && this.tasks[0].done == false){
            done_parameters.grade = template.$('.rating').data('userrating') == null ? 5 : done_parameters['grade'] = template.$('.rating').data('userrating');
        }
        Meteor.call('enrollments.markDone', done_parameters);
             
    } 
});