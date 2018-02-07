//TO DO: criar um arquivo ClassList.js e transferir parte desse código para ele 


Template.ClassList.onCreated(function () {
    //me inscrevo nas publishs necessárias
    const self = this;
    self.autorun(function () {
        self.subscribe('classes');
    });

    //crio o Dictionary reativo para o sistema de páginas e configuro o valor inicial
    this.state = new ReactiveDict();
    const instance = Template.instance();
    instance.state.set('skip', 0);
});

Template.ClassList.events({
    'click .edit': function (event, instance) {
        //pego os valores daquele elemento da interface e jogo na modal
        var id = this._id;
        var nome = this.name;
        var descr = this.description;
        $('#edit-class').modal('open');
        document.querySelector('#spanId').textContent = id;
        document.querySelector('#nomeClasse').value = nome;
        document.querySelector('#descricaoClasse').value = descr;
        $('#nomeClasse').focus();
    },

    'click .remove': function (event, instance) {
        var sala = this.name;
        if(confirm("Deseja mesmo deletar a classe "+ sala)){
            Meteor.call('classes.delete', this._id);
            Materialize.toast('Classe Excluida com Sucesso!', 3000);

            //atualizo a variavel skip do dicionário reativo para atualizar as páginas de acordo com a nova quantidade de classes
            if (instance.state.get('skip') >= Classes.find({}).count() - 1 && instance.state.get('skip') > 0) {
                instance.state.set('skip', instance.state.get('skip') - 3);
                console.log(instance.state.get('skip'))
            }
        }
    }

});


Template.ClassList.helpers({

    //retorno as classes daquela pagina
    classes: () => {
        const instance = Template.instance();
        return Classes.find({}, { limit: 3, skip: instance.state.get('skip') });
    },

    username: () => {
        return Meteor.user().profile.name; 
    },

    //verifico se o professor possui alguma classe
    hasClasses: () => {
        return Classes.find({}).count() > 0;
    },

    addClass: () => {
        return function () {
            $('#new-class').modal('open');
        }
    },

    //levo o usuário para a página de classes anterior, caso ela exista
    prevClasses: () => {
        const instance = Template.instance();
        return function () {
            if (instance.state.get('skip') >= 1) {
                instance.state.set('skip', instance.state.get('skip') - 1);
            }
        }
    },

    //levo o usuário para a próxima página de classes, caso ela exista
    nextClasses: () => {
        const instance = Template.instance();
        return function () {
            if (instance.state.get('skip') + 3 < Classes.find({}).count()) {
                instance.state.set('skip', instance.state.get('skip') + 1);
            }
        }
    }

});

//inicializo as modais
$(document).ready(function () {
    $('.modal').modal();
});


Template.NewClass.events({
    'submit .new-class-form': function (event, template) {

        event.preventDefault();

        //pego a imagem
        const target = event.target;
        const fileArray = target.image.files;
        const image = target.image.files[0];

        //crio um objeto com os valores inseridos pelo usuario sem a imagem
        let new_class = { name: target.name.value, description: target.description.value};
        Meteor.call('classes.insert', new_class, function(error, result){
            //caso a inserção seja um sucesso inicio o upload da imagem
            if(fileArray && image){
            const upload = Images.insert({
                file: image,
                fileName: Math.random().toString(36).substr(2, 10)+'.png' 
            });
            //ao fim do upload, chamo o metodo createImages no servidor para salvar o nome da imagem na classe
            upload.on('end', function (error, fileObj) {
                    Meteor.call('classes.createImages', fileObj.name, result);
                    
                });
            }
        });
        
        template.find(".new-class-form").reset();
        $('#new-class').modal('close');

    }
});