import {
    check
} from 'meteor/check';
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

    statement: {
        type: String
    },

    correct_answer: {
        type: SimpleSchema.Integer,
        allowedValues: [1, 2, 3, 4],
    },

    imageName: {
        type: String,
        optional: true
    },

    answers: {
        type: Array,
        maxCount: 4,
        minCount: 2
    },

    'answers.$': {
        type: AnswerSchema
    }

})

//crio a collection de questionários
TestSchema = new SimpleSchema({
    name: {
        type: String,
    },

    description: {
        type: String,
    },

    points: {
        type: Number,
    },

    class_id: {
        type: String
    },

    status: {
        type: SimpleSchema.Integer,
    },

    start_time: {
        type: Date,
        optional: true
    },

    end_time: {
        type: Date,
        optional: true
    },

    publishing: {
        type: Boolean,
        optional: true
    },

    questions: {
        type: Array,
        optional: true,
        maxCount: 7
    },

    "questions.$": {
        type: QuestionSchema,
    },

    students_done: {
        type: Array
    },

    'students_done.$': {
        type: String
    },

    createdAt: {
        type: Date,
        autoValue: function () {
            return new Date()
        }
    }

});

Tests.attachSchema(TestSchema);

Meteor.methods({
    'tests.insert': function (new_test) {

        //verifico se está logado e se é professor
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher'])) {
            throw new Meteor.Error('not-authorized');
        }

        //crio o status (indica se está publicado ou não) de um teste. O padrão é false
        //TO DO: pensar em um nome mais intuitivo pra esse campo
        new_test.status = 0;
        //crio o array de questões inicial (vazio)
        new_test.questions = [];
        new_test.students_done = [];
        Tests.insert(new_test);
    },

    'tests.update': function (name, points, desc, test_id) {

        //TO DO: adicionar verificação de status
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        const test = Tests.findOne(test_id);

        console.log(test_id)

        if (test.status != 0) {
            throw new Meteor.Error('test-already-published');
        }

        Tests.update({
            _id: test_id
        }, {
            $set: {
                name: name,
                description: desc,
                points: points
            }
        });

    },

    'tests.updateTime': function (test_id, new_timeframe) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        //verifica se a janela de tempo que o usuário deseja salvar é possível
        if (new_timeframe.start_time >= new_timeframe.end_time) {
            throw new Meteor.Error('invalid-timeframe');
        }

        const test = Tests.findOne(test_id);

        //VALOR 1 APENAS PARA TESTE. MUDAR PARA 5 NA VERSÃO FINAL
        if(test.questions.length < 1){
            throw new Meteor.Error('not-enough-questions');
        }

        if (test.status != 0) {
            throw new Meteor.Error('test-already-published');
        }

        Tests.update({
            _id: test_id
        }, {
            $set: {
                start_time: new_timeframe.start_time,
                end_time: new_timeframe.end_time
            }
        })
    },

    'tests.delete': function (test_id) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        const test = Tests.findOne(test_id);

        //verifico se o teste está em estado de publicado
        if (test.status != 0) {
            throw new Meteor.Error('test-already-published');
        }

        Tests.remove({
            _id: test_id
        })
    },

    /*
        finalizo o questionário do aluno, verificando as respostas certas
        e salvando os dados dessa realização do documento da matricula dele
    */
    'tests.endTest': function (test_id, student_answers) {
        if (Meteor.isServer) {

            const user_id = Meteor.userId();

            //verifico se está logado e se é aluno
            if (!user_id || !Roles.userIsInRole(Meteor.user(), ['student'])) {
                throw new Meteor.Error('not-authorized');
            }

            const test = Tests.findOne(test_id)

            //verifico se o aluno já realizou o teste anteriormente
            if (test.students_done.find(student_done => user_id === student_done)) {
                throw new Meteor.Error('test-already-done');
            }

            //verifico se o teste está em estado de publicado
            if (test.status != 1) {
                throw new Meteor.Error('test-not-published');
            }

            const class_id = test.class_id;
            const max_points = test.points;
            const questions = test.questions;

            let correct_answers = 0;

            //a cada questão, comparo a resposta do aluno com a correta e, caso seja, incremento a quantidade de corretas
            questions.forEach(function (question) {
                let answer = student_answers.find(answer => answer.question_number === question.number)
                if (question.correct_answer == answer.answer_number) {
                    correct_answers++;
                }
            });

            //calculo a pontuação final do aluno
            const student_points = (correct_answers / questions.length) * max_points

            const enrollment = Enrollments.findOne({
                student_id: user_id,
                class_id: class_id
            })

            const updated_points = enrollment.points + student_points

            Enrollments.update({
                _id: enrollment._id,
                'tests.test_id': test_id
            }, {
                $set: {
                    points: updated_points,
                    'tests.$.done': true,
                    'tests.$.points': student_points,
                    'tests.$.correct_answers': correct_answers
                }
            });

            /*
                atualizo o array de alunos que realizaram o questionário na collection de questionários
                para facilitar certas consultas futuras
            */
            Tests.update(test_id, {
                $push: {
                    students_done: enrollment._id
                }
            });
        }
    },

    'tests.report': function (class_id) {
        
        if (Meteor.isServer) {
            const class_enrollments = Enrollments.find({
                class_id: class_id
            }).fetch();

            const latest_tests = Tests.find({
                status: 2
            }, {
                sort: {
                    createdAt: -1
                }
            }).fetch();

            const last_test_id = latest_tests[latest_tests.length - 1]._id
            const last_test_questions = latest_tests[latest_tests.length - 1].questions.length;
            const next_to_last_test_id = latest_tests[latest_tests.length - 2]._id
            const next_to_last_test_questions = latest_tests[latest_tests.length - 2].questions.length;

            let last_test = []
            let next_to_last_test = []

            class_enrollments.forEach(function (enrollment) {
                const enrollment_last_test = enrollment.tests.find((test) => test.test_id == last_test_id);
                const enrollment_next_to_last_test = enrollment.tests.find((test) => test.test_id == next_to_last_test_id);

                if (enrollment_last_test != undefined && enrollment_next_to_last_test != undefined) {
                    last_test.push(enrollment_last_test.correct_answers);
                    next_to_last_test.push(enrollment_next_to_last_test.correct_answers);
                }

            });

            let last_test_distr = {}
            let class_improvement = {"-100": 0, "-50": 0, "-20": 0, "-5":  0, "5": 0, "20": 0, "50": 0, "100": 0, "500": 0}
            
            last_test.forEach(function (elem, index) {
                last_test_distr[elem === undefined ? "Não realizou" : elem] = (last_test_distr[elem] || 0) + 1;
                const last_test_percentage = elem/last_test_questions;
                const next_to_last_test_percentage = next_to_last_test[index]/next_to_last_test_questions
                const improvement = ((last_test_percentage - next_to_last_test_percentage)/next_to_last_test_percentage)*100
                for (const key of Object.keys(class_improvement).sort((a,b) => a - b)){
                    if(improvement < parseFloat(key)){
                        class_improvement[key]++;
                        break;
                    }
                }
            });

            return [last_test_distr, class_improvement];
        }
    },

    'questions.insert': function (new_question) {

        //verifico se está logado e se é professor
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher'])) {
            throw new Meteor.Error('not-authorized');
        }

        const test = Tests.findOne(new_question.test_id);

        if (test.status != 0) {
            throw new Meteor.Error('test-already-published');
        }

        //crio uma variavel para armazenar o numero da resposta correta temporariamente
        let correct_answer;

        //atribuo um numero sequencial para cada resposta da questão e salvo o numero da correta na variavel
        new_question.answers.forEach(function (value, index, array) {
            value.number = index + 1
            if (value.marked === true) {
                correct_answer = value.number
            }
        })

        //atribuo à questão o numero da resposta correta e um numero sequencial
        new_question.correct_answer = correct_answer;
        new_question.number = Tests.findOne({
            _id: new_question.test_id
        }).questions.length + 1

        //atualizo o array na collection e retorno o numero da questão para o upload da imagem
        Tests.update({
            _id: new_question.test_id
        }, {
            $push: {
                questions: new_question
            }
        })
        return new_question.number;
    },

    'questions.update' (edited_question) {

        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher'])) {
            throw new Meteor.Error('not-authorized');
        }

        const test = Tests.findOne(edited_question.test_id)

        if (test.status != 0) {
            throw new Meteor.Error('test-already-published');
        }

        //crio uma variavel para armazenar o numero da resposta correta temporariamente
        let correct_answer;

        edited_question.answers.forEach(function (value, index, array) {
            value.number = index + 1
            if (value.marked === true) {
                correct_answer = value.number
            }
        })

        edited_question.correct_answer = correct_answer;
        Tests.update({
            _id: edited_question.test_id,
            'questions.number': parseInt(edited_question.number)
        }, {
            $set: {
                'questions.$.statement': edited_question.statement,
                'questions.$.answers': edited_question.answers,
                'questions.$.correct_answer': edited_question.correct_answer
            }
        });
    },

    //atualiza a questão com o nome da imagem dela
    'questions.createImages' (filename, question_number, test_id) {
        Tests.update({
            _id: test_id,
            'questions.number': question_number
        }, {
            $set: {
                'questions.$.imageName': filename
            }
        });
    },

    //remove a questão indicada do array de questões daquele teste
    'questions.delete' (question_number, test_id) {

        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher'])) {
            throw new Meteor.Error('not-authorized');
        }

        const test = Tests.findOne(test_id)

        if (test.status != 0) {
            throw new Meteor.Error('test-already-published');
        }

        Tests.update({
            _id: test_id
        }, {
            $pull: {
                questions: {
                    number: question_number
                }
            }
        })
    }

});