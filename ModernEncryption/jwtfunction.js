const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path')
const crypto = require('crypto');
const {abortProcess} = require('../lib/utilities.js');


function getTokenfrom(Filename){
	
	if(!fs.existsSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'))){
		fs.writeFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'), '', function (err) {
			if (err) { console.log(err.message)};
		  });
	}

if (!fs.existsSync('./ModernEncryption/Keys/'+Filename+'.pem')) abortProcess('This key doesn\'t exist!');

var privateKEY  = (fs.readFileSync('./ModernEncryption/Keys/'+Filename+'.pem', 'utf8')).trim();
var payload = {
    name : Filename
};
var token = jwt.sign(payload, privateKEY,{expiresIn:  "20m"});
		var data = '';
		
		fs.readFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), {encoding: 'utf-8'}, function(err,data){
			if (!err) {
				  data = data +token+'|'+Filename+'\n';		
				  		  
				 fs.writeFile(path.join(__dirname,'../Core/Token/CoreToken.rtf'), data, function (err) {
				  if (err) { console.log(err.message)};
				});
			} else {
				console.log(err);
			}
		});
	

 return token;
}
// get status of token ds status <token>
function Verify_This_Token(token){
	try{
var contents = fs.readFileSync(path.join(__dirname,'../Core/Token/CoreToken.rtf'), 'utf8');
var text = contents.trim();
var splitertext = text.split(token+'|');
var splitertext2 = splitertext[1].split('\n');

var file = splitertext2[0];
	}catch(err){
		abortProcess("Invalid token found!");
	}
	
	
        var basename = file.split('.');
        try{
        var privateKEY  = (fs.readFileSync('./ModernEncryption/Keys/'+basename[0]+'.pem', 'utf8')).trim();
        }catch(err){
            console.log(err.messge);
            process.exit();
        }
    
jwt.verify(token, privateKEY,{expiresIn:  "20m"},function(err,decode){
    if(err){
		console.log("-----------------------------");
        console.log("Valid: No \nReason: "+err.message);
		console.log("-----------------------------");
    }else{
		function toDateTime(secs) {
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
});
}




module.exports = {Verify_This_Token,getTokenfrom};