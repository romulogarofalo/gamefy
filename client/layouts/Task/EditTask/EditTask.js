Template.EditTask.events({
    'click #cancel': function (event, instance) {
        event.preventDefault();
        $('#edit-task').modal('close');
    },

    'click #update': function (event, template) {
        event.preventDefault();
        let name = $('#name-task').val();
        let desc = $('#description-task').val();
        let task_id = $('#task-id').val();
        console.log(task_id)
        Meteor.call('tasks.update', name, desc, task_id);
        template.find(".edit-task-form").reset();
        $('#edit-task').modal('close');

    }
});