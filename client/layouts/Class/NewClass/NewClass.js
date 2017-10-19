Template.ClassList.onCreated(function () {
    const self = this;
    self.autorun(function () {
        self.subscribe('classes');
    });
    this.state = new ReactiveDict();
    const instance = Template.instance();
    instance.state.set('skip', 0);
});

Template.ClassList.events({
    'click .black-text': function (event, instance) {
        //alert('aqui');
        var id = this._id;
        var nome = this.name;
        var descr = this.description;
        console.log(id);
        console.log(nome);
        console.log(descr);
        //console.log("aaaa");
        $('#edit-class').modal('open');
        document.querySelector('#spanId').textContent = id;
        document.querySelector('#nomeClasse').value = nome;
        document.querySelector('#descricaoClasse').value = descr;
        $('#nomeClasse').focus();
    },

    'click .red-text': function (event, intance) {
        var sala = this.name;
        if(confirm("Deseja mesmo deletar a classe "+ sala)){
            Meteor.call('classes.delete', this._id);
            Materialize.toast('Classe Excluida com Sucesso!', 3000);
        }
    }

});


Template.ClassList.helpers({

    classes: () => {
        const instance = Template.instance();
        return Classes.find({}, { limit: 3, skip: instance.state.get('skip') });
    },

    hasClasses: () => {
        return Classes.find({}).count() > 0;
    },

    addClass: () => {
        return function () {
            $('#new-class').modal('open');
        }
    },

    prevClasses: () => {
        const instance = Template.instance();
        return function () {
            if (instance.state.get('skip') >= 3) {
                instance.state.set('skip', instance.state.get('skip') - 3);
            }
        }
    },

    nextClasses: () => {
        const instance = Template.instance();
        return function () {
            if (instance.state.get('skip') + 3 < Classes.find({}).count()) {
                instance.state.set('skip', instance.state.get('skip') + 3);
            }
        }
    }

});

$(document).ready(function () {
    $('.modal').modal();
});


Template.NewClass.events({
    'submit .new-class-form': function (event, template) {

        event.preventDefault();

        // Get value from form element
        const target = event.target;
        const new_class = { name: target.name.value, description: target.description.value };
        Meteor.call('classes.insert', new_class);
        template.find(".new-class-form").reset();
        $('#new-class').modal('close');

    }
});

Template.ClassList.events({
    'click .black-text': function (event, instance) {
        //alert('aqui');
        var id = this._id;
        var nome = this.name;
        var descr = this.description;
        console.log(id);
        console.log(nome);
        console.log(descr);
        //console.log("aaaa");
        $('#edit-class').modal('open');
        document.querySelector('#spanId').textContent = id;
        document.querySelector('#nomeClasse').value = nome;
        document.querySelector('#descricaoClasse').value = descr;
        $('#nomeClasse').focus();
    },

    'click .red-text': function (event, instance) {
        var sala = this.name;
        if(confirm("Deseja mesmo deletar a classe "+ sala))
        {
        Meteor.call('classes.delete', this._id);
        Materialize.toast('Classe Excluida com Sucesso!', 3000);
        console.log(instance.state.get('skip'));
        console.log(Classes.find({}).count());
        if (instance.state.get('skip') >= Classes.find({}).count() - 1 && instance.state.get('skip') > 0) {
                instance.state.set('skip', instance.state.get('skip') - 3);
                console.log(instance.state.get('skip'))
            }
        }
    }

});