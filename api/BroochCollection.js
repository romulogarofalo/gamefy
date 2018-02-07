import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';

Broochs = new Mongo.Collection('broochs');

//crio o schema para a collection dos broches
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
        type: SimpleSchema.Integer
    },

    class_id: {
        type: String
    },

    students:{
        type: Array
    },

    'students.$':{
        type: String
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

    //insiro o broche na collection
    'brooch.insert'(new_brooch) {
        if (! Meteor.userId || !Roles.userIsInRole(Meteor.user(),['teacher'])) 
            throw new Meteor.Error('not-autorized');
            console.log(new_brooch )
        let brooch_id = Broochs.insert({
            name:new_brooch.name,
            description:new_brooch.description,
            points: new_brooch.points,
            class_id: new_brooch.class_id,
            students: []
        });
        return brooch_id;
    },

    //atualizo o broche com a sua imagem
    'brooch.createImages' (filename, brooch_id){
        Broochs.update({_id: brooch_id}, {$set: {imageName: filename}});
    },

    //atualizo a lista de broches dos alunos de uma classe
    'brooch.give' (selected, brooch_id){
        for (s in selected){
            //verifica se aquele aluno do array passado está com 'checked'
            if(selected[s].checked) {
                //verifico se o aluno já não possui aquele broche, se não possuir, adiciono e somo a pontuação do broche aos pontos dele
                if(!Enrollments.findOne({_id: selected[s].id}).badges.includes(brooch_id))
                {
                    const updated_points = Broochs.findOne({_id: brooch_id}).points + Enrollments.findOne({_id: selected[s].id}).points;
                    Enrollments.update({_id: selected[s].id}, {$set: {points: updated_points}});
                    Enrollments.update({_id: selected[s].id}, {$push: {badges: brooch_id}});
                    Broochs.update({_id: brooch_id}, {$push: {students: selected[s].id}})
                }
            }
            else{
                //verifico se o aluno possui aquele broche, se possuir, removo e subtraio a pontuação do broche aos pontos dele
                if(Enrollments.findOne({_id: selected[s].id}).badges.includes(brooch_id)){
                    const updated_points = Enrollments.findOne({_id: selected[s].id}).points - Broochs.findOne({_id: brooch_id}).points;
                    Enrollments.update({_id: selected[s].id}, {$set: {points: updated_points}});
                    Enrollments.update({_id: selected[s].id}, {$pull: {badges: brooch_id}});
                    Broochs.update({_id: brooch_id}, {$pull: {students: selected[s].id}})
                }
            }
        }
    },

    //atualizo nome e descrição do broche na collection
    'brooch.update'( id_brooch, nome, descricao) {

        //verifico se está logado e a autorização
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        Broochs.update({ _id: id_brooch }, {
            $set: {
                name: nome,
                description: descricao,
            }
        });
    },

    //removo o broche da collection
    //TO DO: impedir que ele seja removido caso algum aluno possua-o ou removê-lo automaticamente de todos os alunos
    'brooch.delete'(id_brooch) {

        if(Broochs.findOne({_id: id_brooch}).students.length > 0)
            throw new Meteor.Error(500, 'brooch-given');

        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');
            
        Broochs.remove(id_brooch);
    }
});

