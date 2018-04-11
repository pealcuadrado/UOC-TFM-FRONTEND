var url="http://localhost:8080/";

var listoplan= angular.module('listoplan',[]);

listoplan.service('InfoUsuario', function() {
	this.nombre;
	this.apellido;
	this.id_usuario;
	this.token;
})

listoplan.controller('datosUsuarioController', function($scope,$http,InfoUsuario) {
	token=localStorage.getItem("token");
	if(token==null){
		console.log("Token no disponible");
		window.location.replace("login.html");
	}
	else{
		console.log(token);
		InfoUsuario.token=token;
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
        	InfoUsuario.nombre=response.data.nombre;
        	InfoUsuario.apellido=response.data.apellido;
        	InfoUsuario.id_usuario=response.data.id_usuario;
        	$scope.nombre=InfoUsuario.nombre;
        	$scope.apellido=InfoUsuario.apellido;
        	$scope.id_usuario=InfoUsuario.id_usuario;
    	  }, function errorCallback(response) {
    		  	console.log(response.data.status);
    	    	window.location.replace("login.html");
    	  });
});

listoplan.controller('modalController', function($scope) {
	$scope.refrescarModal= function(elemento){
		if(elemento=="nota"){
			$scope.plantilla='modals/nota.html';
			//$("#contenido_modal").load("modals/nota.html");
			$scope.modal={"titulo":"Nota"};
		}
		if(elemento=="lista"){
			$scope.plantilla='modals/lista.html';
			$scope.modal={"titulo":"Lista"};
		}
		
	}
})

listoplan.controller('notaController',function($scope,$http,InfoUsuario){
	$scope.guardarNota=function(){
		$("#error_nota").hide();
		$("#ok_nota").hide();
		if($scope.titulo==undefined || $scope.titulo.length==0){
			$("#error_nota").show();
			$scope.error_msg="La nota debe tener un título";
			return;
		}
	    $http({
	    	  method: 'POST',
	    	  url: url+"/notas/nueva_nota",
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "id":InfoUsuario.id_usuario.toString(),
	    		  "titulo":$scope.titulo,
	    		  "contenido":$scope.contenido,
	    		  "ambito":"usuario"
	    	  }
	    	}).then(function successCallback(response) {
		        	$("#ok_nota").show();
		        	$scope.ok_msg="La nota se ha guardado correctamente";
	    	  }, function errorCallback(response) {
	  				$("#error_nota").show();
	  				$scope.error_msg="Se ha producido un error al guardar la nota";
	  				console.log(response.data.status);
	    	    	
	    	  });

	}
});

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