import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';


Enrollments = new Mongo.Collection('enrollments');

StudentTaskSchema = new SimpleSchema({
    task_id: {
        type: String,
    },

    name:{
        type: String,
    },

    done:{
        type: Boolean,
    },

    max_points:{
        type: Number,
    },

    points:{
        type: Number,
        optional: true,
    },

});

EnrollmentSchema = new SimpleSchema({
    student_id: {
        type: String,
    },

    student_name: {
        type: String,
    },

    class_id:{
        type: String,
    },

    points:{
        type: Number,
    },

    tasks:{
        type: Array,
        optional: true
    },

    "tasks.$":{
        type: StudentTaskSchema,
    },
    createdAt:{
        type: Date,
        autoValue: function(){
            return new Date()
        }
    }
});

Enrollments.attachSchema(EnrollmentSchema);

if (Meteor.isServer) {
    Meteor.methods({ 
    'enrollments.insert'(enrollment_attempt) {
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
            throw new Meteor.Error('not-authorized');
        }

            let student = Meteor.users.findOne({"profile.name": enrollment_attempt.student_name});

            if(!student || Enrollments.findOne({student_id: student._id, class_id: enrollment_attempt.class_id})){
                throw new Meteor.Error(404, 'not found');
            }
        
        let new_enrollment = {student_id: student._id, student_name: student.profile.name, class_id: enrollment_attempt.class_id, points: 0};

        Enrollments.insert(new_enrollment, function(err, enrollment_id){ 
                let inserted_enrollment = Enrollments.findOne({_id: enrollment_id});;
                if(Tasks.find({class_id: inserted_enrollment.class_id})){
                    Tasks.find({class_id: inserted_enrollment.class_id}).forEach(function(task){
                        Enrollments.update({_id: enrollment_id}, { $push: 
                            {tasks: { task_id: task._id , name: task.name, done: false, max_points: task.points}}
                        });
                    });
                }         
            });
        },

        'enrollments.markDone'(enrollment_id, task_id, set_checked){

            if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
                throw new Meteor.Error('not-authorized');
            }

            let enrollment_points = Enrollments.findOne({_id: enrollment_id, 'tasks.task_id': task_id}, {fields: {points: 1, 'tasks.$.max_points': 1}});
            let new_points = set_checked ? enrollment_points.points + enrollment_points.tasks[0].max_points : enrollment_points.points - enrollment_points.tasks[0].max_points;
            let task_points = set_checked ? enrollment_points.tasks[0].max_points : 0;
            Enrollments.update({_id: enrollment_id, 'tasks.task_id': task_id }, {$set: {'tasks.$.done': set_checked, 'tasks.$.points': task_points, points: new_points}});    
        } 
    });
}
