import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Enrollments = new Mongo.Collection('enrollments');

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
        autoValue: function(){
            return 0
        }
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

            console.log(student);

            if(!student){
                throw new Meteor.Error(404, 'not found');
            }

        let new_enrollment = {student_id: student._id, student_name: student.profile.name, class_id: enrollment_attempt.class_id}
        
        Enrollments.insert(new_enrollment);
    } 
});
}
