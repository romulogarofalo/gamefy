Template.Question.helpers({
    imageFile: (imageName) => {
        console.log(imageName)
       return Images.findOne({name: imageName}).link();
    },

    questionAnswers: (answers) => {
        return answers;
    }
});  