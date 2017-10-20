import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Broochs = new Mongo.Collection('broochs');

BroochSchema = new SimpleSchema({
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

Broochs.attachSchema(BroochSchema);

Meteor.methods({

    'brooch.insert'(nome,descricao) {
        if (! Meteor.userId || !Roles.userIsInRole(Meteor.user(),['teacher'])) 
            throw new Meteor.Error('not-autorized');
        Broochs.insert({
            name:nome,
            description:descricao,
        });
    },
    'brooch.update'(nome, descricao, imagem, id_brooch) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        Broochs.update({ _id: id_brooch }, {
            $set: {
                name: nome,
                description: descricao,
                image: imagem
            }
        });
    },

    'brooch.delete'(id_brooch) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');
        Broochs.remove(id_brooch);
    }
});

