const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path')
const crypto = require('crypto');
const {abortProcess} = require('../lib/utilities.js');

function getTokenfrom(filename){
	if(!fs.existsSync(path.join(__dirname,'../Core/Token/'))) fs.mkdirSync(path.join(__dirname,'../Core/Token/'))
	if(!fs.existsSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'))){
		fs.writeFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'), "")
	}
	if (!fs.existsSync(path.join(__dirname,'/Keys/'+filename+'.pem'))) abortProcess('This key doesn\'t exist!')
	var privateKey  = fs.readFileSync(path.join(__dirname,'/Keys/'+filename+'.pem')).toString()
	//payload contains the claims
	var payload = {
    	name : filename
	};
	//create tocken
	var token = jwt.sign(payload, privateKey,{expiresIn:  "20m"})
	fs.readFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), {encoding: 'utf-8'}, (err,data)=>{
		if (!err) {
			data = data +token+'|'+filename+'|';		 		  
			fs.writeFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), data, function (err) {
				if (err) { console.log(err.message)}
			});
		}else{
			abortProcess(err.message)
		}
	})
 	return token
}
// get status of token ds status <token>
const Verify_This_Token = (token,returns) => {
	try{
		var contents = fs.readFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'), 'utf8');
		var text = contents.trim();
		var splitertext = text.split(token+'|');
		var splitertext2 = splitertext[1].split('|');
		var file = splitertext2[0];
	}catch(err){
		abortProcess("Invalid token found!")
	}
    var basename = file.split('.')
    try{
        var privateKey  = (fs.readFileSync(path.join(__dirname,'/Keys/'+basename[0]+'.pem')))
    }catch(err){
        throw err;
        process.exit()
    }   
	var verify = jwt.verify(token, privateKey,{expiresIn:  "20m"},function(err,decode){
    	if(err){
			if(typeof returns == 'number') return false
			console.log("-----------------------------");
        	console.log("Valid: No \nReason: "+err.message);
			console.log("-----------------------------");

    	}else{
			if(typeof returns == 'number') return true;
			const toDateTime = (secs) => {
				var t = new Date(1970, 0, 1); // Epoch
				t.setSeconds(secs);
				return t;
			}
			console.log("-----------------------------");
        	console.log("User: "+decode.name+"\nValid: YES");
			console.log("Koha e mbeture: "+Math.ceil((decode.exp-Date.now()/1000)/60)+ " Minutes");
			console.log("Skadimi:"+toDateTime(decode.exp));
			console.log("-----------------------------");
    	}
	})
	if(typeof returns == 'number') return verify
}

module.exports = {Verify_This_Token,getTokenfrom};