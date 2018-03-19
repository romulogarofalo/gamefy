Template.EditAvatar.events({
    'submit .edit-avatar-form': function (e, template) {
		e.preventDefault();

		const target = e.target;

        //pego a imagem
	    const fileArray = target.image.files;
        const image = target.image.files[0];
		const nomeArquivo = Math.random().toString(36).substr(2, 10)+'.png'
	    
        if(fileArray && image){
            const upload = Images.insert({
                file: image,
                fileName: nomeArquivo
            });
            //ao fim do upload, chamo o metodo createImages no servidor para salvar o nome da imagem na classe
            upload.on('end', function (error, fileObj) {
                Meteor.call('edit-avatar', fileObj.name);     
            });
            template.find(".edit-avatar-form").reset();
		    $('#edit-avatar').modal('close');
        }
        else{
            alert('Por favor insira uma imagem')
        }
    }
});