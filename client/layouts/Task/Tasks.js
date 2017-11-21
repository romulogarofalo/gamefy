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

    tasksTeacher: ()=>{
        return Tasks.find({}); 
    },

    tasksStudent: ()=>{
        return Enrollments.findOne().tasks
    },

    taskName: (task_id) =>{
        console.log(Tasks.findOne({_id: task_id}).name)
        return Tasks.findOne({_id: task_id}).name
    },

    dateFormat: (task_id) =>{
        const date =  Tasks.findOne({_id: task_id}).due
        console.log(date);
        const options = {weekday: "long", year: "numeric", month: "numeric", day: "numeric"};
        console.log(date.toLocaleDateString());
        return date.toLocaleDateString('pt-BR', options);
    },

    taskDone: (task_id) =>{
        let tasks =  Enrollments.findOne({}).tasks;
        let done = tasks.filter(function(value){
            return value.task_id === task_id
            })[0].done;
        console.log(done);
        return done
    }
});

Template.Tasks.events({ 
    'click .delete-task': function(event, template) { 
        if(confirm("Deseja mesmo deletar essa tarefa?"))
        {
            Meteor.call('tasks.delete', event.target.id, function(error, success) { 
                if (error) { 
                    alert('Você não pode excluir essa tarefa porque algum aluno já realizou-a')
                } 
                if (success) { 
                    Materialize.toast('Tarefa Excluida com Sucesso!', 3000);      
                }
            });
        }
    } 
});