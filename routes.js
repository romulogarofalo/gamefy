FlowRouter.triggers.enter([function(context, redirect){
    if(!Meteor.userId() && FlowRouter.getRouteName() != 'signIn' && FlowRouter.getRouteName() != 'verify-email'){
        console.log(FlowRouter.getRouteName())
        FlowRouter.go('/')
    }
}]);

FlowRouter.route('/', {
    name:'signupform',
    action() {
        BlazeLayout.render('signUp');
    }

});

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

FlowRouter.route('/verify-email/:id', {
    name:'verify-email',
    action(){ 
        BlazeLayout.render('verifyEmail');
    }
});



FlowRouter.route('/class/:id', {
    name:'class',
    action(){ 
        BlazeLayout.render('MainLayout', {main: 'ClassSingle'});
    }
});

FlowRouter.route('/broochs', {
    name:'broochs',
    action(){ 
        BlazeLayout.render('MainLayout', {main: 'BroochList'});
    }
});


FlowRouter.route('/task/:task_id', {
    name:'task',
    action(){
        BlazeLayout.render('MainLayout', {main: 'TaskSingle'});
    }
});

