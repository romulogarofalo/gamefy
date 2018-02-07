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

FlowRouter.route('/test/:test_id', {
    name:'test',
    action(){
        if (Roles.userIsInRole(Meteor.user(),['teacher'])){
            BlazeLayout.render('MainLayout', {main: 'TestSingle'});
        }
        else{
            BlazeLayout.render('MainLayout', {main: 'StudentTest'}); 
        }
    }
});

