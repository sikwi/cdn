var fs = require('fs');
var path = require('path');
var checksum = require('checksum');

var diretoryTreeToObj = function(dir, done) {
    var results = {};

    fs.readdir(dir, function(err, list) {
        if (err)
            return done(err);

        var pending = list.length;

        if (!pending)
            return done(null, results);

        list.forEach(function(file) {
        	var ext = path.extname(file);
        	file = path.resolve(dir, file);
        	if(ext != ".psd" && ext != ".md" && ext != ".ico" && path.basename(file)!=".git" && path.basename(file)!="CNAME" && path.basename(file)!=".DS_Store" && path.basename(file)!= "node_modules")
        	{
	            fs.stat(file, function(err, stat) {
	            	checksum.file(file, function(err, sum){
		                if (stat && stat.isDirectory()) {
		                    diretoryTreeToObj(file, function(err, res) {
		                    	results[path.basename(file)] = res;
		                        if (!--pending)
		                            done(null, results);
		                    });
		                }
		                else {
		                    results[path.basename(file)] = sum;
		                    if (!--pending)
		                        done(null, results);
		                }
	            	});
	            });
	        }else if (!--pending){
	            done(null, results);
	        }
        });
    });
};

var dirTree = ('./');

diretoryTreeToObj(dirTree, function(err, res){
    if(err)
        return console.error(err);

    fs.writeFile("./manifest.json", JSON.stringify(res), function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 
});