Template.Students.onCreated(function() {
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('students', class_id);
    });
    this.state = new ReactiveDict();
    this.state.set('orderBy', 'ranking');
});

Template.Students.helpers({
     studentsRanking:()=> {
        return Enrollments.find({}, { sort: { points: ['desc'] } });
    },

    studentsAlphabetic:()=> {
        return Enrollments.find({}, { sort: { name: ['asc'] } });
    },

    isAlphabetic:()=>{
        const instance = Template.instance();
        return instance.state.get('orderBy') === 'alphabetic';
    },

    isRanking:()=>{
        const instance = Template.instance();
        return instance.state.get('orderBy') === 'ranking';
    },

    addEnrollment: ()=>{
        return function(){
        $('#new-enrollment').modal('open');
      }
    }
});

Template.Students.events({ 
    'click .alphabetic': function(event, template) { 
         const instance = Template.instance();
         instance.state.set('orderBy', 'alphabetic');
    },

    'click .ranking': function(event, template) { 
         const instance = Template.instance();
         instance.state.set('orderBy', 'ranking');
    }  
});