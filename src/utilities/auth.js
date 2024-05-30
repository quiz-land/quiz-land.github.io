export const auth = {
    saveUserData: (userData) =>  localStorage.setItem('userData', JSON.stringify(userData)),
    removeUserData: () =>  localStorage.removeItem('userData'),
    getLoggedInUserData: () =>  JSON.parse(localStorage.getItem('userData')),
    hasLoggedInUser: () =>  localStorage.getItem('userData') !== null,
};