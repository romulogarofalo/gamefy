Template.Brooch.helpers({
    imageFile() {
        const current_brooch = Broochs.findOne({_id: this._id})
        return Images.findOne({name: current_brooch.imageName})
    }
});