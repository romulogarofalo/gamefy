import { ReactiveDict } from 'meteor/reactive-dict';


Template.ClassSingle.onCreated(function() {
    //me inscrevo nas publishs necessarias
    const self = this;
    self.autorun(function() { 
        self.subscribe('classes');
    }); 

    //crio um dicionário reativo para lidar com as tabs e configuro a tab inicial
    this.state = new ReactiveDict();
    this.state.set('currentTab', 'Students');
});

//inicializo e configuro os elementos de UI do Materialize
Template.ClassSingle.onRendered(function() {
    $('.modal').modal();
    $('ul.tabs').tabs();
    $(".tabs>.indicator").css("background-color", 'green');

});


Template.ClassSingle.helpers({ 

    //retorno a tab atual
    tab: ()=> {
        const instance = Template.instance();
        var tab = instance.state.get('currentTab');
        tab = tab.charAt(0).toUpperCase() + tab.slice(1);
        console.log(tab);
        return tab;
    },

    class: ()=>{
        const id = FlowRouter.getParam('id');
        return Classes.findOne({_id: id});
    },
});

Template.ClassSingle.events({ 
    'click .tabs li': function(event, instance) { 
        instance.state.set('currentTab', event.target.id);
    } 
});