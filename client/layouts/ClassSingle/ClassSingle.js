import { ReactiveDict } from 'meteor/reactive-dict';


Template.ClassSingle.onCreated(function() {
    const self = this;
    self.autorun(function() { 
        self.subscribe('classes');
    }); 
    this.state = new ReactiveDict();
    this.state.set('currentTab', 'Students');
});


Template.ClassSingle.onRendered(function() {
    $('.modal').modal();
    $('ul.tabs').tabs(); 
});


Template.ClassSingle.helpers({ 

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