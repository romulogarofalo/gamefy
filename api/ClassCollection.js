import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import { FilesCollection } from 'meteor/ostrio:files';

/*Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  }
});
*/
Classes = new Mongo.Collection('classes');

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
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher']))
            throw new Meteor.Error('not-authorized');
        console.log(new_class);
        created_class_id = Classes.insert(new_class);
        console.log(created_class_id);
        return created_class_id;
    },

    'classes.createImages' (filename, class_id){
        Classes.update({_id: class_id}, {$set: {imageName: filename}});
    }

    /*
    'classes.update'(nome, descricao, id_class) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');

        Classes.update({ _id: id_class }, {
            $set: {
                name: nome,
                description: descricao
            }
        });
    },

    'classes.delete'(id_class) {
        if (!Meteor.userId() || !Roles.userIsInRole(Meteor.user(), ['teacher']))
            throw new Meteor.Error('not-authorized');
        Classes.remove(id_class);
    }
*/
});
