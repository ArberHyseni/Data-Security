const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const os = require('os')
const {abortProcess} = require('../lib/utilities')
const jwt = require('jsonwebtoken')

const encryptMessage = (name,message,file,token) => {
  if(file == '--sender') file = null;
  var encodedName = Buffer.from(name).toString('base64') //base64(utf8(<name>))
  var iv = crypto.randomBytes(8).toString('base64') // base64(<iv>)
  var key = crypto.randomBytes(8) //key
  
  var publicKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pub.pem') //publicKey
  var encrypted = crypto.publicEncrypt(publicKey, key)
  const cipher = crypto.createCipheriv('des-ecb', key, null) //rsa(<key>)
  let result = cipher.update(message,'utf8','base64') // base64(rsa(<key>))
  result += cipher.final('base64')
  result = result.toString('base64')

  var allTokens = fs.readFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'))
  if(allTokens==null || typeof allTokens == 'undefined') abortProcess('No Tokens Found')
  var tokenArray = allTokens.split('|')
  var senderName
  tokenArray.forEach((element,index)=>{
    if(element===token) senderName = element[index+1]
  })
  var privateKey = fs.readFileSync(__dirname + '/Keys/' + senderName + '.pem') //privateKey
  var encryptedSender = Buffer.from(senderName).toString('base64') //base64(utf8(<sender>))
  var signedMessage = crypto.sign('des-ecb', message, privateKey).update('base64').final('base64').toString('base64') //. base64(signature(des(<message>)))

  var ciphertext = encodedName+'.'+iv+'.'+encrypted.toString('base64')+'.'+result

  if(typeof file == 'undefined' || file == null){
     token = process.argv[6]
     if(token=='undefined') console.log(ciphertext)
     else{
      ciphertext += encryptedSender+'.'+signedMessage
      console.log(ciphertext)
     }
  }
  else{
    if(file.includes('C:/') || file.includes('c:/')){
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
      if(sT.length != 4){
        console.log('Formati i ketij teksti nuk perputhet');
      }else{
        decodeMessage(sT);
      }
    }
  }else{
    var seperateText = message.split('.')
    if(seperateText.length != 4){
      console.log('Formati i ketij teksti nuk perputhet');
    }else{
      decodeMessage(seperateText);
    }
  }
}

const decodeMessage = (message) =>{
  var keyName = new Buffer.from(message[0], 'base64').toString('ascii');
  var derivedIV = Buffer.from(message[1],'base64')
  if(fs.existsSync(__dirname + '/Keys/' + keyName + '.pem')){
    var privateKey = fs.readFileSync(__dirname + '/Keys/' + keyName + '.pem');
    var buffer = Buffer.from(message[2], "base64");
    var derivedKey = crypto.privateDecrypt({"key": privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'},buffer);
    var decipher = crypto.createDecipheriv('des-ecb',derivedKey,null);
    let decrypted = decipher.update(message[3], 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    console.log('Marresi: ' + keyName);
    console.log('Mesazhi: ' + decrypted.toString('utf8'));
  }else{
    console.log('Celesi privat /Keys/' + keyName + ' nuk ekziston');
  }
}
module.exports = {encryptMessage,decryptMessage};
