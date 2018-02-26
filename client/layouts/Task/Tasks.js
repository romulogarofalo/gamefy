Template.Tasks.onCreated(function() {
    //me inscrevo nas publishs necessarias
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('tasks', class_id);
    });
});

Template.Tasks.helpers({
    addTask: ()=>{
        return function(){
            $('#new-task').modal('open');
      }
    },

    tasksTeacher: ()=>{
        return Tasks.find({}, {sort: {createdAt: -1}}); 
    },

    tasksStudent: ()=>{
        return Enrollments.findOne().tasks.reverse()
    },

    taskName: (task_id) =>{
        return Tasks.findOne({_id: task_id}).name
    },

    //retorno a data de entrega da tarefa por extenso em PT-BR
    dateFormat: (task_id) =>{
        const date =  Tasks.findOne({_id: task_id}).due
        const options = {weekday: "long", year: "numeric", month: "numeric", day: "numeric"};
        return date.toLocaleDateString('pt-BR', options);
    },

    //retorno se o estudante realizou uma determinada tarefa
    taskDone: (task_id) =>{
        let tasks =  Enrollments.findOne({}).tasks;

        //filtro o array de tarefas do estudante pois o minimongo não permite projection
        let done = tasks.filter(function(value){
            return value.task_id === task_id
            })[0].done;
        return done
    }
});

Template.Tasks.events({ 
    'click .delete-task': function(event, template) { 
        if(confirm("Deseja mesmo deletar essa tarefa?"))
        {
            //chama o metodo delete da API de tarefas (TasksCollection) passando o id da classe e o id da tarefa 
            Meteor.call('tasks.delete', event.target.id, FlowRouter.getParam('id'), function(error, success) { 
                //TO DO: adicionar situação de user não autorizado aqui e no servidor
                if (error) { 
                    alert('Você não pode excluir essa tarefa porque algum aluno já realizou-a')
                } 
                else{ 
                    Materialize.toast('Tarefa Excluida com Sucesso!', 3000);      
                }
            });
        }
    }, 

    'click .edit-task': function (event, instance) {
        //pego os valores daquele elemento da interface e jogo na modal
        const task_id = event.target.id;
        const task = Tasks.findOne({_id: task_id})
        const name = task.name
        const description = task.description
        $('#edit-task').modal('open');
        document.querySelector('#task-id').value = task_id;
        document.querySelector('#name-task').value = name;
        document.querySelector('#description-task').value = description;
        $('#name').focus();
    },

});