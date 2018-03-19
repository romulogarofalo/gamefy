Template.EditTask.events({
    'click #cancel-task-edit': function (event, instance) {
        event.preventDefault();
        $('#edit-task').modal('close');
    },

    'submit .edit-task-form': function (event, template) {
        event.preventDefault();
        let name = $('#name-task-edit').val();
        let desc = $('#description-task-edit').val();
        let task_id = $('#task-id').val();
        console.log(task_id)
        Meteor.call('tasks.update', name, desc, task_id);
        Materialize.toast('Tarefa Editada com Sucesso!', 3000);
        template.find(".edit-task-form").reset();
        $('#edit-task').modal('close');

    }
});