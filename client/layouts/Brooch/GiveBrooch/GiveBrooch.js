Template.GiveBrooch.onCreated(function() {
    const self = this;
    const class_id = FlowRouter.getParam('id');
    self.autorun(function() { 
        self.subscribe('students', class_id);
    });
});

Template.GiveBrooch.onRendered(function () {
        $('select').material_select();
});

Template.GiveBrooch.helpers({
     students:()=> {
        return Enrollments.find({});
    },

    updateSelect: ()=> {
         $('select').material_select();
    },
});

Template.GiveBrooch.events({ 
    'submit .give-brooch-form': function(event, template) { 
        event.preventDefault();
        var selected = [];
        $('.check-badge').each(function(index){
                selected.push({id: $(this).attr('id'), checked: $(this).prop('checked')});
        });
        let brooch_id = document.querySelector('#broochId').textContent;
        Meteor.call('brooch.give', selected, brooch_id);
        template.find(".give-brooch-form").reset();
        $('#give-brooch').modal('close');
        //let idBrooch = document.querySelector('#broochId').textContent;
    } 

});