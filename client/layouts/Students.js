Template.Students.onCreated(function() {
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('students', class_id);
    }); 
    //this.state = new ReactiveDict();
    //this.state.set('currentTab', 'Students')
});

Template.Students.helpers({
     students:()=> {
        return Enrollments.find({});
    },
});