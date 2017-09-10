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