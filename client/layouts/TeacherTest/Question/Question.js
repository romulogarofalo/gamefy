Template.Question.helpers({

    hasImage: (imageName) => {
        return Images.findOne({name: imageName}) !== undefined;
    },

    imageFile: (imageName) => {
       return Images.findOne({name: imageName}).link();
    },

    questionAnswers: (answers) => {
        return answers;
    },

    questionNumber: () =>{
        const question_number = Template.instance().data.number
        return question_number;
    },

    isCorrect: (number) =>{
        const question_number = Template.instance().data.number
        const question = Tests.findOne({}).questions.find((question) => question.number === question_number)
        const correct_answer = question.correct_answer
        return number == correct_answer
    },

    testEditable: () =>{
        return Tests.findOne({}).status == 0;
    }
});  