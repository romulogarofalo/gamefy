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
    imageName: {
        type: String,
        optional: true
    },
    owner:{
        type: String,
        autoValue: function(){
            return this.userId
        }
    },

    points: {
        type: SimpleSchema.Integer,
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

    'brooch.insert'(new_brooch) {
        if (! Meteor.userId || !Roles.userIsInRole(Meteor.user(),['teacher'])) 
            throw new Meteor.Error('not-autorized');
        let brooch_id = Broochs.insert({
            name:new_brooch.name,
            description:new_brooch.description,
            points: new_brooch.points
        });
        return brooch_id;
    },

    'brooch.createImages' (filename, brooch_id){
        console.log(filename);
        console.log(brooch_id);
        Broochs.update({_id: brooch_id}, {$set: {imageName: filename}});
    },

    'brooch.give' (selected, brooch_id){
        for (s in selected){
            if(selected[s].checked) {
                if(!Enrollments.findOne({_id: selected[s].id}).badges.includes(brooch_id))
                {
                    const updated_points = Broochs.findOne({_id: brooch_id}).points + Enrollments.findOne({_id: selected[s].id}).points;
                    Enrollments.update({_id: selected[s].id}, {$set: {points: updated_points}});
                    Enrollments.update({_id: selected[s].id}, {$push: {badges: brooch_id}});
                }
                else{
                    console.log('o aluno ja tem esse broche');
                }
            }
            else{
                if(Enrollments.findOne({_id: selected[s].id}).badges.includes(brooch_id)){
                    const updated_points = Enrollments.findOne({_id: selected[s].id}).points - Broochs.findOne({_id: brooch_id}).points;
                    Enrollments.update({_id: selected[s].id}, {$set: {points: updated_points}});
                    Enrollments.update({_id: selected[s].id}, {$pull: {badges: brooch_id}});
                }
            }
        }
    },

    'brooch.update'( id_brooch, nome, descricao) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        Broochs.update({ _id: id_brooch }, {
            $set: {
                name: nome,
                description: descricao,
            }
        });
    },

    'brooch.delete'(id_brooch) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');
        Broochs.remove(id_brooch);
    }
});

