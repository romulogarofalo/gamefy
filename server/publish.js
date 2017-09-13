Meteor.publish('classes', function() {
    return Classes.find({
        owner: this.userId
    });    
});

Meteor.publish('students', function(class_id) {
    return Enrollments.find({
        class_id: class_id
    });    
});