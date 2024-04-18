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

export function validateLoginUserData(userData) {
    if (userData.email === '' || userData.password === '') {
        throw new Error('All fields are required.');
    }
}

export function validateSolutionData(solutionData) {
    if (solutionData.some(sd => sd === '')) {
        throw new Error('All fields are required.');
    }
}