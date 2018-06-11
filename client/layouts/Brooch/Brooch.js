Template.Brooch.helpers({
    //retorno a imagem referente ao broche
    imageFile() {
        const current_brooch = Broochs.findOne({_id: this._id})
        return Images.findOne({name: current_brooch.imageName})
    },

    hasImage: (imageName) => {
        return Images.findOne({name: imageName}) !== undefined;
    },
});