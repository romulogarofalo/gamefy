Meteor.publish('classes', function() {

    return Classes.find({
        owner: this.userId
    });

    if (Roles.userIsInRole(this.userId, ['teacher'])) {
        return Classes.find({
            owner: this.userId
        });
    }
    else{
        let classes_id = Enrollments.find({
                student_id: this.userId}, {fields: {'class_id':1}
            }).map(function (enrollment) { 
                return enrollment.class_id; 
            });
        console.log(classes_id);
        return Classes.find({
            _id: {$in: classes_id}
        });
    }

});

Meteor.publish('students', function(class_id) {
    return Enrollments.find({
        class_id: class_id
    });
});

Meteor.publish('tasks', function(class_id) {
    return Tasks.find({
        class_id: class_id

    });    
});

Meteor.publish('broochs', function() {
    return Broochs.find({
        owner: this.userId
    });    
});


Meteor.publish('enrollment-task', function(task_id){
    return Enrollments.find({"tasks.task_id": task_id}, {fields: {student_name: 1, 'tasks.$': 1}});
})  