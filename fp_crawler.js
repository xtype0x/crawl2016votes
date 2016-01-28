var fs = require("fs");
var request = require("request");
var async = require("async");
var lodash = require("lodash");

var links = require('./datas/fplink.json');

var crawlpage = function(url,callback){
	var filename = url.split("zh_TW")[1].substring(1);
	filename = filename.replace(/\//gi,"-");
	folder="選舉概況"
	if(!fs.existsSync("crawl_results/"+folder+"/"+filename)){
		console.log("not exist,crawling");
		request(url,function(err,req,cont){
			if(cont != null){
				console.log("writing url:"+url+":"+cont.toString().length);
				fs.writeFileSync("crawl_results/"+folder+"/"+filename, cont.toString());
				console.log("wroted url:"+url+":"+cont.toString().length);
			}else{
				console.log("missing url:"+url);
			}
			callback()
		});
	}else{
		console.log("already exist");callback();
	}
}
async.each(links, function(link,callback){
	crawlpage(link,callback);
},function(err){
	console.log("Done");
	return process.exit(0);
});
