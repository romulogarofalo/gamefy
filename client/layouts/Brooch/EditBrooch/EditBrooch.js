Template.EditBrooch.events({
    'click #cancela': function (event, instance) {
        event.preventDefault();
        $('#edit-brooch').modal('close');
    },

    'submit .edit-brooch-form': function (event, instance) {
        event.preventDefault();
        const target = event.target;
        let nome = target.name.value
        let desc = target.description.value
        let idBrooch = document.querySelector('#spanId').textContent;
        console.log(nome);
        console.log(desc);
        Meteor.call('brooch.update',idBrooch, nome, desc);
        instance.find(".edit-brooch-form").reset();
        $('#edit-brooch').modal('close');

    }
});