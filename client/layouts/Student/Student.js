Template.Student.helpers({
    ranking: (points)=>{
        return Enrollments.find({points: {$gt: points}}).count() + 1;
    },

    isCurrentUser: ()=>{
        return Enrollments.find({student_id: Meteor.userId()});
    }
});