import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Tasks = new Mongo.Collection('tasks');

//crio a collection de tarefas
TaskSchema = new SimpleSchema({

    name: {
        type: String,
    },

    description:{
        type: String,
    },

    points:{
        type: Number,
    },

    class_id:{
        type: String
    },
    

    grade:{
        type: Boolean
    },

    due:{
        type: Date
    },

    students:{
        type: Array,
    },

    'students.$':{
        type: String,
    },

    createdAt:{
        type: Date,
        autoValue: function(){
            return new Date()
        }
    }
});

Tasks.attachSchema(TaskSchema);

 Meteor.methods({ 
    'tasks.insert'(new_task) {

        ///verifico login e autorização
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
            throw new Meteor.Error('not-authorized');
        }

        Tasks.insert(new_task, function(err, task_id){

            //após inserir a tarefa, adiciono-a nos arrays de tarefas de cada matricula daquela classe
            let inserted_task = Tasks.findOne({_id: task_id});
            Enrollments.update({class_id: inserted_task.class_id}, { $push: 
                {tasks: { task_id: inserted_task._id , due: inserted_task.due, done: false, max_points: inserted_task.points}}
            }, { multi: true });
        });
    },

    'tasks.update' (name, desc, task_id){
         if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');
        console.log(Tasks.findOne({_id: task_id}))
         Tasks.update({ _id: task_id }, {
            $set: {
                name: name,
                description: desc,
            }
        });
    },

    'tasks.delete' (task_id, class_id){
        //verifico se a tarefa não foi realizada por algum estudante. Caso tenha sido, impeço a operação
        if(Tasks.findOne({_id: task_id}).students.length > 0)
            throw new Meteor.Error(500, 'task-done');

        //removo as tarefas da collection de tarefas e dos arrays de tarefas na collection de matriculas
        Tasks.remove(task_id);
        Enrollments.update({class_id: class_id}, { $pull: 
        {tasks: {task_id: task_id}}}, { multi: true });
    }
 });