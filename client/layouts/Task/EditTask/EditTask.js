Template.EditTask.events({
    'click #cancel': function (event, instance) {
        event.preventDefault();
        $('#edit-task').modal('close');
    },

    'submit .edit-task-form': function (event, template) {
        event.preventDefault();
        let name = $('#name-task').val();
        let desc = $('#description-task').val();
        let task_id = $('#task-id').val();
        console.log(task_id)
        Meteor.call('tasks.update', name, desc, task_id);
        Materialize.toast('Tarefa Editada com Sucesso!', 3000);
        template.find(".edit-task-form").reset();
        $('#edit-task').modal('close');

    }
});