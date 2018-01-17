Template.GiveBrooch.onCreated(function() {
    //me inscrevo nas publishs necessárias e pego os parametros da url
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('students', class_id);
    });
});

//inicio os elementos de UI do Materialize
Template.GiveBrooch.onRendered(function () {
        $('select').material_select();
});

Template.GiveBrooch.helpers({
     students:()=> {
        return Enrollments.find({});
    },

    updateSelect: ()=> {
         $('select').material_select();
    },
});

Template.GiveBrooch.events({ 
    'submit .give-brooch-form': function(event, template) { 
        event.preventDefault();

        //crio o vetor dos alunos daquela modal com o id e o status do checked
        var selected = [];
        $('.check-badge').each(function(index){
                selected.push({id: $(this).attr('id'), checked: $(this).prop('checked')});
        });
        let brooch_id = document.querySelector('#broochId').textContent;

        //chamo o metodo give da collection de broches para atualizar os broches dos alunos
        Meteor.call('brooch.give', selected, brooch_id);
        template.find(".give-brooch-form").reset();
        $('#give-brooch').modal('close');
    } 

});