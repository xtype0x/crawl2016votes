var _ = require("lodash");
var client = require("mongodb").MongoClient;
var async = require("async");

var data = _.filter(require("./outputs/fp.json"), function(obj){
	return obj.city && obj.area;
});
data = _.flatten(_.map(data, function(obj){
	return _.map(_.reject(obj.rows,{id:'總計'}), function(row){
		row.city = obj.city;
		row.area = obj.area;
		return row;
	})
}))

client.connect("mongodb://localhost/elect", function(err, db){
	async.eachSeries(data, function(obj,callback){
		db.collection("rawdatas")
			.update({
				cityname: obj.city,
				areaname: obj.area,
				voteplacenumber: obj.id
			}, {
				$set:{
					fp: obj
				}
			}, function(err,doc){
				if(!doc)console.log(obj,"missed");
				callback();
			})
	}, function(err){
		console.log("Done")
		return process.exit(0);
	});
})

