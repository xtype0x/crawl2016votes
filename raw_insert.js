var _ = require("lodash");
var client = require("mongodb").MongoClient;
var data = require("./outputs/votes_all.json");
client.connect("mongodb://localhost:27017/elect", function(err,db){
	db.collection("rawdatas").insert(data, function(err){
	 console.log("done")
	})
})


