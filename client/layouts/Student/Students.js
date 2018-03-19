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

    hasStudent:() =>{
        return Enrollments.find({}).count() > 0
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
    },

    'click .delete-student': function(event, template) { 
        const student_name = this.student_name;
        const class_id = FlowRouter.getParam('id')
        if(confirm("Deseja mesmo deletar o aluno " + student_name +". Isso excluirá todo o progesso dele nesta classe")){
            Meteor.call('enrollments.delete', this._id, class_id, function(error, result){
                if(error){
                    console.log(error)
                }
                else{
                    Materialize.toast('Aluno Excluido com Sucesso!', 3000);
                }
            });
        }
    }

});