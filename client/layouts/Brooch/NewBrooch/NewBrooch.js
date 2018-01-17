Template.BroochList.onCreated(function () {
    //pego os parametros da url e me inscrevo nas publishs necessárias
    const self = this;
    self.autorun(function () {
        self.subscribe('broochs');
		self.subscribe('Images');
    });

    //crio um dicionario reativo para lidar com as páginas e configuro o valor inicial
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
        
        //pego o id do broche ao qual aquele elemento se refere
        var brooch_id = this._id;

        //TO DO: mudar pra input type=hidden
        document.querySelector('#broochId').textContent = brooch_id;

        //populo a modal de premiar/retirar broches com os alunos daquela sala
        $('.check-badge').each(function(index){
                let student_badges = Enrollments.findOne({_id: $(this).attr('id')}).badges;
                /*
                    pego o array de broches do aluno e verifico se ele possui o broche com o id pego anteriormente 
                    para setar o atributo checked
                */
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

        //crio um objeto com os valores inseridos pelo usuario sem a imagem
		let new_brooch = {name: target.name.value, description: target.description.value, points: target.points.value};

        //pego a imagem
	    const fileArray = target.image.files;
        const image = target.image.files[0];
		const nomeArquivo = Math.random().toString(36).substr(2, 10)+'.png'
	    

	   Meteor.call('brooch.insert', new_brooch, function(error, result){
           //caso a inserção seja um sucesso inicio o upload da imagem
            if(fileArray && image){
            const upload = Images.insert({
                file: image,
                fileName: nomeArquivo
            });
            //ao fim do upload, chamo o metodo createImages no servidor para salvar o nome da imagem na classe
            upload.on('end', function (error, fileObj) {
                    Meteor.call('brooch.createImages', fileObj.name, result);
                    
                });
            }
        });

		template.find(".new-brooch-form").reset();
		$('#new-brooch').modal('close');
		
    }
});

