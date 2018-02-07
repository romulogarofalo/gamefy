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


//me inscrevo nas publishs necessárias
Template.TestSingle.onCreated(function() {
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
Template.TestSingle.onRendered(function() {
    $('.modal').modal();
    $('#start_date').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        min: new Date(),
        closeOnSelect: false, // Close upon selecting a date,
    });

    $('#end_date').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        min: new Date(),
        closeOnSelect: false, // Close upon selecting a date,
    });

    $('#start_time').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){}, //Function for after opening timepicker
    });

    $('#end_time').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){}, //Function for after opening timepicker
    });
});

Template.TestSingle.helpers({
    addTest: ()=>{
        return function(){
            $('#new-question').modal('open');
      }
    },

    testName: () => {
        return Tests.findOne({}).name
    },

    testQuestion: () => {
        //retorno as questões do questionário atual para colocar no each
        return Tests.findOne({}).questions
    },

    testClass(){
        return Tests.findOne({}).class_id;
    },

    //TO DO: pensar em um nome melhor para esse helper
    testSingleArray: () => {
            return Template.instance().state
    }

});


Template.TestSingle.events({

     'submit .save-test-form': function(event, template) {

         event.preventDefault();

         const target = event.target;

         const test_id = FlowRouter.getParam('test_id');

         const start_time = new Date(target.start_date.value + " " + target.start_time.value);
         const end_time = new Date(target.end_date.value + " " + target.end_time.value);

         const new_timeframe = {start_time: start_time, end_time: end_time}

         Meteor.call('tests.updateTime', test_id, new_timeframe, function(error, success) { 
             if (error) { 
                 console.log('error', error); 
             } 
             if (success) { 
                  
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
            Materialize.toast('Classe Excluida com Sucesso!', 3000);
        }            
    },

    'click .edit-question': function (event, template) {
        const question_number = this.number;
        const test = Tests.findOne({});
        const question = test.questions.find((value) => value.number === question_number);

        let answer_list = [];
        let marked
        $('#statement-edit').val(question.statement);
        $('#question-id').val(question_number);
        question.answers.forEach(function(value){
            marked = false
            if(value.number === question.correct_answer){
                marked = true
            }
            answer_list.push({answer_text: value.answer_text, answer_name: "answer" + (value.number), marked: marked})
        });
        template.state.set('answerList', answer_list);

        $('#edit-question').modal('open');
    } 
});