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

    createdAt:{
        type: Date,
        autoValue: function(){
            return new Date()
        }
    }
});

 Meteor.methods({ 
    'tasks.insert'(new_task) {
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
            throw new Meteor.Error('not-authorized');
        }
        Tasks.insert(new_task);
    }
 });