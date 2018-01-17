Template.Students.onCreated(function() {
    //pego os parametros da url e me inscrevo nas publishs necessarias
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('students', class_id);
    });

    //crio o dicionário reativo para manipular a forma de ordenação dos estudantes
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

    //verifico se o tipo de ordenação atual é alfabética
    isAlphabetic:()=>{
        const instance = Template.instance();
        return instance.state.get('orderBy') === 'alphabetic';
    },

    //verifico se o tipo de ordenação atual é por pontos
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