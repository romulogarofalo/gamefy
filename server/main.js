import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
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
    Tests.find({status: 1, publishing: true}).forEach(function(test){
        Enrollments.update(
            {class_id: test.class_id}, 
            { $push: {tests: { test_id: test._id, done: false, max_points: test.points}}
        });
    });

    Tests.update(
     {publishing: true},
     {$set: {status: 1, publishing: false}}
   );
    
}, 60000);
