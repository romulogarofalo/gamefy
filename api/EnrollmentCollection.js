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
        type: SimpleSchema.Integer,
    },

    points:{
        type: SimpleSchema.Integer,
        optional: true,
    },

    grade:{
        type: SimpleSchema.Integer,
        optional: true,
        allowedValues:[1,2,3,4,5],
    }

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
        type: SimpleSchema.Integer,
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

        'enrollments.markDone'(done_parameters){
            if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
                throw new Meteor.Error('not-authorized');
            }

            let enrollment_points = Enrollments.findOne({_id: done_parameters.enrollment_id, 'tasks.task_id': done_parameters.task_id}, {fields: {points: 1, 'tasks.$': 1}});
            let enrollment_task_updated  = {'tasks.$.done': done_parameters.set_checked};
            let grade_multiplier = 1;
            let current_grade_multiplier = 1;
            if(Tasks.findOne({_id: done_parameters.task_id}, {fields: {grade: 1}}).grade){
                if(done_parameters.set_checked){
                    enrollment_task_updated['tasks.$.grade'] = done_parameters.grade;
                    grade_multiplier = 0.2 * done_parameters.grade;
                }
                else{
                    current_grade_multiplier = 0.2 * enrollment_points.tasks[0].grade;
                }
            }
            enrollment_task_updated['tasks.$.points'] = done_parameters.set_checked ? Math.round(enrollment_points.tasks[0].max_points * grade_multiplier) : 0;
            enrollment_task_updated.points = Math.round(done_parameters.set_checked ? enrollment_points.points + enrollment_points.tasks[0].max_points * grade_multiplier : enrollment_points.points - enrollment_points.tasks[0].max_points * current_grade_multiplier);
            Enrollments.update({_id: done_parameters.enrollment_id, 'tasks.task_id': done_parameters.task_id }, {$set: enrollment_task_updated});    
        } 
    });
}
