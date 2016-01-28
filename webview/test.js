var data = require("./district.json")
var _=require("lodash")

dist = _.reduce(data, function(o,d){
	i = _.findIndex(o,{city:d.cityname});
	if(i==-1){
		o.push({
			city: d.cityname,
			indexes: [{
				name: d.index,
				areas: [{
					name: d.areaname,
					villages: [d.villagename]
				}]			
			}]
		})
	}else{
		ii = _.findIndex(o[i].indexes, {name: d.index})
		if(ii == -1){
			o[i].indexes.push({
				name: d.index,
				areas: [{
					name: d.areaname,
					villages: [d.villagename]
				}]
			})
		}else{
			iii = _.findIndex(o[i].indexes[ii].areas, {name: d.areaname})
			if(iii==-1){
				o[i].indexes[ii].areas.push({
					name: d.areaname,
					villages:[d.villagename]
				})
			}else{
				iiii = _.findIndex(o[i].indexes[ii].areas[iii].villages, {name: d.villagename})
				if(iiii==-1){
					o[i].indexes[ii].areas[iii].villages.push(d.villagename)
					o[i].indexes[ii].areas[iii].villages.sort()
				}
			}
		}
	}
	return o;
},[])

console.log(JSON.stringify(dist))
