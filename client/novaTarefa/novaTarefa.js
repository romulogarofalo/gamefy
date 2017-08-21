Template.novaTarefa.events({
	
	"submit form": function(e,template){
		e.preventDefault();

		var input = $("#tarefa");
		var nome = input.val();


		Tarefa.insert({nome: nome});
		input.val("");
	}


});