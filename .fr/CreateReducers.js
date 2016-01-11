var fs = require('fs');
var Q = require('q')
var fn = require('./function.js');
var path = './src/page/'
var import_tpl = "import { {import_tpl} } from './{dir}/reducer'";

var import_con = '';
function writeImport(dir,imports){
	import_con += import_tpl.replace('{dir}',dir)
			  .replace('{import_tpl}',imports) + '\n';	
}

var reducers_fn = [];
function createLibsString(temp_con,dir){
	var con = temp_con.match(/export(.*?)function(.*?)\(/g);
	if(con){
		var reducers = [];
		con.forEach(function(data){
			var re = data.split('function')[1].replace('(','')
											.replace(/\ /g,'');
			reducers_fn.push(re);	
			reducers.push(re);	
		})
		var imports = JSON.stringify(reducers).replace(/\",/g,'",')
												.replace(/\"/g,'')
												.replace('[','')
												.replace(']','');
		//console.log(imports)
		writeImport(dir,imports)
	}
}

fn.each_file(path,function(dir){
	var temppath = path + dir + '/reducer.js';
	//console.log(temppath)
	if(fs.existsSync(temppath)){
		var temp_con = fs.readFileSync(temppath,options = {
			encoding : 'utf-8'
		});
		createLibsString(temp_con,dir);	
	}
})


function writeRecucers(){
	var w_file = './src/page/reducers.js';
	if(fs.existsSync(w_file)){
		fs.unlinkSync(w_file);
	}
	var antd_tpl = fs.readFileSync('./.fr/reducers_tpl.js',options = {
		encoding : 'utf-8'
	});
	var fd = fs.openSync(w_file,'a',0755);
    var temp_libs = JSON.stringify(reducers_fn).replace(/\",/g,'",\n	')
									.replace(/\"/g,'')
									.replace('[','')
									.replace(']','');
	//console.log(import_con)									
	temp_con = antd_tpl.replace(/{reducers_tpl}/g,temp_libs);	
	temp_con = temp_con.replace(/{import_tpl}/g,import_con);	
	fs.writeSync(fd,temp_con);
	fs.close(fd);

}
writeRecucers();
