export function validateRegisterUserData(userData) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (userData.username === '') {
        throw new Error('The username is required.');
    }

    if (emailRegex.test(userData.email) === false) {
        throw new Error('Incorrect email format.');
    }

    if (userData.password === '') {
        throw new Error('The password is required.');
    }

    if (userData.repass !== undefined && userData.password !== userData.repass) {
        throw new Error('The passwords don\'t match.');
    }
}

export function validateQuizData(quizData) {
    if (quizData.title === '') {
        throw new Error('The title is required.');
    }

    if (quizData.topic === 'all') {
        throw new Error('Please, select topic.');
    }
}

export function validateQuestionData(questionData) {
    if (questionData.tempText === undefined || questionData.tempText === '') {
        throw new Error('Please, enter a question.');
    }

    if (questionData.tempAnswers.length < 2) {
        throw new Error('Please, enter at least 2 answers.');
    }

    if (questionData.tempAnswers.some(a => a === '')) {
        throw new Error('The question shouldn\'t contain empty answer/s.');
    }
    
    if (questionData.tempCorrectIndex === undefined || questionData.tempCorrectIndex === null) {
        throw new Error('Please, select a correct answer.');
    }
}