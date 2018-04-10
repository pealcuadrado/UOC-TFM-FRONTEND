var url="http://localhost:8080/";

var listoplan= angular.module('listoplan',[]);
listoplan.controller('datosUsuarioController', function($scope,$http) {
	token=localStorage.getItem("token");
	if(token==null){
		console.log("Token no disponible");
		window.location.replace("login.html");
	}
	else{
		console.log(token);
	}
    /*$.ajax({
    	type:"get",
    	url:url+"usuarios/informacion_usuario/0",
    	headers: {"token":token},
    	dataType:"json",
    	contentType: "application/json; charset=utf-8"
    }).done(function(data){
    	$scope.$apply(function(){
        	$scope.nombre=data.nombre;
        	$scope.apellido=data.apellido;
        	$scope.id_usuario=data.id_usuario;
    	});
    }).fail(function(data, statusText, xhr){
    	console.log(data.status);
    	window.location.replace("login.html");
    });*/
    
    $http({
    	  method: 'GET',
    	  url: url+"usuarios/informacion_usuario/0",
    	  headers: {"token":token},
    	}).then(function successCallback(response) {
        	$scope.nombre=response.data.nombre;
        	$scope.apellido=response.data.apellido;
        	$scope.id_usuario=response.data.id_usuario;
    	  }, function errorCallback(response) {
    		  	console.log(response.data.status);
    	    	window.location.replace("login.html");
    	  });
});

listoplan.controller('modalController', function($scope) {
	$scope.refrescarModal= function(elemento){
		if(elemento=="nota"){
			$("#contenido_modal").load("modals/nota.html");
			$scope.modal={"titulo":"Nota", "boton":"Guardar nota"};
		}
		if(elemento=="lista"){
			$("#contenido_modal").load("modals/lista.html");
			$scope.modal={"titulo":"Lista", "boton":"Guardar lista"};
		}
	}
})


$("#logout").click(function(evento){
	evento.preventDefault();
	localStorage.removeItem('token');
	window.location.replace("login.html");
});

/*$("#nueva_nota").click(function(evento){
	evento.preventDefault();
	$("#contenido_modal").load("modals/nota.html");
	$("#contenido_")
});*/