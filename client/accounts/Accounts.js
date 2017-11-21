T9n.setLanguage("pt");

let myPostLogout = function(){
    FlowRouter.go('signin');
};


AccountsTemplates.configure({
  defaultLayout: 'HomeLayout',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  defaultTemplate: 'AccountLayout',
  continuousValidation: true,
  onLogoutHook: myPostLogout,
});

AccountsTemplates.configureRoute('signIn', {
  name: 'signin',
  path: '/',
  redirect: '/main'
});

AccountsTemplates.configureRoute('signUp', {
  name: 'signUp',
  path: '/',
  redirect: '/main'
});



AccountsTemplates.addFields([
     {
        _id: 'role',
        type: 'select',
        displayName: 'Você é?',
        required: true,
        select: [
        {
            text: "Aluno",
            value: "student",
        },
        {
            text: "Professor",
            value: "teacher",
        },
        ],
    },
    
    {
        _id: 'name',
        type: 'text',
        displayName:'Nome',
        required: true,
        re: /(?=.*[A-Z])(?=.*[a-z])/,
        errStr: 'O nome Precisa ter pelo menos uma letra minuscula e uma maiuscula',
    },
]);

