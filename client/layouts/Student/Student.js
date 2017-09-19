Template.Student.helpers({
    ranking: (points)=>{
        return Enrollments.find({points: {$gt: points}}).count() + 1;
    }
});