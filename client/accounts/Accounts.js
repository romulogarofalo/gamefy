T9n.setLanguage("pt");

AccountsTemplates.configure({
  defaultLayout: 'HomeLayout',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  continuousValidation: true,
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
])