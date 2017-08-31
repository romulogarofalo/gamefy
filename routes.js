FlowRouter.triggers.enter([function(context, redirect){
    if(!Meteor.userId()){
        FlowRouter.go('/')
    }
}])

Accounts.onLogin(function(){
    FlowRouter.go('main');
})

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/'
});

FlowRouter.route('/main', {
    name:'main',
    action(){ 
        BlazeLayout.render('MainLayout', {main: 'Classes'});
    }
})