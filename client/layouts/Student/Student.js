Template.Student.helpers({

    //retorno a posição do aluno no ranking
    ranking: (points)=>{
        return Enrollments.find({points: {$gt: points}}).count() + 1;
    },

    //verifico se o usuário atual é o aluno ao qual aquele elemento se refere
    isCurrentUser: ()=>{
        console.log(Enrollments.find({student_id: Meteor.userId()}))
        return Enrollments.findOne({student_id: Meteor.userId()});
    }
});