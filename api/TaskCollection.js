import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Tasks = new Mongo.Collection('tasks');

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
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
            throw new Meteor.Error('not-authorized');
        }
        Tasks.insert(new_task, function(err, task_id){
            let inserted_task = Tasks.findOne({_id: task_id});
            Enrollments.update({class_id: inserted_task.class_id}, { $push: 
                {tasks: { task_id: inserted_task._id ,name: inserted_task.name, done: false, max_points: inserted_task.points}}
            }, { multi: true });
        });
    }
 });