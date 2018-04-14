const validateEmail = (email, errorMessage) => {
    if (!isValidEmail(email)) {
        errorMessage += 'Please enter a valid email\n'
    }
    return errorMessage
}

const isValidEmail = (email) => {
    let emailPatternReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return emailPatternReg.test(email);
}

export {
    validateEmail, isValidEmail
}
