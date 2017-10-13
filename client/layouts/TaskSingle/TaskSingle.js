Template.TaskSingle.onCreated(function() {
    const self = this;
    const task_id = FlowRouter.getParam('task_id');
    self.autorun(function() { 
        self.subscribe('enrollment-task',task_id);
    });
});

Template.TaskSingle.helpers({
    taskChecklist(){
        return Enrollments.find({});
    },

    taskDone(enrollment_id){
        console.log(Enrollments.findOne({_id: enrollment_id}).tasks[0].done)
        return Enrollments.findOne({_id: enrollment_id}).tasks[0].done;
    },

    taskName(){
         console.log(Enrollments.findOne({}).tasks);
         return Enrollments.findOne({}).tasks[0];
    }
});

Template.TaskSingle.events({ 
    'click .toggle-done' () {
        const task_id = FlowRouter.getParam('task_id');
        Meteor.call('enrollments.markDone', this._id, task_id, !this.tasks[0].done);
         
    } 
});