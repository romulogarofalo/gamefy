Template.Student.helpers({
    ranking: (points)=>{
        return Enrollments.find({points: {$gt: points}}).count() + 1;
    },

    isCurrentUser: ()=>{
        console.log(Enrollments.find({student_id: Meteor.userId()}))
        return Enrollments.findOne({student_id: Meteor.userId()});
    }
});