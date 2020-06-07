const path = require('path')
const fs = require('fs')
const os = require('os')
const crypto = require('crypto')
const {import_file} = require('./getAndSendRequest')
const {moveprocess,findDir,abortProcess} = require('../lib/utilities')

const exportKey = async (visibility,name,file) => {
  if(!visibility || !name) abortProcess('Argumentet jovalide')
  if(file) file = file.trim()
  visibility = visibility.trim()
  name = name.trim()
  if((visibility !== 'public' && visibility !== 'private') || !name.match(/^[a-zA-Z0-9_]*$/))
    abortProcess('There is an invalid argument')
  if(typeof file == 'undefined') console.log(readKey(name,visibility))
  if(file){
    if(fs.existsSync(os.homedir() + '/' + file))
      abortProcess('Ekziston nje file tjeter me kete emer ne direktoriumin qe deshironi zhvendosjen e celesit')
    if(file.startsWith('~/'))
      (!fs.existsSync(os.homedir() + '/' + file.substring(2)) ? await moveprocess(__dirname + '/Keys/' + name + ((visibility == 'public') ? '.pub.pem' : '.pem'),os.homedir() + '/' + file.substring(2),visibility) : abortProcess('File already exists on that path'))
    if(file.includes(':/'))
      ((!fs.existsSync(file)) ? await moveprocess(__dirname + '/Keys/' + name + ((visibility=='private') ? '.pem' : '.pub.pem'), file,visibility) : abortProcess('File already exists on that path'))
    else await moveprocess(__dirname + '/Keys/' + name + ((visibility=='public') ? '.pub.pem' : '.pem'),os.homedir() + '/' + file,visibility)
  }
}

const importKey = async (name, file) => {
  if(!name || !file) abortProcess('Argumentet jovalide')
  name = name.trim()
  file = file.trim()
  if(file.includes('http')){ 
    import_file(name,file)
  }else if(file.includes(':/')){
    if(!fs.existsSync(file)) abortProcess('File path is not valid')
    let text = readImportedKey(file)
    if(typeof text == 'undefined' || (!text.includes('PUBLIC') && !text.includes('PRIVATE'))) abortProcess('Invalid file')
    if(text.includes('PUBLIC')) await moveprocess(file,__dirname+'/Keys/' + name + '.pub.pem','public')
    if(text.includes('PRIVATE')){
      await moveprocess(file,__dirname+'/Keys/'+name+'.pem','private')
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem');
      var derivedPrivateKey = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var derivedPublicKey = crypto.createPublicKey(derivedPrivateKey).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',derivedPublicKey,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
      })
    }
  }
  
  if(fs.existsSync(os.homedir()+'/' + file)){
    let text = readImportedKey(os.homedir()+'/' + file)
    if(!text || (!text.includes('PUBLIC') && !text.includes('PRIVATE'))) abortProcess('Invalid file')
    if(text.includes('PUBLIC')) await moveprocess(os.homedir()+'/' + file,__dirname+'/Keys/'+name+'.pub.pem','public')
    if(text.includes('PRIVATE')){
      await moveprocess(os.homedir()+'/'+file,__dirname+'/Keys/'+name+'.pem','private')
      setTimeout(()=>{
        //
      },1000)
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem')
      var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
      })
    }
  }
}


let readKey = (name,visibility) => {
  if(!fs.existsSync(__dirname + '/Keys/' + name + ((visibility=='public') ? '.pub.pem' : '.pem'))){
    abortProcess(`Celesi ${name} nuk ekziston`)
  }
  var text = fs.readFileSync(__dirname + '/Keys/' + name + ((visibility=='public') ? '.pub.pem' : '.pem'),(err)=>{
    if(err) abortProcess(`Celesi ${name} nuk ekziston`)
  })
  return text.toString()
}

let readImportedKey = (file) => {
  if(!fs.existsSync(file)) abortProcess(`Celesi ${name} nuk ekziston`)
  var text = fs.readFileSync(file,(err,text)=>{
    if(err) console.log('nothing');
  })
  return text.toString()
}

module.exports = {exportKey,importKey};
