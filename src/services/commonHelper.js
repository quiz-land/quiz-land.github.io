import { auth } from "../utilities/auth.js";

export function assembleData(data, quizId) {
    const loggedInUserData = auth.getLoggedInUserData();
    const dataToSend = Object.assign({ creator: addPointerData('_User', loggedInUserData.id) }, data);

    if (quizId !== undefined) {
        dataToSend.quiz = addPointerData('Quiz', quizId);
    }

    return dataToSend;
}

export function addPointerData(className, objectId) {
    return {
        '__type': "Pointer",
        className,
        objectId,
    };
}