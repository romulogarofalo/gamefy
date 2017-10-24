Template.Class.onCreated(function () {
    const self = this;
    const id = this.data._id;
    self.autorun(function () {
        self.subscribe('class-image', id);
    });
});

Template.Class.helpers({
  imageFile(){
  const current_class = Classes.findOne({_id: this._id})
  return Images.findOne({name: current_class.imageName});
  }
});