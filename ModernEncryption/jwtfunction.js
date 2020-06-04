const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path')
const crypto = require('crypto');
const {abortProcess} = require('../lib/utilities.js');


function getTokenfrom(filename){
	if(!fs.existsSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'))){
		fs.writeFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'), err => {
			if(err) console.log(err.message)
		  })
	}
	if (!fs.existsSync('./ModernEncryption/Keys/'+filename+'.pem')) abortProcess('This key doesn\'t exist!')
	var privateKey  = (fs.readFileSync('./ModernEncryption/Keys/'+filename+'.pem', 'utf8')).trim();
	var payload = {
    	name : filename
	};
	var token = jwt.sign(payload, privateKey,{expiresIn:  "20m"})
	fs.readFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), {encoding: 'utf-8'}, (err,data)=>{
		if (!err) {
			data = data +token+'|'+filename+'\n';		 		  
			fs.writeFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), data, function (err) {
				if (err) { console.log(err.message)};
			});
		}else{
			console.log(err);
		}
	})
 	return token
}
// get status of token ds status <token>
const Verify_This_Token = (token) => {
	try{
		var contents = fs.readFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'), 'utf8');
		var text = contents.trim();
		var splitertext = text.split(token+'|');
		var splitertext2 = splitertext[1].split('\n');
		var file = splitertext2[0];
	}catch(err){
		abortProcess("Invalid token found!");
	}
    var basename = file.split('.')
    try{
        var privateKey  = (fs.readFileSync('./ModernEncryption/Keys/'+basename[0]+'.pem', 'utf8')).trim()
    }catch(err){
        console.log(err.messge)
        process.exit()
    }   
	jwt.verify(token, privateKey,{expiresIn:  "20m"},function(err,decode){
    	if(err){
			console.log("-----------------------------");
        	console.log("Valid: No \nReason: "+err.message);
			console.log("-----------------------------");
    	}else{
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
}

module.exports = {Verify_This_Token,getTokenfrom};