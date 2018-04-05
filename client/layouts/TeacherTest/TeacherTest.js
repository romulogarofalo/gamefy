 //configuro os DatePickers e TimePickers para utilizarem as datas previamente salvas, se houver
  function setDatePickers(){      
        let start_time = Tests.findOne({}).start_time
        let end_time = Tests.findOne({}).end_time
        if(start_time && end_time){
            let $input = $('#start_date').pickadate()
            let picker = $input.pickadate('picker')
            picker.set('select', [start_time.getFullYear(), start_time.getMonth(), start_time.getDate()])

            $input = $('#end_date').pickadate()
            picker = $input.pickadate('picker')
            picker.set('select', [end_time.getFullYear(), end_time.getMonth(), end_time.getDate()])

            $input = $('#start_time').pickatime()
            picker = $input.pickatime('picker')
            let start_hours = start_time.getHours() < 10 ? "0" + start_time.getHours() : start_time.getHours();
            let start_minutes = start_time.getMinutes() < 10 ? "0" + start_time.getMinutes() : start_time.getMinutes();
            picker.val(start_hours + ":" + start_minutes)

            $input = $('#end_time').pickatime()
            picker = $input.pickatime('picker')
            let end_hours = end_time.getHours() < 10 ? "0" + end_time.getHours() : end_time.getHours();
            let end_minutes = end_time.getMinutes() < 10 ? "0" + end_time.getMinutes() : end_time.getMinutes();
            picker.val(end_hours + ":" + end_minutes)
        }
  }


//me inscrevo nas publishs necessárias e configuro o ReactiveDict
Template.TeacherTest.onCreated(function() {
    const self = this;
    const test_id = FlowRouter.getParam('test_id');
    self.autorun(function() { 
        self.subscribe('test-single',test_id);
        if (Template.instance().subscriptionsReady()) {
            setDatePickers();
        }
    });
    this.state = new ReactiveDict();
    this.state.set('answerList', []);
});

//inicializo as modais na renderização da pagina
Template.TeacherTest.onRendered(function() {
    $('.modal').modal();
    $('#start_date').pickadate({
        selectMonths: true, 
        selectYears: 15,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false, 
    });

    $('#end_date').pickadate({
        selectMonths: true, 
        selectYears: 15, 
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false,
    });

    $('#start_time').pickatime({
        default: 'now', 
        fromnow: 0,
        twelvehour: false, 
        donetext: 'OK', 
        cleartext: 'Clear', 
        canceltext: 'Cancel',
        autoclose: false, 
        ampmclickable: true,
        aftershow: function(){}, 
    });

    $('#end_time').pickatime({
        default: 'now', 
        fromnow: 0,   
        twelvehour: false, 
        donetext: 'OK',
        cleartext: 'Clear', 
        canceltext: 'Cancel', 
        autoclose: false,
        ampmclickable: true, 
        aftershow: function(){}, 
    });
});

Template.TeacherTest.helpers({
    addTest: ()=>{
        return function(){
            $('#new-question').modal('open');
      }
    },

    testEditable: () =>{
        return Tests.findOne({}).status == 0;
    },

    testName: () => {
        return Tests.findOne({}).name
    },

    hasQuestions: () =>{
        console.log(Tests.findOne({}).questions)
        return Tests.findOne({}).questions.length > 0
    },

    testDescription: () => {
        return Tests.findOne({}).description
    },

    testQuestion: () => {
        //retorno as questões do questionário atual para colocar no each
        return Tests.findOne({}).questions
    },

    testClass(){
        return Tests.findOne({}).class_id;
    },

    //TO DO: pensar em um nome melhor para esse helper
    /*
        passo o estado do template para outro template, a fim de reutilizar
        a lista de respostas em dois templates diferentes
    */
    testSingleArray: () => {
            return Template.instance().state
    }

});


Template.TeacherTest.events({

     'submit .save-test-form': function(event, template) {

         event.preventDefault();

         const target = event.target;
         const test_id = FlowRouter.getParam('test_id');

         const start_time = new Date(target.start_date.value + " " + target.start_time.value);
         const end_time = new Date(target.end_date.value + " " + target.end_time.value);

         //crio uma nova janela de tempo para a realização do teste
         const new_timeframe = {start_time: start_time, end_time: end_time}

         Meteor.call('tests.updateTime', test_id, new_timeframe, function(error, success) { 
             if(error){
                 console.log(error)
                 if(error.error == 'not-enough-questions'){
                     alert('O questionário deve possuir ao menos 5 questões');
                 }
                 else{
                    if(error.error == 'invalid-timeframe'){
                        alert('Esta janela de tempo não existe. Por favor verifique as datas e horas');
                    }
                    else{
                        if(error.error == 'test-already-published'){
                            alert('Este teste já foi publicado e não pode mais ser editado')
                        }
                    }
                 }
             }
             else{ 
                  Materialize.toast('Janela de tempo do questionário definida!', 3000);
             } 
         });
     },

    'click .delete-question': function(event, template) {
        //pega o numero da questão a qual aquele elemento da página se refere
        const question = this.number;
        const test_id = FlowRouter.getParam('test_id')

        if(confirm("Deseja mesmo deletar a questão?")){
            //chama o metodo delete questions da API de questionarios (TestsCollection) passando o id do questionario e o numero da questão
            Meteor.call('questions.delete', question, test_id);
            Materialize.toast('Questão Excluida com Sucesso!', 3000);
        }            
    },

    'click .edit-question': function (event, template) {
        //pega o numero da questão a qual aquele elemento da página se refere
        const question_number = this.number;
        const test = Tests.findOne({});

        //encontra a questão no teste de aocrdo com o numero
        const question = test.questions.find((value) => value.number === question_number);

        //configura os valores na modal para o enunciado e o numero da questão
        $('#statement-edit').val(question.statement);
        $('#question-id').val(question_number);

        let answer_list = [];
        let marked

        //prepara a answer_list que será passada para o outro template, usando as informações salvas anteriormente
        question.answers.forEach(function(value){
            marked = false
            if(value.number === question.correct_answer){
                marked = true
                $('#' + "answer" + (value.number)).prop('checked', true)
            }
            answer_list.push({answer_text: value.answer_text, answer_name: "answer" + (value.number), marked: marked})
        });
        template.state.set('answerList', answer_list);

        $('#edit-question').modal('open');
    } 
});