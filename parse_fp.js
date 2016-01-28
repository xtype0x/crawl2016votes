var cheerio = require("cheerio");
var fs = require("fs");
var _ = require("lodash");
var async = require("async");

var folderpath = "./crawl_results/選舉概況/"
var names = _.map(require("./datas/fplink.json"),function(link){
	name = link.split("zh_TW")[1].substring(1);
	return name.replace(/\//gi,"-");
});

var parseTable = function(content){
	var rawdata = {};
	var $ = cheerio.load(content);
	rawdata.title = $("#divContent b").text();
	spl = rawdata.title.split(rawdata.title[7]);
	if(spl.length > 2){
		area = spl[1]
		rawdata.city = area.substring(0,3)
		rawdata.area = area.substring(3)
	}
	var tb = $(".tableT");
	rawdata.rows=[];

	tb.find(".trT").each(function(ind,dom){
		var tds = $(dom).find("td");
		rawdata.rows.push({
			id: tds.eq(0).text(),
			totalCnt: parseInt(tds.eq(1).text().replace(/,/gi,"")),
			voteCnt: parseInt(tds.eq(2).text().replace(/,/gi,"")),
			validCnt: parseInt(tds.eq(3).text().replace(/,/gi,"")),
			invalidCnt: parseInt(tds.eq(4).text().replace(/,/gi,"")),
			voteRate: parseFloat(tds.eq(5).text())
		})
	});
	
	return rawdata;
}
var data=[];
async.eachSeries(names, function(name,callback){
	var cont = fs.readFileSync(folderpath+name);
	data.push(parseTable(cont))
	callback()
}, function(err){
	fs.writeFileSync("outputs/fp.json",JSON.stringify(data));
	console.log("Done");
	return process.exit(0);
})

