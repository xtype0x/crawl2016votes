var _=require("lodash");
module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index');
	})

	app.get('/api/dist', function(req,res){
		res.json(require("../dist.json"))
	})
	app.post('/api/get_city', function(req,res){
		db.collection("cities").findOne({
			city: req.body.city
		}, function(err, doc){
			return res.json(doc)
		})
	})
	app.post('/api/get_area', function(req, res){
		db.collection("areas").findOne({
			city: req.body.city,
			area: req.body.area
		}, function(err, doc){
			return res.json(doc)
		})
	})
	app.post('/api/get_votearea', function(req, res){
		db.collection("voteareas").findOne({
			city: req.body.city,
			votearea: req.body.v
		}, function(err, doc){
			return res.json(doc)
		})
	})
	app.post('/api/get_village', function(req, res){
		db.collection("villages").findOne({
			city: req.body.city,
			area: req.body.area,
			village: req.body.v
		}, function(err, doc){
			return res.json(doc)
		})
	})
	app.post('/api/vil_power', function(req,res){
		db.collection("villages").find({
			city: req.body.city,
			area: req.body.area
		}).toArray(function(err, docs){
						console.log(err)
			data = _.map(docs, function(doc){
				power = (_.find(doc.partyv,{name:"民主進步黨"}).cnt+_.find(doc.partyv,{name:"時代力量"}).cnt+_.find(doc.partyv,{name:"台灣團結聯盟"}).cnt
								- _.find(doc.partyv,{name:"中國國民黨"}).cnt-_.find(doc.partyv,{name:"新黨"}).cnt-_.find(doc.partyv,{name:"中華統一促進黨"}).cnt)/doc.fp.voteCnt
				return {
					name: doc.village,
					power: power
				}
			})
			return res.json(data)
		})
	})
}
