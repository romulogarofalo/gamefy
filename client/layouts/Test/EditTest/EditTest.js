Template.EditTest.events({
    'click #cancel': function (event, instance) {
        event.preventDefault();
        $('#edit-test').modal('close');
    },

    'click #update': function (event, template) {
        event.preventDefault();
        let name = $('#name-test').val();
        let points = $('#points-test').val();
        let desc = $('#description-test').val();
        let test_id = $('#test-id').val();
        Meteor.call('tests.update', name, points, desc, test_id);
        template.find(".edit-test-form").reset();
        $('#edit-test').modal('close');

    }
});