import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { FilesCollection } from 'meteor/ostrio:files';

Classes = new Mongo.Collection('classes');

//crio o schema para a collection das classes
ClassSchema = new SimpleSchema({
    name: {
        type: String,
    },

    description: {
        type: String,
    },

    imageName: {
        type: String,
        optional: true,
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

        //verifico se está  logado e se é professor
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher']))
            throw new Meteor.Error('not-authorized');
        created_class_id = Classes.insert(new_class);

        //retorno o id da classe para utilizá-lo no upload da imagem
        return created_class_id;
    },

    //atualizo a classe com a imagem dela
    'classes.createImages' (filename, brooch_id){
        Classes.update({_id: brooch_id}, {$set: {imageName: filename}});
    },

    //atualizo a classe com as novas informações de nome e descrição
    //TO DO: permitir a atualização da imagem
    'classes.update'(nome, descricao, id_class) {

        //verifico se está logado e autorização
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        Classes.update({ _id: id_class }, {
            $set: {
                name: nome,
                description: descricao
            }
        });
    },

    //deleto a classe passada da Collection
    //TO DO: deletar os dados referentes a essa classe das outras collections (matriculas, tarefas e broches)
    'classes.delete'(id_class) {

        //verifico se está logado e autorização
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');
        Classes.remove(id_class);
    }

});
