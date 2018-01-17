Template.StudentTask.helpers({

    //retorno a nota do estudante ao qual aquele elemento se refere
    getGrade(){
        const instance = Template.instance();
        return instance.data.tasks[0].grade;
    },

    //retorno se a tarefa já passou do prazo ou não
    taskDue(){
        let date = new Date()
        date.setHours(0,0,0,0);
        return Tasks.findOne({}).due < date
    },


    taskDone(enrollment_id){
        return Enrollments.findOne({_id: enrollment_id}).tasks[0].done;
    },

    //verifico se a tarefa possui nota ou não
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