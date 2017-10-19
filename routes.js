FlowRouter.triggers.enter([function(context, redirect){
    if(!Meteor.userId()){
        FlowRouter.go('/')
    }
}]);

FlowRouter.route('/logout',{
    name:'logout',
    action: AccountsTemplates.logout
})

FlowRouter.route('/main', {
    name:'main',
    action(){ 
        BlazeLayout.render('MainLayout', {main: 'ClassList'});
    }
});

FlowRouter.route('/class/:id', {
    name:'class',
    action(){ 
        BlazeLayout.render('MainLayout', {main: 'ClassSingle'});
    }
});

<<<<<<< HEAD
FlowRouter.route('/broochs', {
    name:'broochs',
    action(){ 
        BlazeLayout.render('MainLayout', {main: 'BroochList'});
    }
});

=======
FlowRouter.route('/task/:task_id', {
    name:'task',
    action(){
        console.log('oi');
        BlazeLayout.render('MainLayout', {main: 'TaskSingle'});
    }
});
>>>>>>> 57ba9a751e6dc0fd028387e85da7983b5416dbb9
