Meteor.publish('classes', function() {
    return Classes.find({
        owner: this.userId
    });
    
});