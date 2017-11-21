Meteor.publish('classes', function() {

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
    if (Roles.userIsInRole(this.userId, ['teacher'])){
        return Tasks.find({
            class_id: class_id
        });    
    }
    else{
        return [Enrollments.find({
            student_id: Meteor.userId(), class_id: class_id}, {fields: {student_name: 1, tasks: 1}
        }),
        Tasks.find({
            class_id: class_id}, {fields:{name: 1, due: 1}
        })];  
    }
});

Meteor.publish('broochs', function() {
    if (Roles.userIsInRole(this.userId, ['teacher'])){
        return Broochs.find({
            owner: this.userId
        }); 
    } 
    else{
         console.log(Enrollments.findOne({student_id: Meteor.userId()}))
         let badges = Enrollments.findOne({student_id: Meteor.userId()}).badges;
         console.log(badges);
         //console.log(Enrollments.findOne({student_id: Meteor.userId()}))
         return Broochs.find({_id: {$in: badges}});
    }  
});


Meteor.publish('enrollment-task', function(task_id){
    return [Enrollments.find({
        "tasks.task_id": task_id}, {fields: {student_name: 1, 'tasks.$': 1}
        }), 
        Tasks.find({
            _id: task_id}, {fields:{name: 1, grade: 1, due: 1, class_id: 1}
        })];
})  

Meteor.publish('class-image', function(class_id){
    const current_class = Classes.findOne({_id: class_id}, {fields:{imageName: 1}});
    return Images.find({name: current_class.imageName}).cursor;
});