import { FilesCollection } from 'meteor/ostrio:files';

//crio a Collection de imagens e configuro
Images = new FilesCollection({
    collectionName: 'Images',
    allowClientCode: false,
    onBeforeUpload(file) {
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
                return true;
        } else {
                return 'Please upload image, with size equal or less than 10MB';
        }
    }
}); 



if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}