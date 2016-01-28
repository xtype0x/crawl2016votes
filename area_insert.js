var _ = require("lodash");
var client = require("mongodb").MongoClient;

client.connect("mongodb://localhost:27017/elect", function(err,db){
	db.collection("rawdatas")	.find({})	.toArray(function(err,data){	
				g = _.toPairs(_.groupBy(data, function(d){
								return d.cityname+'-'+d.areaname;
				}))
				insertData = _.map(g, function(l){
								spl = l[0].split("-");
								legis = [];
								pres = [];
								par=[];
								fp={
									totalCnt: 0,
									voteCnt: 0,
									validCnt: 0,
									invalidCnt: 0
								};

								for(i=0;i<l[1].length;i++){
												legisv = l[1][i].v['區域立委'];
												presv = l[1][i].v['總統'];
												partyv = l[1][i].v['政黨票'];
												fp.totalCnt=fp.totalCnt+l[1][i].fp.totalCnt;
												fp.voteCnt=fp.voteCnt+l[1][i].fp.voteCnt;
												fp.validCnt=fp.validCnt+l[1][i].fp.validCnt;
												fp.invalidCnt=fp.invalidCnt+l[1][i].fp.invalidCnt;

												_.forEach(legisv, function(v){
																ind = _.findIndex(legis, {name:v.name})
																if(ind == -1){
																				legis.push({
																								name: v.name,
																								party: v.pt,
																								cnt: parseInt(v.c)
																				})
																}else{
																				legis[ind].cnt = legis[ind].cnt+parseInt(v.c)
																}
												})
												legiscnt = _.reduce(legis, function(cnt,v){return cnt+v.cnt},0);
												legis = _.map(legis, function(v){
																v.prob = v.cnt/legiscnt;
																return v;
												})
												_.forEach(presv, function(v){
																ind = _.findIndex(pres, {name: v.name})
																if(ind == -1){
																				pres.push({
																								name: v.name,
																								party: v.pt,
																								cnt: parseInt(v.c)
																				})
																}else{
																				pres[ind].cnt = pres[ind].cnt+parseInt(v.c)
																}
												})
												prescnt=_.reduce(pres, function(cnt,v){return cnt+v.cnt},0);
												pres=_.map(pres,function(v){
																v.p = v.cnt/prescnt
																return v;
												})
												_.forEach(partyv, function(v){
																ind = _.findIndex(par, {name:v.name})
																if(ind == -1){
																				par.push({
																								name: v.name,
																								cnt: parseInt(v.cnt)
																				})
																}else{
																				par[ind].cnt = par[ind].cnt+parseInt(v.cnt)
																}
												})
												parcnt = _.reduce(par, function(cnt,v){return cnt+v.cnt},0);
												par = _.map(par, function(v){
																v.prob = v.cnt/parcnt;
																return v;
												}) 
								}
								fp.voteRate = fp.voteCnt/fp.totalCnt;
								return {
												city: spl[0],
												area: spl[1],
												legis: legis,
												pres:pres,
												partyv: par,
												fp: fp
								}
				})

		db.collection("areas").insert(insertData, function(err){
	 		console.log("done")
			return process.exit(0)
		})
	})
})


