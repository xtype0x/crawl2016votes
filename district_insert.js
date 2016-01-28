var _ = require("lodash");
var client=require("mongodb").MongoClient

client.connect("mongodb://localhost:27017/elect", function(err, db){
db.collection("rawdatas").find({}).toArray(function(err,data){
data = _.map(data, function(v){
	return _.pick(v,['cityname','areaname','villagename','index'])
})

data = _.uniqWith(data, _.isEqual)

console.log(JSON.stringify(data));
return process.exit(0);
})
})
