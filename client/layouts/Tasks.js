Template.Tasks.onCreated(function() {
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('tasks', class_id);
    });
    this.state = new ReactiveDict();
});

Template.Tasks.helpers({
    addTask: ()=>{
        return function(){
            $('#new-task').modal('open');
      }
    },

    tasks: ()=>{
        return Tasks.find({}); 
    }
});