Meteor.methods({
    /*
    'classes.insert'(new_class) {
        if (! Meteor.userId() || !Roles.userIsInRole(Meteor.user(),['teacher']))
            throw new Meteor.Error('not-authorized');
        
        Classes.insert(new_class);
    },
    */
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
});