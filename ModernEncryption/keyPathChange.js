const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto')

const exportKey = (visibility,name,file) => {
  if(visibility) visibility = visibility.trim()
  else if(name) name = name.trim()
  else if(file) file = file.trim()
  else abortProcess('Argumentet jovalide')
  if((visibility !== 'public' && visibility !== 'private') || !name.match(/^[a-zA-Z0-9_]*$/))
    abortProcess('There is an invalid argument')
  if(typeof file == 'undefined') console.log(readKey(name,visibility))
  if(file){
    if(fs.existsSync(os.homedir() + '/' + file)
      abortProcess('Ekziston nje file tjeter me kete emer ne direktoriumin qe deshironi zhvendosjen e celesit')
    if(file.startsWith('~/'))
      moveprocess(__dirname + '/Keys/' + name + (visibility == 'public') ? '.pub.pem' : '.pem',os.homedir() + '/' + file.substring(2),visibility)
    if(!fs.existsSync(findDir(file)))
      abortProcess('ENOENT: Directory does not exist!')
    if(file.includes(':/'))
      moveprocess(__dirname + '/Keys/' + name + (visibility=='private') ? '.pem' : '.pub.pem', file,visibility)
    else moveprocess(__dirname + '/Keys/' + name + (visibility=='public') ? '.pub.pem' : '.pem',os.homedir() + '/' + file,visibility)
  }
}

const importKey = (name, file) => {
  if(name) name = name.trim()
  if(file) file = file.trim()
  if(file.startsWith('~/') && fs.existsSync(os.homedir() + '/' + file.substring(2))) let text = readImportedKey(file)
  if(text && text.toString().includes('PRIVATE')){
    moveprocess(os.homedir() + '/' + file.substring(2),__dirname + '/Keys/' + name + '.pem','private')
    let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem')
    let derivedPrivateKey = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
    var derivedPublicKey = crypto.createPublicKey(derivedPrivateKey).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'})
    fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',derivedPublicKey,(err)=>{
      if(err) throw err;
      console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
    })
  }
  if(!fs.existsSync(findDir(file))) abortProcess('ENOENT: Directory does not exist!')
  if(fs.existsSync(file))
    var text = fs.readFileSync(file,(err,text)=>{
      if(err) throw err
    })
  if(text && text.toString().includes('PRIVATE')){
    moveprocess(file,__dirname + '/Keys/' + name + '.pem','private')
    let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem')
    var derivedPrivateKey = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
    var derivedPublicKey = crypto.createPublicKey(derivedPrivateKey).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'})
    fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
      if(err) throw err;
      console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pub.pem\'')
    })
  }
  if(text && text.toString().includes('PUBLIC'))
    moveprocess(file,__dirname+ '/Keys/' + name + '.pub.pem','public')


// UNDER CONSTRUCTION


  else if(fs.existsSync(os.homedir() + '/' + file)){
    var text = fs.readFileSync(os.homedir() + '/' + file,(err,text)=>{
      if(err) throw err;
    })
    if(text.toString().includes('PRIVATE')){
      moveprocess(os.homedir() + '/' + file,__dirname + '/Keys/' + file,'public');
      let privateKey = fs.readFileSync(__dirname + '/Keys/' + name + '.pem');
      var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
      var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
      fs.writeFile(__dirname + '/Keys/' + name+ '.pub.pem',test2,(err)=>{
        if(err) throw err;
        console.log('Eshte krijuar celesi publik \'Keys/' + name + '.pem\'')
      })
    }else if(text.toString().includes('PUBLIC')){
      moveprocess(os.homedir() + '/' + file,__dirname + '/Keys/' + file,'private')
    }
  }
  else{
    console.log('Invalid path - please check you syntax');
  }
}

const moveprocess = async (oldpath,newpath,visibility) => {
  const moveFile = (oldpath,newpath,visibility) =>{
    if(visibility=='public'){
      fs.rename(oldpath, newpath, (err)=>{
        if(err) throw err;
        console.log('Celesi publik u ruajt ne fajllin ' + '.pub.pem');
      })
    }else if(visibility=='private'){
      fs.rename(oldpath, newpath, (err)=>{
        if(err) throw err;
        console.log('Celesi privat u ruajt ne fajllin '  + '.pem');
      })
    }
  }
  const movevar = await moveFile(oldpath,newpath,visibility)
}


const findDir = (pathname) => {
  var fileDir = pathname.split('/')
  fileDir.pop()
  fileDir = fileDir.join('/')
  return fileDir
}

let abortProcess = (statement) => {
  console.log(statement)
  process.exit()
}

let readKey = (name,visibility) => {
  var text = fs.readFileSync(__dirname + '/Keys/' + name + (visibility=='public') ? '.pub.pem' : '.pem',(err)=>{
    if(err) abortProcess(`Celesi ${name} nuk ekziston`)
  })
  return text.toString()
}

let readImportedKey = (file) => {
  var text = fs.readFileSync(os.homedir() + '/' + file.substring(2),(err,text)=>{
    if(err) throw err
  })
  return text
}

module.exports = {exportKey,importKey};
