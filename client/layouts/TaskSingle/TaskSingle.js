//pego os parametros da url e me inscrevo nas publishs necessárias
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
         return Tasks.findOne({}).name;
    },

    taskDescription(){
         return Tasks.findOne({}).description;
    },

    dateFormat: () =>{
        const date =  Tasks.findOne({}).due
        const options = {weekday: "long", year: "numeric", month: "numeric", day: "numeric"};
        return date.toLocaleDateString('pt-BR', options);
    },
    
    taskClass(){
        return Tasks.findOne({}).class_id;
    }
});