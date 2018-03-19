//pego os parametros da url e me inscrevo nas publishs necessárias
Template.Tests.onCreated(function() {
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('tests',class_id);
    });
});



Template.Tests.helpers({
   
    addTest: ()=>{
        return function(){
            $('#new-test').modal('open');
        }
    },

    publishStatus: (test_id)=>{
        switch (Tests.findOne({_id: test_id}).status){
            case 0:
                return "Questionário não publicado"
                break;
        
           case 1:
                return "Questionário publicado"
                break;
           case 2:
                return "Questionário encerrado"
                break;
        }
    },

    teacherHasTest: () => {
        return Tests.find({}).count() > 0; 
    },

    studentHasTest: () => {
        return Enrollments.findOne({}).tests.count() > 0
    },

    //retorna os questionários da classe para usar no each
    testsTeacher: ()=>{
        return Tests.find({},{sort: {createdAt: -1}}); 
    },

    testName: (test_id)=> {
        return Tests.findOne({_id: test_id}).name
    },

    testsStudent: ()=>{
        return Enrollments.findOne({}).tests.reverse()
    },

    testPublished: (test_id)=> {
        return Tests.findOne({_id: test_id}).status == 1
    },

});

Template.Tests.events({ 
    'click .delete-test': function(event, template) { 
        if(confirm("Deseja mesmo deletar esse questionario?"))
        {
            //chama o metodo delete da API de questionários (TasksCollection) passando o id do questionário
            Meteor.call('tests.delete', event.target.id, function(error, success) { 
                //TO DO: adicionar situação de user não autorizado aqui e situação de questionário já publicado
                if (error) {
                    alert('Este teste já foi publicado e não pode ser mais excluido');
                } 
                else { 
                    Materialize.toast('Questionário excluido com sucesso!', 3000);   
                }
            });
        }
    },

    'click .edit-test': function (event, instance) {
        //pego os valores daquele elemento da interface e jogo na modal
        const test_id = event.target.id;
        console.log(test_id)
        const test = Tests.findOne({_id: test_id})
        const name = test.name
        const description = test.description
        const points = test.points
        $('#edit-test').modal('open');
        $('#test-id').val(test_id);
        $('#name-test').val(name);
        $('#points-test').val(points);
        $('#description-test').val(description);
    }, 
});