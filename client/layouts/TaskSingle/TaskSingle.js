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
    taskName(){
         return Enrollments.findOne({}).tasks[0];
    }
});