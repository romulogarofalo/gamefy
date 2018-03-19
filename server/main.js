import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  process.env.MAIL_URL = "smtp://postmaster@sandboxcc7887c70bc847928384a748163de249.mailgun.org:1327c7de8993a54f1df886f6ff6d5365@smtp.mailgun.org:587";
});


AccountsTemplates.configure({
  postSignUpHook: function(userId, info){
    let user = Meteor.users.findOne({_id: userId});
    console.log(user);
    Meteor.call('add-role', user);
    },
});

Meteor.setInterval(function() {
   const current_time = new Date()
   
   Tests.update(
     {start_time: {$lte: current_time}, end_time: {$gte: current_time}, status: 0},
     {$set: {status: 1, publishing: true}}
   );

   Tests.update(
     {end_time: {$lte: current_time}, status: 1},
     {$set: {status: 2}}
   );

   const months = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro' ]

   Tests.find({status: 1, publishing: true}).forEach(function(test){
        Enrollments.update(
            {class_id: test.class_id}, 
            { $push: {tests: { test_id: test._id, done: false, max_points: test.points}}
        },{ multi: true });
        const class_name = Classes.findOne({_id: test.class_id}).name
        Enrollments.find({class_id: test.class_id}).forEach(function (enrollment) {
          const email = Meteor.users.findOne({_id: enrollment.student_id}).emails[0].address
          Email.send({
                to: email,
                from: "noreply@gamify.com",
                subject: "Novo questionário para você - Gamify",
                html: `<h4>Bom dia ${enrollment.student_name}</h4>. 
                          <p>Um novo questionário está disponível para você na sala ${class_name}  
                          até a hora ${test.end_time.getHours()} : ${test.end_time.getHours()}
                          do dia ${test.end_time.getDate()} de ${months[test.end_time.getMonth()]}</p>

                          <p>Até logo, e bons estudos</p>

                          <p>Gamify School</p>`,
            });
        })
    });

    Tests.update(
     {publishing: true},
     {$set: {status: 1, publishing: false}}
   );
    
}, 60000);
