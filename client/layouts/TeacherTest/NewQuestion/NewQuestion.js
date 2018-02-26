Template.NewQuestion.onCreated(function() {
    //crio o Dictionary reativo para a lista dinamica de respostas para a questão (answerList)
    const self = this;
    this.state = new ReactiveDict();
    this.state.set('answerList', []);
});

Template.NewQuestion.helpers({
    /*
        passo o estado do template para outro template, a fim de reutilizar
        a lista de respostas em dois templates diferentes
    */
    newQuestionArray: () => {
        return Template.instance().state
    }
});

Template.NewQuestion.events({ 
    'submit .new-question-form': function(event, template) {
    
        event.preventDefault();
 
        const target = event.target;
        const id = FlowRouter.getParam('test_id');

        const file_array = target.image.files;
        const image = target.image.files[0];
	    const file_name = Math.random().toString(36).substr(2, 10)+'.png'

        const answer_list = template.state.get('answerList')

        //crio o objeto questão para enviar para o servidor sem a imagem
        const new_question = {
            statement: target.statement.value,
            answers: answer_list,
            test_id: id
        };

        Meteor.call('questions.insert', new_question, (error, result) => {
            if(!error){
                if(file_array && image){
                    //caso a inserção seja um sucesso inicio o upload da imagem
                    const upload = Images.insert({
                        file: image,
                        fileName: file_name
                    });
                    //ao fim do upload, chamo o metodo createImages no servidor para salvar o nome da imagem na questão
                    upload.on('end', function (error, fileObj) {
                        Meteor.call('questions.createImages', fileObj.name, result, id);                
                    });
                    $('#new-question').modal('close');
                    template.find(".new-question-form").reset();
                    template.state.set('answerList', []);    
                }
            }
        });     
    }
});



