Template.ClassSingle.onCreated(function() {
    const self = this;
    self.autorun(function() { 
        self.subscribe('classes');
    }); 
});



Template.ClassSingle.helpers({   
  class: ()=>{
        var id = FlowRouter.getParam('id');
        console.log(id);
        return Classes.findOne({_id: id});
    },
});