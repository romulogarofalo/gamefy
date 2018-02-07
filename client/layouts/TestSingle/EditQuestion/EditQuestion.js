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


        const edited_question = {
            test_id: FlowRouter.getParam('test_id'),
            number: $('#question-id').val(),
            statement: $('#statement-edit').val(),
            answers: template.data.answer_list.get('answerList'),
        }

        Meteor.call('questions.update', edited_question);
        $('#edit-question').modal('close');
        template.find(".edit-question-form").reset();  
    },

});