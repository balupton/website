if(!GENTICS.Aloha.Repositories)GENTICS.Aloha.Repositories={};GENTICS.Aloha.Repositories.Product=new GENTICS.Aloha.Repository("com.gentics.aloha.resources.Product");
GENTICS.Aloha.Repositories.Product.settings.data=[{id:1,name:"Kuota Kueen K",url:"/plugins/com.example.aloha.plugins.Product/resources/kuota-kueen-k.jpg",type:"product"},{id:2,name:"2XU Wetsuit",url:"/plugins/com.example.aloha.plugins.Product/resources/2xu-wetsuit.jpg",type:"product"},{id:3,name:"Asics Noosa Tri",url:"/plugins/com.example.aloha.plugins.Product/resources/asics-noosa.jpg",type:"product"},{id:4,name:"Mizuno Wave Musha 2",url:"/plugins/com.example.aloha.plugins.Product/resources/mizuno-wave-musha2.jpg",
type:"product"},{id:5,name:"Simplon Mr. T",url:"/plugins/com.example.aloha.plugins.Product/resources/simplon-mrt.jpg",type:"product"},{id:6,name:"Zoggs Predator",url:"/plugins/com.example.aloha.plugins.Product/resources/zoggs-predator.jpg",type:"product"},{id:7,name:"Fivefingers KSO",url:"/plugins/com.example.aloha.plugins.Product/resources/fivefingers-kso.jpg",type:"product"},{id:8,name:"Trek Fuel EX",url:"/plugins/com.example.aloha.plugins.Product/resources/trek-fuel-ex.jpg",type:"product"}];
GENTICS.Aloha.Repositories.Product.query=function(a,b){var e=this.settings.data.filter(function(c){var d=RegExp(a.queryString,"i");return jQuery.inArray(c.type,a.objectTypeFilter)>-1&&(c.name.match(d)||c.url.match(d))});b.call(this,e)};GENTICS.Aloha.Repositories.Product.markObject=function(a,b){EXAMPLE.Product.updateProduct(a,b)};