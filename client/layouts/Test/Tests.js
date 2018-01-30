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

    //retorna os questionários da classe para usar no each
    testsTeacher: ()=>{
        return Tests.find({}); 
    }
});