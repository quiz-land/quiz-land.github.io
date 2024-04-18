export const auth = {
    saveUserData: (userData) =>  sessionStorage.setItem('userData', JSON.stringify(userData)),
    removeUserData: () =>  sessionStorage.removeItem('userData'),
    getLoggedInUserData: () =>  JSON.parse(sessionStorage.getItem('userData')),
    hasLoggedInUser: () =>  sessionStorage.getItem('userData') !== null,
};