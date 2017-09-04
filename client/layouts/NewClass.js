Template.ClassList.onCreated(function() {
    const self = this;
    self.autorun(function() { 
        self.subscribe('classes');
    }); 
    Session.setDefault('skip', 0);
});



Template.ClassList.helpers({
    
  classes() {
        return Classes.find({}, {limit: 3, skip: Session.get('skip')});
    },
});

$(document).ready(function() {
    $('.modal').modal();
    console.log('iniciado');
});

Template.ClassList.events({ 
    'click .add-class'() { 
         $('#modal1').modal('open');
    },

    'click .previous'(event){
        if(Session.get('skip') >= 3){
        Session.set('skip',Session.get('skip') - 3);
        }
    },

    'click .next'(event){
        if(Session.get('skip') + 3 < Classes.find({}).count()){
        Session.set('skip',Session.get('skip') + 3);
        }
    },

});


Template.NewClass.events({ 
    'submit .new-class-form': function(event, template) {
    
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const new_class = {name: target.name.value, description: target.description.value};
    Meteor.call('classes.insert', new_class);
    template.find(".new-class-form").reset();
    $('#modal1').modal('close');
         
    } 
});