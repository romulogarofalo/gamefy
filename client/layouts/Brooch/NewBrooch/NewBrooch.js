Template.BroochList.onCreated(function () {
    const self = this;
    self.autorun(function () {
        self.subscribe('broochs');
    });
    this.state = new ReactiveDict();
    const instance = Template.instance();
    instance.state.set('skip', 0);
});

Template.BroochList.events({

	//evento de editar

	//evento de deletar

});


Template.BroochList.helpers({

	brooch: () => {
		const instance = Template.instance();
		return Broochs.find({}, { limit:3, skip: instance.state.get('skip')});
	},	

	hasBrooch: () => {
		return Broochs.find({}).count() > 0;
	},

	addBrooch: () => {
		return function () {
			$('#new-brooch').modal('open');
		}
	},

});

Template.NewBrooch.events({
    'submit .new-brooch': function (e, template) {
		e.preventDefault();
    	console.log("form brooch");

        let nome = e.target.name.value;
    	let descricao = e.target.description.value;

       // let imagem = e.currentTarget.getElementsByTagName('input')[2];
    	Meteor.call('brooch.insert', nome,descricao);
		template.find(".new-brooch-form").reset();
		console.log("foi");


        

        // Get value from form element
        /*
        const target = event.target;
        const new_brooch = { name: target.name.value, description: target.description.value, image: target.img.value };
        Meteor.call('brooch.insert', new_brooch);
        template.find(".new-brooch-form").reset();
        $('#new_brooch').modal('close');
*/
    }
});

