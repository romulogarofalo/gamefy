import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Tests = new Mongo.Collection('tests');


AnswerSchema = new SimpleSchema({

    number: {
        type: SimpleSchema.Integer,
    },

    answer_text: {
        type: String
    }
})

QuestionSchema = new SimpleSchema({

    number: {
        type: SimpleSchema.Integer,
    },

    statement:{
        type: String
    },

    correct_answer:{
        type: SimpleSchema.Integer,
        allowedValues:[1,2,3,4],
    },

    imageName:{
        type: String,
        optional: true
    },

    answers:{
        type: Array,
        maxCount: 4
    },

    'answers.$':{
        type: AnswerSchema
    }

})

//crio a collection de questionários
TestSchema = new SimpleSchema({
     name: {
        type: String,
    },

    description:{
        type: String,
    },

    points:{
        type: Number,
    },

    class_id:{
        type: String
    },

    status:{
        type: Boolean,
    },

    start_date:{
        type: Date,
        optional: true
    },

    end_date:{
        type: Date,
        optional: true
    },

    questions:{
        type: Array,
        optional: true,
        maxCount: 7
    },

    "questions.$":{
        type: QuestionSchema,
    },

});

Tests.attachSchema(TestSchema);

Meteor.methods({ 
    'tests.insert': function(new_test) { 
         
        //verifico se está logado e se é professor
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
            throw new Meteor.Error('not-authorized');
        }

        //crio o status (indica se está publicado ou não) de um teste. O padrão é false
        //TO DO: pensar em um nome mais intuitivo pra esse campo
        new_test.status = false;
        //crio o array de questões inicial (vazio)
        new_test.questions = [];
        Tests.insert(new_test);
    },

    'questions.insert': function(new_question) { 

        //verifico se está logado e se é professor
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
            throw new Meteor.Error('not-authorized');
        }

        //crio uma variavel para armazenar o numero da resposta correta temporariamente
        let correct_answer;

        //atribuo um numero sequencial para cada resposta da questão e salvo o numero da correta na variavel
        new_question.answers.forEach(function(value, index, array){
            value.number = index + 1
            if(value.marked === true){
                correct_answer = value.number
            }
        })
        
        //atribuo à questão o numero da resposta correta e um numero sequencial
        new_question.correct_answer = correct_answer;
        new_question.number = Tests.findOne({_id: new_question.test_id}).questions.length + 1

        //atualizo o array na collection e retorno o numero da questão para o upload da imagem
        Tests.update({_id: new_question.test_id}, { $push: {questions: new_question}})
        return new_question.number;
    },

    //atualiza a questão com o nome da imagem dela
    'questions.createImages' (filename, question_number, test_id){
        Tests.update({_id: test_id, 'questions.number': question_number}, {$set: {'questions.$.imageName': filename}});
    },

    //remove a questão indicada do array de questões daquele teste
    'questions.delete' (question_number, test_id){
        Tests.update({_id: test_id}, { $pull: { questions: {number: question_number}}})
    }
     
});