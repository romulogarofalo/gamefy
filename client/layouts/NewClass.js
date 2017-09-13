Template.ClassList.onCreated(function() {
    const self = this;
    self.autorun(function() { 
        self.subscribe('classes');
    }); 
    this.state = new ReactiveDict();
    const instance = Template.instance();
    instance.state.set('skip', 0);
});



Template.ClassList.helpers({
    
  classes:()=> {
        const instance = Template.instance();
        return Classes.find({}, {limit: 3, skip: instance.state.get('skip')});
    },

  hasClasses: ()=>{
       return Classes.find({}).count() > 0;
  },

  addClass: ()=>{
      return function(){
        $('#new-class').modal('open');
      }
  },

  prevClasses: ()=>{
      const instance = Template.instance();
      return function(){
        if(instance.state.get('skip') >= 3)
        {
            instance.state.set('skip',instance.state.get('skip') - 3);
        }
      }
  },

  nextClasses: ()=>{
      const instance = Template.instance();
      return function(){
          if(instance.state.get('skip') + 3 < Classes.find({}).count()){
            instance.state.set('skip', instance.state.get('skip') + 3);
         }
      }
  }

});

$(document).ready(function() {
    $('.modal').modal();
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