Template.StudentTest.onCreated(function() {
    const self = this;
    const test_id = FlowRouter.getParam('test_id');
    self.autorun(function() { 
        self.subscribe('test-single',test_id);
    });
    this.state = new ReactiveDict();
    const instance = Template.instance();
    instance.state.set('question', 0);
    Session.set('answers', [])
});

Template.StudentTest.helpers({
    //TO DO: trocar alguns desses helpers por um #with no Template
    testName: () => {
        return Tests.findOne({}).name
    },

    testPublished: () =>{
        return Tests.findOne({}).status == 1;
    },

    testPending: () =>{
        return ! Enrollments.findOne({}).tests[0].done;
    },

    imageFile: (imageName) => {
       return Images.findOne({name: imageName}).link();
    },

    testQuestion: () => {
        //retorno as questões do questionário atual para colocar no each
        return Tests.findOne({}).questions
    },

    testClass(){
        return Tests.findOne({}).class_id;
    },

    testDescription(){
        return Tests.findOne({}).description;
    },

    //verifico se aquela alternativa da questão foi previamente marcada pelo usuário
    isChecked(number){
        //pego as informações do ReactiveDict e as respostas na Session
        const instance = Template.instance();
        const index = instance.state.get('question');
        const answers = Session.get('answers');

        //filtro para encontrar a questão e a resposta que está sendo construida no momento
        const question_number = Tests.findOne({}).questions[index].number;
        const marked_answer = answers.find(answer => answer.question_number === question_number);

        /*
        caso uma resposta já tenha sido marcada, verifica se o numero da resposta marcada 
        é igual ao numero da resposta atual
        */
        if(marked_answer != undefined){
            return number == marked_answer.answer_number
        }
        else{
            return false
        } 
    },

    testQuestion(){
        const instance = Template.instance();
        const index = instance.state.get('question');
        return Tests.findOne({}).questions[index]; 
    },

    questionNumber(){
        const instance = Template.instance();
        const index = instance.state.get('question');
        return Tests.findOne({}).questions[index].number; 
    },

    //muda de página para a questão anterior se houver
    prevQuestion: () => {
        const instance = Template.instance();
        return function () {
            if (instance.state.get('question') >= 1) {
                instance.state.set('question', instance.state.get('question') - 1);
            }
        }
    },

    //muda de página para a próxima questão se houver
    nextQuestion: () => {
        const instance = Template.instance();
        const max_index  = Tests.findOne({}).questions.length - 1;
        return function () {
            if (instance.state.get('question') < max_index) {
                instance.state.set('question', instance.state.get('question') + 1);
            }
            
        }
    },

});

Template.StudentTest.events({ 

    /*
        verifica uma mudança na resposta marcada de uma questão e atualiza o array
        de respostas da sessão de acordo com ela
    */
    'change input[type="radio"]': function(event, instance){

        let answers = Session.get('answers');
        const index = instance.state.get('question');
        const question_number = Tests.findOne({}).questions[index].number;
        const answer_index = answers.findIndex(answer => answer.question_number === question_number)

        if(answer_index === -1){
            answers.push({'question_number': question_number, 'answer_number': event.target.id});
        }
        else{
            answers[answer_index] = {'question_number': question_number, 'answer_number': event.target.id}
        }
        Session.set('answers', answers);
    },

    //finaliza o teste, verificando se todas as questões foram respondidas
    'click #finish-test':  function (event, instance) {
        
        if(confirm("Deseja mesmo finalizar o teste?")){
        const student_answers = Session.get('answers')
        const questions = Tests.findOne().questions;

        if(student_answers.length < questions.length){
            alert('Por favor, responda todas as questões antes de finalizar o teste');
            return;
        }

        const test_id = FlowRouter.getParam('test_id');
        
        //chama o método endTest da Collection Tests e redireciona o aluno para a página da classe
        Meteor.call('tests.endTest', test_id, student_answers, function(error, success) {
            console.log(success);
            console.log(error) 
            if (error) { 
                if(error.error === 'test-not-published'){
                    alert('Esse teste não está mais disponível para você. Você será retornado a página anterior');
                }
            }
            else{
                    Materialize.toast('Teste Concluido!', 3000);

            }
            FlowRouter.go('/class/' + Tests.findOne().class_id)
        });
      }
    }
});