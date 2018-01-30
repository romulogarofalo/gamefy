//me inscrevo nas publishs necessárias
Template.TestSingle.onCreated(function() {
    const self = this;
    const test_id = FlowRouter.getParam('test_id');
    self.autorun(function() { 
        self.subscribe('test-single',test_id);
    });
});


//inicializo as modais na renderização da pagina
Template.TestSingle.onRendered(function() {
    $('.modal').modal();
});

Template.TestSingle.helpers({
    addTest: ()=>{
        return function(){
            $('#new-question').modal('open');
      }
    },

    testName: () => {
        return Tests.findOne({}).name
    },

    testQuestion: () => {
        //retorno as questões do questionário atual para colocar no each
        return Tests.findOne({}).questions
    },

});


Template.TestSingle.events({ 
    'click .delete-question': function(event, template) {
        //pega o numero da questão a qual aquele elemento da página se refere
        const question = this.number;
        const test_id = FlowRouter.getParam('test_id')
        if(confirm("Deseja mesmo deletar a questão")){
            //chama o metodo delete questions da API de questionarios (TestsCollection) passando o id do questionario e o numero da questão
            Meteor.call('questions.delete', question, test_id);
            Materialize.toast('Classe Excluida com Sucesso!', 3000);
        }            
    } 
});