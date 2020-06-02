const readline = require("readline")
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const {abortProcess} = require('./utilities')

const validatePassword = async () => {
    var password
    var result = await checkPassword('Jepni fjalekalimin: ','continue').then(pass=>{
        if(pass.length<6) abortProcess('Fjalekalimi duhet te kete gjatesine se paku 6 karaktere')
        password = pass
        return checkPassword('Perserit fjalekalimin: ','end')
    })
    .then(cpassword=>{
        if(password !== cpassword) abortProcess('Gabim: Fjalekalimet nuk perputhen')
        if(!password.match(/[0-9]/) && !password.match(/[0-9]/) && !cpassword.match(/[^0-9a-zA-Z]/) && !cpassword.match(/[^0-9a-zA-Z]/)) abortProcess('Gabim: Fjalekalimi duhet te permbaje se paku nje numer ose simbol')
        return cpassword
    })
    .catch(error=>{
        console.log('error')
    })
    return result
}

const setPassword = async function(name){
    if(fs.existsSync(path.join(__dirname,'../Core/Users/'+name+'.rtf'))) abortProcess('Shfrytezuesi ekziston paraprakisht')
    const password = await validatePassword()
    const hashname = crypto.createHash('sha256').update(name).digest('base64')
    const salt = crypto.randomBytes(16).toString('base64')
    const saltedpassword = crypto.createHmac('sha512', salt).update(password).digest('base64')
    const fileText = `Name: ${hashname}\nPassword: ${salt}.${saltedpassword}`
    var buf = Buffer.from(fileText, 'utf8');
    const publicKey = fs.readFileSync(path.join(__dirname,'../Core/CoreKeys/dscore.pub.pem'))   
    const encrypted = crypto.publicEncrypt(publicKey, buf)
    fs.writeFileSync(path.join(__dirname,'../Core/Users/'+name+'.rtf'),encrypted.toString('base64'),(err)=>{
        if(err) throw err
    })
    console.log(`Eshte krijuar shfrytezuesi ${name}`)
}

const checkPassword = (question,flag) => {
    let readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
  
    return new Promise(resolve=>{
        readlineInterface.question(question,answer => {
            resolve(answer)
            if(flag == 'end'){
                process.stdin.destroy()
            }
            readlineInterface.close()
        })
    })
}

module.exports.setPassword = setPassword;