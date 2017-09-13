Template.PageButtons.events({ 
    
    'click .previous'(event, instance){
        instance.data.previous();
    },

    'click .next'(event, instance){
        instance.data.next();
    },

});