Template.NewQuestion.onCreated(function() {
    //crio o Dictionary reativo para a lista dinamica de respostas para a questão (answerList)
    const self = this;
    this.state = new ReactiveDict();
    this.state.set('answerList', []);
});

Template.NewQuestion.helpers({
    //retorno a lista de respostas para usar no each
    answerList: function() {
        const instance = Template.instance();
        return instance.state.get('answerList');
    }
});

Template.NewQuestion.events({ 
    //adiciono uma nova resposta à answerList
    'click #add-answer': function(event, template) { 
         const answer_text = template.find('#new-answer').value
         let answer_list = template.state.get('answerList')
         answer_list.push({answer_text: answer_text, answer_name: "answer" + (answer_list.length + 1), marked: false})
         template.state.set('answerList', answer_list)
    },
    
    //atualizo a answerList com a nova resposta que deve ser considerada correta (marked)
    'change input[name="question"] ': function(event, template){

        let answer_list = template.state.get('answerList')
        answer_list.forEach((value) => value.answer_name === event.target.id ? value.marked = true : value.marked = false);
        template.state.set('answerList', answer_list)
        
    },

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
                }
            }
        });     
    }
});

