import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';


Enrollments = new Mongo.Collection('enrollments');

//defino a collection que será usada no array de tarefas de uma matricula
StudentTaskSchema = new SimpleSchema({
    task_id: {
        type: String,
    },

    done:{
        type: Boolean,
    },

    max_points:{
        type: SimpleSchema.Integer,
    },

    due:{
        type: Date,
    },

    points:{
        type: SimpleSchema.Integer,
        optional: true,
    },

    grade:{
        type: SimpleSchema.Integer,
        optional: true,
        allowedValues:[1,2,3,4,5],
    }

});

StudentTestSchema = new SimpleSchema({
    test_id: {
        type: String,
    },

    done:{
        type: Boolean,
    },

    max_points:{
        type: SimpleSchema.Integer,
    },

    points:{
        type: SimpleSchema.Integer,
        optional: true,
    },

    correct_answers:{
        type: SimpleSchema.Integer,
        optional: true,
    },

});

//defino a collection de uma matricula
EnrollmentSchema = new SimpleSchema({
    student_id: {
        type: String,
    },

    student_name: {
        type: String,
    },

    class_id:{
        type: String,
    },

    points:{
        type: SimpleSchema.Integer,
    },

    tasks:{
        type: Array,
        optional: true
    },

    "tasks.$":{
        type: StudentTaskSchema,
    },

    tests:{
        type: Array,
        optional: true
    },

    "tests.$":{
        type: StudentTestSchema,
    },

    badges:{ 
        type: Array,
        optional: true
    },

    "badges.$":{
        type: String,
    },

    createdAt:{
        type: Date,
        autoValue: function(){
            return new Date()
        }
    }
});

Enrollments.attachSchema(EnrollmentSchema);


//uso Meteor.isServer pois ocorrem bugs se o código rodar nos dois lados
if (Meteor.isServer) {
    Meteor.methods({ 
    'enrollments.insert'(enrollment_attempt) {

            //verifico se está logado e se é professor
            if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
                throw new Meteor.Error('not-authorized');
            }

            //busco um usuario com o nome passado como parametro
            let student = Meteor.users.findOne({"profile.name": enrollment_attempt.student_name});

            //verifico se aquele usuario existe e se ele já não foi previamente registrado naquela classe
            //TO DO: separar em dois ifs para tornar o codigo mais claro
            if(!student || Enrollments.findOne({student_id: student._id, class_id: enrollment_attempt.class_id})){
                throw new Meteor.Error(404, 'not found');
            }
        
            //passadas todas as verificações, crio um objeto matricula para aquele aluno com os valores padrões de pontos e badges
            let new_enrollment = {
                    student_id: student._id, 
                    student_name: student.profile.name,
                    class_id: enrollment_attempt.class_id, 
                    points: 0, 
                    badges: [],
                    tests: []
                };
            
            Enrollments.insert(new_enrollment, function(err, enrollment_id){ 
                /*
                    após criar a matricula, verifico se a classe já possui alguma tarefa e adiciono no
                    array de tarefas daquela matricula
                */
                let inserted_enrollment = Enrollments.findOne({_id: enrollment_id});
                if(Tasks.find({class_id: inserted_enrollment.class_id})){
                    Tasks.find({class_id: inserted_enrollment.class_id}).forEach(function(task){
                        Enrollments.update({_id: enrollment_id}, { $push: 
                            {tasks: { task_id: task._id, due: task.due, done: false, max_points: task.points}}
                        });
                    });
                }         
            });
        },

        'enrollments.delete'(enrollment_id, class_id) {

            if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
                throw new Meteor.Error('not-authorized');
            }

            Enrollments.remove(enrollment_id)
            Tasks.update({class_id: class_id}, {$pull: {students: enrollment_id}})
            Broochs.update({class_id: class_id}, {$pull: {students: enrollment_id}})
        },

        //esse metodo marca ou desmarca a realização de uma tarefa por um aluno
        'enrollments.markDone'(done_parameters){

            //verifico login e autorização
            if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher'])){
                throw new Meteor.Error('not-authorized');
            }
            
            //verifico se o prazo da tarefa não foi estourado
            let date = new Date()
            date.setHours(0,0,0,0);
            if (Tasks.findOne({_id: done_parameters.task_id}).due < date){
                throw new Meteor.Error('task is already due');
            }

            //pego a pontuação total do estudante e a tarefa em questão
            let enrollment_points = Enrollments.findOne({
                _id: done_parameters.enrollment_id, 'tasks.task_id': done_parameters.task_id}, {fields: {points: 1, 'tasks.$': 1}
            });

            //crio um objeto com um operador posicional na chave, permitindo atualizar o parametro de realizado daquela tarefa no array
            let enrollment_task_updated  = {'tasks.$.done': done_parameters.set_checked};
            
            //crio os valores base para os multiplicadores de nota
            let grade_multiplier = 1;
            let current_grade_multiplier = 1;

            //verifico se a tarefa possui nota
            if(Tasks.findOne({_id: done_parameters.task_id}, {fields: {grade: 1}}).grade){
                //caso seja para marcar a realização de uma tarefa, atualizo o multiplicador e adiciono a nota no objeto previamente criado
                if(done_parameters.set_checked){
                    enrollment_task_updated['tasks.$.grade'] = done_parameters.grade;
                    grade_multiplier = 0.2 * done_parameters.grade;
                }
                //caso contrário apenas pego a nota que o aluno possui atualmente naquela tarefa
                else{
                    current_grade_multiplier = 0.2 * enrollment_points.tasks[0].grade;
                }
            }

            /*
                atualizo os pontos do objeto criado, mudando a operação dependendo se for a marcação ou desmarcação 
                de uma tarefa e operando com o objeto de pontos criado anteriormente
            */
            enrollment_task_updated.points = Math.round(
                done_parameters.set_checked ? 
                enrollment_points.points + enrollment_points.tasks[0].max_points * grade_multiplier : 
                enrollment_points.points - enrollment_points.tasks[0].points
            );

            //atualizo a pontuação do aluno naquela tarefa especifica no objeto criado, permitindo manter um historico
            enrollment_task_updated['tasks.$.points'] = done_parameters.set_checked ? 
                Math.round(enrollment_points.tasks[0].max_points * grade_multiplier) : 0;

            //atualizo o array de estudantes da collection de tarefas, retirando ou colocando o estudante em questão
            if(done_parameters.set_checked){
                Tasks.update({_id: done_parameters.task_id}, {$push: {students: done_parameters.enrollment_id}})
            }
            else
            {
               Tasks.update({_id: done_parameters.task_id}, {$pull: {students: done_parameters.enrollment_id}}) 
            }

            //atualizo a collection de matriculas, atualizando os campos da tarefa naquela matricula
            Enrollments.update(
                {_id: done_parameters.enrollment_id, 'tasks.task_id': done_parameters.task_id }, 
                {$set: enrollment_task_updated}
            );    
        } 
    });
}
