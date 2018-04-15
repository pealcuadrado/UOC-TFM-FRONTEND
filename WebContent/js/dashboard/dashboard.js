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

listoplan.controller('modalController', function($scope,$http,InfoUsuario) {
	$scope.refrescarModal= function(elemento,id){
		if(elemento=="nota"){
			$scope.plantilla='modals/nota.html';
			//$("#contenido_modal").load("modals/nota.html");
			$scope.modal={"titulo":"Nota"};
			//si tiene id, recuperar la información para visualizar o modificar
			if(id > 0){
		        $http({
			      	  method: 'GET',
			      	  url: url+"/notas/detalle_nota_usuario/"+id,
			      	  headers: {"token":InfoUsuario.token},
			      	}).then(function successCallback(response) {
			          	$scope.id_nota=response.data.idNota;
			          	$scope.titulo=response.data.titulo;
			          	$scope.contenido=response.data.contenido;
			      	}, function errorCallback(response) {
			      		 console.log(response.data.status);
			      	});
			}
			else{
	          	$scope.id_nota=0;
	          	$scope.titulo="";
	          	$scope.contenido="";
			}
		}
		if(elemento=="lista"){
			$scope.plantilla='modals/lista.html';
			$scope.modal={"titulo":"Lista"};
			if(id > 0){
		        $http({
			      	  method: 'GET',
			      	  url: url+"listas/detalle_lista_usuario/"+id,
			      	  headers: {"token":InfoUsuario.token},
			      	}).then(function successCallback(response) {
			          	$scope.id_lista=response.data.idLista;
			          	$scope.nombre=response.data.nombre;
			          	$scope.descripcion=response.data.descripcion;
			          	$scope.tipo_lista=response.data.tipoLista;
			      	}, function errorCallback(response) {
			      		 console.log(response.data.status);
			      	});
			}
			else{
	          	$scope.id_lista=0;
	          	$scope.nombre="";
	          	$scope.descripcion="";
	          	$scope.tipo_lista="";
			}
		}
		
	}
})

listoplan.controller('notaController',function($scope,$http,InfoUsuario){
	$scope.guardarNota=function(id_nota){
		$("#error_nota").hide();
		$("#ok_nota").hide();
		if($scope.titulo==undefined || $scope.titulo.length==0){
			$("#error_nota").show();
			$scope.error_msg="La nota debe tener un título";
			return;
		}
		var reqUrl;
		if(id_nota==0){
			//Nueva nota
			reqUrl=url+"/notas/nueva_nota";
		}else{
			reqUrl=url+"/notas/modificacion_nota"
		}
	    $http({
	    	  method: 'POST',
	    	  url: reqUrl,
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "id":InfoUsuario.id_usuario.toString(),
	    		  "idNota":id_nota.toString(),
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
		};
	    $scope.getNotasUsuario=function(){
	        $http({
	      	  method: 'GET',
	      	  url: url+"/notas/notas_usuario",
	      	  headers: {"token":InfoUsuario.token},
	      	}).then(function successCallback(response) {
	          	$scope.notas=response.data;
	      	}, function errorCallback(response) {
	      		 console.log(response.data.status);
	      	});
	    };
	    $scope.desactivarNota=function(id_nota){
	    	if(confirm("Estás seguro que deseas eliminar la nota?") && id_nota > 0){
	    		$http({
	  	    	  method: 'POST',
	  	    	  url: url+"/notas/desactivacion_nota",
	  	    	  headers: {"token":InfoUsuario.token},
	  	    	  data:{
	  	    		  "id":InfoUsuario.id_usuario.toString(),
	  	    		  "idNota":id_nota.toString(),
	  	    		  "ambito":"usuario"
	  	    	  }
	  	    	}).then(function successCallback(response) {
	  		        	alert("La nota se ha eliminado correctamente");
	  		        	$('#modal_generico').modal('toggle');
	  	    	  }, function errorCallback(response) {
	  	  				$("#error_nota").show();
	  	  				$scope.error_msg="Se ha producido un error al eliminar la nota";
	  	  				console.log(response.data.status);
	  	    	    	
	  	    	  });
	    	}else{
	    		return;
	    	}
	    	
	    }

});

listoplan.controller('dashboardController', function($scope){
	$scope.vistaDashboard="fragmentos/items_usuario.html";
});

$("#logout").click(function(evento){
	evento.preventDefault();
	localStorage.removeItem('token');
	window.location.replace("login.html");
});

listoplan.controller('listaController',function($scope,$http,InfoUsuario){
	$scope.guardarLista=function(id_lista){
		$("#error_lista").hide();
		$("#ok_lista").hide();
		if($scope.nombre==undefined || $scope.nombre.length==0){
			$("#error_lista").show();
			$scope.error_msg="La lista debe tener un nombre";
			return;
		}
		if($scope.tipo_lista==undefined || $scope.tipo_lista==null || $scope.tipo_lista.length==0){
			$("#error_lista").show();
			$scope.error_msg="La lista debe tener un tipo";
			return;
		}
		var reqUrl;
		if(id_lista==0){
			//Nueva nota
			reqUrl=url+"listas/nueva_lista";
		}else{
			reqUrl=url+"listas/modificacion_lista"
		}
	    $http({
	    	  method: 'POST',
	    	  url: reqUrl,
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "id":InfoUsuario.id_usuario.toString(),
	    		  "idLista":id_lista.toString(),
	    		  "nombre":$scope.nombre,
	    		  "descripcion":$scope.descripcion,
	    		  "tipoLista":$scope.tipo_lista,
	    		  "ambito":"usuario"
	    	  }
	    	}).then(function successCallback(response) {
		        	$("#ok_lista").show();
		        	$scope.ok_msg="La lista se ha guardado correctamente";
	    	  }, function errorCallback(response) {
	  				$("#error_nota").show();
	  				$scope.error_msg="Se ha producido un error al guardar la lista";
	  				console.log(response.data.status);
	    	    	
	    	  });
		};
	    $scope.getListasUsuario=function(){
	        $http({
	      	  method: 'GET',
	      	  url: url+"listas/listas_usuario/",
	      	  headers: {"token":InfoUsuario.token},
	      	}).then(function successCallback(response) {
	          	$scope.listas=response.data;
	      	}, function errorCallback(response) {
	      		 console.log(response.data.status);
	      	});
	    };
	    $scope.desactivarLista=function(id_lista){
	    	if(confirm("Estás seguro que deseas eliminar la lista?") && id_lista > 0){
	    		$http({
	  	    	  method: 'POST',
	  	    	  url: url+"listas/desactivacion_lista",
	  	    	  headers: {"token":InfoUsuario.token},
	  	    	  data:{
	  	    		  "id":InfoUsuario.id_usuario.toString(),
	  	    		  "idLista":id_lista.toString(),
	  	    		  "ambito":"usuario"
	  	    	  }
	  	    	}).then(function successCallback(response) {
	  		        	alert("La lista se ha eliminado correctamente");
	  		        	$('#modal_generico').modal('toggle');
	  	    	  }, function errorCallback(response) {
	  	  				$("#error_nota").show();
	  	  				$scope.error_msg="Se ha producido un error al eliminar la lista";
	  	  				console.log(response.data.status);
	  	    	    	
	  	    	  });
	    	}else{
	    		return;
	    	}
	    	
	    }

});

listoplan.controller("menuController", function($scope,$http,InfoUsuario) {
    $http({
    	  method: 'GET',
    	  url: url+"grupos/grupos_usuario/",
    	  headers: {"token":InfoUsuario.token},
    	}).then(function successCallback(response) {
        	$scope.grupos=response.data;
    	}, function errorCallback(response) {
    		 console.log(response.data.status);
    	});
});
