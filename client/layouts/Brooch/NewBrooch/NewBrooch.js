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

Template.Brooch.events({

	'click .edit': function (event, instance) {
        var nome = this.name;
        var descr = this.description;
		var id = this._id;
        $('#edit-brooch').modal('open');
        console.log(nome);
        console.log(descr);
		//console.log(instance.find('#name'))
		//instance.find('#name').value = nome;
		document.querySelector('#spanId').textContent = id;
        document.querySelector('#nameBrooch').value = nome;
        document.querySelector('#descriptionBrooch').value = descr;
        $('#brooch-name').focus();
    },

    'click .remove': function (event, intance) {
        var brooch = this.name;
        if(confirm("Deseja mesmo deletar o broche "+ brooch)){
            Meteor.call('brooch.delete', this._id);
            Materialize.toast('Classe Excluida com Sucesso!', 3000);
        }
    },
    
     'click .give': function (event, intance) {
        var brooch_id = this._id;
        document.querySelector('#broochId').textContent = brooch_id;
        $('.check-badge').each(function(index){
                let student_badges = Enrollments.findOne({_id: $(this).attr('id')}).badges;
                console.log(student_badges.includes(brooch_id));
                $(this).prop('checked', student_badges.includes(brooch_id));
        });  
        $('#give-brooch').modal('open'); 
    }

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

		const target = e.target;

		let new_brooch = {name: target.name.value, description: target.description.value, points: target.points.value};
	    const fileArray = target.image.files;
        const image = target.image.files[0];
		const nomeArquivo = Math.random().toString(36).substr(2, 10)+'.png'
	    

	   Meteor.call('brooch.insert', new_brooch, function(error, result){
            if(fileArray && image){
            const upload = Images.insert({
                file: image,
                fileName: nomeArquivo
            });
            upload.on('end', function (error, fileObj) {
                    Meteor.call('brooch.createImages', fileObj.name, result);
                    
                });
            }
        });

		template.find(".new-brooch-form").reset();
		$('#new-brooch').modal('close');
		
    }
});

