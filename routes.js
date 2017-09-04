FlowRouter.triggers.enter([function(context, redirect){
    if(!Meteor.userId()){
        FlowRouter.go('/')
    }
}])


Accounts.onLogin(function(){
    if(Meteor.loggingIn()){
        FlowRouter.go('main');
    }
})

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/'
});

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