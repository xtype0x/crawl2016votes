angular.module('electparse', []).controller('index_controller', [
	'$scope','$http',function($scope,$http) {
		var CITY_ORDER=["臺北市","新北市","基隆市","桃園市","新竹市","新竹縣","苗栗縣","臺中市","南投縣","彰化縣","雲林縣","嘉義市","嘉義縣","臺南市","高雄市","屏東縣","澎湖縣","宜蘭縣","花蓮縣","臺東縣","金門縣","連江縣"];
		$http.get('/api/dist').success(function(res){
			$scope.dist=_.map(res, function(c){
				c.index=CITY_ORDER.indexOf(c.city);
				return c;
			});
			console.log($scope.dist)
		})
		$scope.current_city={indexes:[]}
		$scope.choose_city = function(c){
			$scope.current_city = c;
			$scope.current_index = ""
			$scope.current_area = ""
			$scope.current_village = ""
			if($scope.current_city.indexes[0]!='選舉區')
				$scope.current_city.indexes.sort(function(a,b){
					aint = parseInt(a.name.split("第")[1].split('選')[0])
					bint = parseInt(b.name.split("第")[1].split('選')[0])
					return aint-bint;
				})
			$http.post('/api/get_city',{
				city: c.city
			}).success(function(res){
				$scope.category_title = c.city
				$scope.result = res;
			})
		}
		$scope.choose_index = function(ind){
			$scope.current_index = ind;
			$scope.current_area = ""
			$scope.current_village = ""
			$http.post('/api/get_votearea',{
				city: $scope.current_city.city,
				v: ind.name
			}).success(function(res){
				$scope.result = res
				$scope.category_title = $scope.current_city.city+">"+ind.name
			})
		}
		$scope.choose_area = function(a){
			$scope.current_area = a;
			$scope.current_index = "";
			$scope.current_village = ""
			$http.post('/api/get_area',{
				city: $scope.current_city.city,
				area: a.name
			}).success(function(res){
				$scope.result = res
				$scope.category_title = $scope.current_city.city+'>'+a.name
			})
			$http.post('/api/vil_power',{
				city: $scope.current_city.city,
				area: a.name
			}).success(function(res){
				$scope.current_area.villages = _.map($scope.current_area.villages, function(v){
					return _.find(res,{name:v});
				})
				
			})
		}
		$scope.choose_village = function(v){
			$scope.current_village = v;
			$http.post('/api/get_village', {
				city: $scope.current_city.city,
				area: $scope.current_area.name,
				v: v.name
			}).success(function(res){
				$scope.result = res;
				$scope.category_title = $scope.current_city.city+'>'+$scope.current_area.name+'>'+v.name
			})
		}
	}
])
