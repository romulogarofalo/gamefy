
Template.AnswerList.helpers({
    //retorno a lista de respostas para usar no each
    answerList: function() {
        const instance = Template.instance();
        return instance.data.answer_list.get('answerList');
    }
});

Template.AnswerList.events({ 
    //adiciono uma nova resposta à answerList
    'click #add-answer': function(event, template) { 
         const answer_text = template.find('.new-answer').value
         let answer_list = template.data.answer_list.get('answerList')
         answer_list.push({answer_text: answer_text, answer_name: "answer" + (answer_list.length + 1), marked: false})
         template.data.answer_list.set('answerList', answer_list);
    },
    
    //atualizo a answerList com a nova resposta que deve ser considerada correta (marked)
    'change input[name="question"] ': function(event, template){

        let answer_list = template.data.answer_list.get('answerList')
        answer_list.forEach((value) => value.answer_name === event.target.id ? value.marked = true : value.marked = false);
        template.data.answer_list.set('answerList', answer_list)
        
    },

    'click .delete-answer': function (event, template) {
        var answer = this.answer_name;
        console.log(answer)
        if(confirm("Deseja mesmo deletar essa resposta")){
            let answer_list = template.data.answer_list.get('answerList');
            const index = answer_list.findIndex(single_answer => single_answer.answer_name == answer);
            answer_list.splice(index, 1);
            console.log(answer_list)
            template.data.answer_list.set('answerList', answer_list);
        }
    }

});