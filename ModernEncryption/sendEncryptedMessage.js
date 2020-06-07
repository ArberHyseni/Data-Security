const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const os = require('os')
const {abortProcess} = require('../lib/utilities')
const {Verify_This_Token} = require('./jwtfunction')

const encryptMessage = (name,message,file,token) => {
  if(file == '--sender'){
    file = null
    token = process.argv[6]
  } 
  var encodedName = Buffer.from(name).toString('base64') //base64(utf8(<name>))
  var iv = crypto.randomBytes(8).toString('base64') // base64(<iv>)
  var key = crypto.randomBytes(8) //key
  
  var publicKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pub.pem') //publicKey
  var encrypted = crypto.publicEncrypt(publicKey, key) //rsa(<key>)
  const cipher = crypto.createCipheriv('des-ecb', key, null) 
  let result = cipher.update(message,'utf8','base64') // base64(des(<message>))
  result += cipher.final('base64')
  result = result.toString('base64')

  var allTokens = fs.readFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf')).toString()
  if(allTokens==null || typeof allTokens == 'undefined') abortProcess('No Tokens Found')
  var tokenArray = allTokens.split('|')
  var senderName
  tokenArray.forEach((element,index)=>{
    if(element===token){
      senderName = tokenArray[index+1]
    }
  })
  var isValid_t = Verify_This_Token(token,2)
  if(!isValid_t) abortProcess('Tokeni ka skaduar, krijoni ose perdorni nje token valid')
  if(!fs.existsSync(__dirname + '/Keys/' + senderName + '.pem')) abortProcess('Celesi privat i derguesit nuk ekziston ose tokeni nuk eshte valid!')
  var privateKey = fs.readFileSync(__dirname + '/Keys/' + senderName + '.pem') //privateKey
  var encryptedSender = Buffer.from(senderName).toString('base64') //base64(utf8(<sender>))
  var derivedPrivateKey = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
  var desmessage = crypto.createCipheriv('des-ecb',key,null).update(message)
  var signedMessage = crypto.createSign('RSA-SHA256').update(desmessage).sign(derivedPrivateKey,'base64')//base64(signature(des(message)))
  //var signedMessage = crypto.sign('des-ecb', Buffer.from(message, 'utf8'), derivedPrivateKey) //. base64(signature(des(<message>)))
  var ciphertext = encodedName+'.'+iv+'.'+encrypted.toString('base64')+'.'+result

  if(typeof file == 'undefined' || file == null){
     if(token=='undefined') console.log(ciphertext)
     else{
      ciphertext += '.'+encryptedSender+'.'+signedMessage
      console.log(ciphertext)
     }
  }
  else{
    if(file.includes('C:/') || file.includes('c:/')){
      if(token) ciphertext += encryptedSender+'.'+signedMessage
      if(fs.existsSync(file)){
        console.log('Gabim: File ' + file + ' ekziston paraprakisht');
      }else{
        fs.writeFile(file,ciphertext,(err)=>{
          if(err) throw err;
          console.log('Mesazhi i enkriptuar u ruajt ne fajllin ' + file);
        })
      }
    }
    else if(fs.existsSync(os.homedir() + '/' + file)){
      console.log('Gabim: File ' + file + ' ekziston paraprakisht');
    }
    else{
      if(token) ciphertext += encryptedSender+'.'+signedMessage
      fs.writeFile(os.homedir() + '/' + file,ciphertext,(err)=>{
        if(err) throw err;
        console.log('Mesazhi i enkriptuar u ruajt ne fajllin ' + file);
      })
    }
  }
}

const decryptMessage = (message) =>{
  if(fs.existsSync(os.homedir()+ '/' + message) || fs.existsSync(message)){
    if(fs.existsSync(os.homedir()+ '/' + message)){
      var messageFile = fs.readFileSync(os.homedir()+ '/' + message).toString();
      var sT = messageFile.split('.')
      if(sT.length != 5){
        console.log('Formati i ketij teksti nuk perputhet');
      }else{
        decodeMessage(sT);
      }
    }
  }else{
    var seperateText = message.split('.')
    if(seperateText.length != 6){
      console.log('Formati i ketij teksti nuk perputhet');
    }else{
      decodeMessage(seperateText)
    }
  }
}

const decodeMessage = (message) =>{
  //nenshkrim(message[3]) == message[5][nenshkrimi]
  var keyName = new Buffer.from(message[0], 'base64').toString('ascii')
  var derivedIV = Buffer.from(message[1],'base64')
  if(fs.existsSync(__dirname + '/Keys/' + keyName + '.pem')){
    var privateKey = fs.readFileSync(__dirname + '/Keys/' + keyName + '.pem');
    var buffer = Buffer.from(message[2], "base64");
    var derivedKey = crypto.privateDecrypt({"key": privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'},buffer);
    var decipher = crypto.createDecipheriv('des-ecb',derivedKey,null)
    let decrypted = decipher.update(message[3], 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    var sender = new Buffer.from(message[4],'base64').toString('ascii')
    var publicKey = fs.readFileSync(__dirname+'/Keys/'+sender+'.pub.pem')
    var desmessage = crypto.createCipheriv('des-ecb',derivedKey,null).update(decrypted.toString('utf8')) 
    let verifier = crypto.createVerify('RSA-SHA256').update(desmessage).verify(publicKey,message[5],'base64') // sign(des)
    console.log('Marresi: ' + keyName)
    console.log('Mesazhi: ' + decrypted.toString('utf8'))
    console.log('Derguesi: ' + sender)
    console.log('Nenshkrimi: ' + (verifier ? 'valid' : 'jovalid'))
  }else{
    console.log('Celesi privat /Keys/' + keyName + ' nuk ekziston');
  }
}
module.exports = {encryptMessage,decryptMessage};
