
Template.Class.onCreated(function () {
    //me inscrevo nas publishs necessarias e pego o id da classe que aquele elemento se refere
    const self = this;
    const id = this.data._id;
    self.autorun(function () {
        self.subscribe('class-image', id);
    });
});

Template.Class.helpers({
  //retorno a imagem referente a aquela classe
  imageFile(){
    const current_class = Classes.findOne({_id: this._id})
    return Images.findOne({name: current_class.imageName});
  },

  hasImage: (imageName) => {
        return Images.findOne({name: imageName}) !== undefined;
  },

});