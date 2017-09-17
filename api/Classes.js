import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Classes = new Mongo.Collection('classes');

ClassSchema = new SimpleSchema({
    name: {
        type: String,
    },

    description: {
        type: String,
    },
    owner:{
        type: String,
        autoValue: function(){
            return this.userId
        }
    },
    createdAt:{
        type: Date,
        autoValue: function(){
            return new Date()
        }

    }
});

Classes.attachSchema(ClassSchema);

Meteor.methods({ 
    'classes.insert'(new_class) {
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher']))
            throw new Meteor.Error('not-authorized');
        
        Classes.insert(new_class);
    },
    /*
    'classes.update'(nome,descricao,id_class) {
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher']))
            throw new Meteor.Error('not-authorized');

        Classes.update({_id: id_class}, {set:{
            name:nome,
            description:descricao
        }});
        
    }
    */

});
