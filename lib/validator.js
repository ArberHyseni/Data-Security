const readline = require("readline")
const {abortProcess} = require('./utilities')

const validatePassword = () => {
    const password = await checkPassword('Jepni fjalekalimin: ')
    const cpassword = await checkPassword('Perserit fjalekalimin: ')
    const {regex1,regex2} = [/[0-9]/,/[^0-9a-zA-Z]/]
    if(password !== cpassword) abortProcess('Gabim: Fjalekalimet nuk perputhen.')
    if(!regex1.test(password) || !regex1.test(cpassword) || !regex2.test(password) || !regex2.test(cpassword)) abortProcess('Gabim: Fjalekalimi duhet te permbaje se paku nje numer ose simbol')
    return password
}   

const setPassword = password => {
    
}

const checkPassword = (question) => {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    return new Promise(resolve=>{
        readlineInterface.question(question,answer => {
            resolve(answer)
            readlineInterface.close()
        })
    })
}


module.exports = {setPassword,checkPassword}