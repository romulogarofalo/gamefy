Template.EditQuestion.helpers({
    //retorno a lista de respostas para usar no each
    editQuestionArray: () => {
            const instance = Template.instance();
            return instance.data.answer_list;
    }
});

Template.EditQuestion.events({ 

    'submit .edit-question-form': function(event, template){

        event.preventDefault();
 
        const target = event.target;
        const id = FlowRouter.getParam('test_id');

        //crio o objeto com os dados da questão e o que será alterado
        const edited_question = {
            test_id: FlowRouter.getParam('test_id'),
            number: $('#question-id').val(),
            statement: $('#statement-edit').val(),
            answers: template.data.answer_list.get('answerList'),
        }

        Meteor.call('questions.update', edited_question, (error, result) => {
            if(error){
                if(error.error == 'test-already-published'){
                    alert("Este teste já foi publicado e não pode mais ser alterado")
                }
                else{
                    alert("Por favor preencha todos os campos de acordo com as instruções")
                }
            }
            else{
                Materialize.toast('Questão editada com Sucesso!', 3000);
                $('#edit-question').modal('close');
                template.find(".edit-question-form").reset(); 
            }
        }); 
    },

});