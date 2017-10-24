Template.BroochList.onCreated(function () {
    const self = this;
    self.autorun(function () {
        self.subscribe('broochs');
		self.subscribe('Images');
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
		const nomeArquivo = Math.random().toString(36).substr(2,10)+'.png';
       // let imagem = e.currentTarget.getElementsByTagName('input')[2].files[0];


	   const target = e.target;
	   
	   console.log(target.image.files[0]);

	   if (target.image.files && target.image.files[0]) {
			const upload = Images.insert({
				file:target.image.files[0], 
				fileName: nomeArquivo,
		   });
			upload.on('end', function (error, fileObj){
				console.log(upload);	
			
			
			});
	   }


    	Meteor.call('brooch.insert', nome,descricao,nomeArquivo);
		template.find(".new-brooch-form").reset();
		console.log("foi");
    }
});

