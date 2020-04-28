const request = require('request');
const cheerio = require('cheerio');
const crypto = require('crypto');
const fs = require('fs');

const import_file = (namefilesaved,link)=>{
	// code keys invers code  879
	if(namefilesaved == ''){
		console.log('File name is missing <name>!');
		process.exit();
	}else if(link == ''){
		console.log('Link is missing <name>!');
		process.exit();
	}
request(link,(error,response,html)=>{
	
	if(error || response.statusCode != 200){
		console.log('Fail to connect make sure you have correct link!');
		process.exit();
	}
	const $ = cheerio.load(html);
	const crytext = $.text();

	var matches = crytext.match(/[\-]+[A-Z\s]+[\-]+/g); // check if is pem file
	if(matches.length%2 != 0){
		console.log('This is not .pem file');
		process.exit();
	}

	var crytpto_text = crytext.match(/[\-]+[A-Z\s]+[\-]+(.*?)[\-]+[A-Z\s]+[\-]+/s);
	const crytotext_found = crytpto_text[1];
	const rsa_length = crytotext_found.length;
	if(rsa_length < 120){
		console.log('RSA MATCH not found');
		process.exit();
	}
	var extension = '';
	if(rsa_length < 500){
		extension = '.pub.pem'; // rsa public 
	}else{
		extension = '.pem'; // rsa private 
	}
	//console.log(__dirname + '\\Keys\\'+namefilesaved+extension);
	// code keys invers code  880
	fs.mkdir("./ModernEncryption/Keys", function(err) {
	  if (err) {
		  if (err.code != 'EEXIST') {
			console.log(err)
		  }
	  }
	})
	if(extension == '.pem'){
	var extension_public = '.pub.pem';
	var privateKey = crytext;
    var test = crypto.createPrivateKey({'key': privateKey,'passphrase': 'top secret','cipher': 'aes-256-cbc'})
	var test2 = crypto.createPublicKey(test).export({'type':'spki','format': 'pem','cipher': 'aes-256-cbc','passphrase':'top secret'});
	
	fs.writeFile("./ModernEncryption/Keys/"+namefilesaved+extension_public, test2, function (err) {
	  if (err) throw err;
	  console.log('Saved RSA Public: '+namefilesaved+extension_public);
	});	
	}
	// code EEXIST  invers code 881
	fs.writeFile("./ModernEncryption/Keys/"+namefilesaved+extension, crytext, function (err) {
	  if (err) throw err;
	  console.log('Saved RSA: '+namefilesaved+extension);
	});
});
}
module.exports = import_file;


// ds import-key file1 https://pastebin.com/raw/s0gvcti0
//import_file('file1','https://pastebin.com/raw/s0gvcti0'); // example if you want to test












// in end of line is the end of the words 