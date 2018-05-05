var url="http://localhost:8080/";

var listoplan= angular.module('listoplan',[]);

listoplan.service('InfoUsuario', function() {
	this.nombre;
	this.apellido;
	this.id_usuario;
	this.token;
})
listoplan.service('InfoGrupo', function() {
	this.infoGrupo;
	this.miembros;
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
    		  	localStorage.removeItem("token");
    	    	window.location.replace("login.html");
    	  });
});

listoplan.controller('modalController', function($scope,$http,InfoUsuario) {
	$scope.refrescarModal= function(elemento,id,id_grupo){
		console.log(id_grupo)
		if(elemento=="nota"){
			$scope.plantilla='modals/nota.html';
			//$("#contenido_modal").load("modals/nota.html");
			$scope.modal={"titulo":"Nota"};
			//si tiene id, recuperar la información para visualizar o modificar
			if(id > 0){
				var reqUrl;
				if(id_grupo > 0){
					reqUrl=url+"notas/detalle_nota_grupo/"+id
				}else{
					reqUrl=url+"notas/detalle_nota_usuario/"+id
				}
		        $http({
			      	  method: 'GET',
			      	  url: reqUrl,
			      	  headers: {"token":InfoUsuario.token},
			      	}).then(function successCallback(response) {
			          	$scope.id_nota=response.data.idNota;
			          	$scope.id_grupo=id_grupo;
			          	$scope.titulo=response.data.titulo;
			          	$scope.contenido=response.data.contenido;
			      	}, function errorCallback(response) {
			      		 console.log(response.data.status);
			      	});
			}
			else{
	          	$scope.id_nota=0;
	          	$scope.id_grupo=id_grupo;
	          	$scope.titulo="";
	          	$scope.contenido="";
			}
		}
		if(elemento=="lista"){
			$scope.plantilla='modals/lista.html';
			$scope.modal={"titulo":"Lista"};
			if(id > 0){
				var reqUrl;
				if(id_grupo > 0){
					reqUrl=url+"listas/detalle_lista_grupo/"+id
				}else{
					reqUrl=url+"listas/detalle_lista_usuario/"+id
				}
		        $http({
			      	  method: 'GET',
			      	  url: reqUrl,
			      	  headers: {"token":InfoUsuario.token},
			      	}).then(function successCallback(response) {
			          	$scope.id_lista=response.data.idLista;
			          	$scope.id_grupo=id_grupo;
			          	$scope.nombreLista=response.data.nombre;
			          	$scope.descripcion=response.data.descripcion;
			          	$scope.tipo_lista=response.data.tipoLista;
			          	$scope.compartida=response.data.compartida;
			      	}, function errorCallback(response) {
			      		 console.log(response.data.status);
			      	});
			}
			else{
	          	$scope.id_lista=0;
	          	$scope.id_grupo=id_grupo;
	          	$scope.nombreLista="";
	          	$scope.descripcion="";
	          	$scope.tipo_lista="";
			}
		}
		if(elemento=="grupo"){
			$scope.plantilla='modals/grupo.html';
			$scope.modal={"titulo":"Grupo"};
			if(id_grupo==0){
	          	$scope.id_grupo=0;
	          	$scope.nombre_grupo="";
			}else{
		        $http({
			      	  method: 'GET',
			      	  url: url+'grupos/informacion_grupo/'+id_grupo,
			      	  headers: {"token":InfoUsuario.token},
			      	}).then(function successCallback(response) {
			          	$scope.id_grupo=id_grupo;
			          	$scope.nombre_grupo=response.data.nombre;
			      	}, function errorCallback(response) {
			      		 console.log(response.data.status);
			      	});
			}
		}
		
		if(elemento=="listas_compartidas"){
			$scope.id_grupo=id_grupo;
			$scope.plantilla='modals/listas_compartidas.html';
			$scope.modal={"titulo":"Buscar listas compartidas"};
		}
		
	}
})

listoplan.controller('getNotaController',function($scope,$http,InfoUsuario,$rootScope){

	$scope.getNotasUsuario=function(id_grupo){
    	var reqUrl;
    	if(id_grupo > 0){
    		reqUrl=url+"notas/notas_grupo/"+id_grupo;
    	}else{
    		reqUrl=url+"notas/notas_usuario";
    	}
        $http({
      	  method: 'GET',
      	  url: reqUrl,
      	  headers: {"token":InfoUsuario.token},
      	}).then(function successCallback(response) {
          	$scope.notas=response.data;
      	}, function errorCallback(response) {
      		 console.log(response.data.status);
      	});
    };
    
    $scope.$on('seleccion', function(event, data) { $scope.getNotasUsuario(data)});
    $rootScope.$on('modificarListadoNotas', function(event, data) { $scope.getNotasUsuario(data)});
});

listoplan.controller('notaController',function($scope,$http,InfoUsuario,$rootScope){
	
	$scope.guardarNota=function(id_nota,id_grupo){
		$("#error_nota").hide();
		$("#ok_nota").hide();
		if($scope.titulo==undefined || $scope.titulo.length==0){
			$("#error_nota").show();
			$scope.error_msg="La nota debe tener un título";
			return;
		}
		var reqUrl;
		var reqAmbito;
		if(id_grupo==0){
			reqAmbito="usuario";
		}else{
			reqAmbito="grupo";
		}
		if(id_nota==0){
			//Nueva nota
			reqUrl=url+"notas/nueva_nota";
		}else{
			reqUrl=url+"notas/modificacion_nota"
		}
	    $http({
	    	  method: 'POST',
	    	  url: reqUrl,
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "id":id_grupo.toString(),
	    		  "idNota":id_nota.toString(),
	    		  "titulo":$scope.titulo,
	    		  "contenido":$scope.contenido,
	    		  "ambito":reqAmbito
	    	  }
	    	}).then(function successCallback(response) {
		        	$("#ok_nota").show();
		        	$scope.ok_msg="La nota se ha guardado correctamente";
		        	alert("La nota se ha guardado correctamente");
		        	$rootScope.$broadcast('modificarListadoNotas', id_grupo);
		        	$('#modal_generico').modal('toggle');
	    	  }, function errorCallback(response) {
	  				$("#error_nota").show();
	  				$scope.error_msg="Se ha producido un error al guardar la nota";
	  				console.log(response.data.status);
	    	    	
	    	  });
		};
	    $scope.desactivarNota=function(id_nota,id_grupo){
			var reqAmbito;
			if(id_grupo==0){
				reqAmbito="usuario";
			}else{
				reqAmbito="grupo";
			}
	    	if(confirm("Estás seguro que deseas eliminar la nota?") && id_nota > 0){
	    		$http({
	  	    	  method: 'POST',
	  	    	  url: url+"notas/desactivacion_nota",
	  	    	  headers: {"token":InfoUsuario.token},
	  	    	  data:{
	  	    		  "id":id_grupo.toString(),
	  	    		  "idNota":id_nota.toString(),
	  	    		  "ambito":reqAmbito
	  	    	  }
	  	    	}).then(function successCallback(response) {
	  		        	alert("La nota se ha eliminado correctamente");
	  		        	$rootScope.$broadcast('modificarListadoNotas', id_grupo);
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

$("#logout").click(function(evento){
	evento.preventDefault();
	localStorage.removeItem('token');
	window.location.replace("login.html");
});

listoplan.controller('getListaController',function($scope,$http,InfoUsuario,$rootScope){
	$scope.getListasUsuario=function(id_grupo){
		var reqUrl;
		if(id_grupo > 0){
			reqUrl=url+"listas/listas_grupo/"+id_grupo;
		}else{
			reqUrl=url+"listas/listas_usuario/";
		}
	    $http({
	  	  method: 'GET',
	  	  url: reqUrl,
	  	  headers: {"token":InfoUsuario.token},
	  	}).then(function successCallback(response) {
	      	$scope.listas=response.data;
	  	}, function errorCallback(response) {
	  		 console.log(response.data.status);
	  	});
	};

    $scope.$on('seleccion', function(event, data) { $scope.getListasUsuario(data)});
    $rootScope.$on('modificarListadoListas', function(event, data) { $scope.getListasUsuario(data)});
});

listoplan.controller('listaController',function($scope,$http,InfoUsuario,$rootScope){
	$scope.guardarLista=function(id_lista,id_grupo){
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
		var reqAmbito;
		if(id_grupo==0){
			reqAmbito="usuario";
		}else{
			reqAmbito="grupo";
		}
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
	    		  "id":id_grupo.toString(),
	    		  "idLista":id_lista.toString(),
	    		  "nombre":$scope.nombreLista,
	    		  "descripcion":$scope.descripcion,
	    		  "tipoLista":$scope.tipo_lista,
	    		  "ambito":reqAmbito
	    	  }
	    	}).then(function successCallback(response) {
		        	$("#ok_lista").show();
		        	$scope.ok_msg="La lista se ha guardado correctamente";
  		        	alert("La lista se ha guardado correctamente");
  		        	$rootScope.$broadcast('modificarListadoListas', id_grupo);
  		        	$('#modal_generico').modal('toggle');
	    	  }, function errorCallback(response) {
	  				$("#error_nota").show();
	  				$scope.error_msg="Se ha producido un error al guardar la lista";
	  				console.log(response.data.status);
	    	    	
	    	  });
		};

	    $scope.desactivarLista=function(id_lista,id_grupo){
			var reqAmbito;
			if(id_grupo==0){
				reqAmbito="usuario";
			}else{
				reqAmbito="grupo";
			}
	    	if(confirm("Estás seguro que deseas eliminar la lista?") && id_lista > 0){
	    		$http({
	  	    	  method: 'POST',
	  	    	  url: url+"listas/desactivacion_lista",
	  	    	  headers: {"token":InfoUsuario.token},
	  	    	  data:{
	  	    		  "id":id_grupo.toString(),
	  	    		  "idLista":id_lista.toString(),
	  	    		  "ambito":reqAmbito
	  	    	  }
	  	    	}).then(function successCallback(response) {
	  		        	alert("La lista se ha eliminado correctamente");
	  		        	$rootScope.$broadcast('modificarListadoListas', id_grupo);
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
	    $scope.getItemsLista=function(id_lista,id_grupo){
	    	var reqUrl;
	    	if(id_grupo==0){
	    		reqUrl=url+"listas/detalle_lista_usuario/"+id_lista;
	    	} else{
	    		reqUrl=url+"listas/detalle_lista_grupo/"+id_lista;
	    	}
	        $http({
		      	  method: 'GET',
		      	  url: reqUrl,
		      	  headers: {"token":InfoUsuario.token},
		      	}).then(function successCallback(response) {
		      		//console.log(response.data);
		      		var total=response.data.items.length;
		      		var marcados=0;
		      		var c;
		      		for (c=0;c<response.data.items.length;c++){
		      			if(response.data.items[c].valor=="1"){
		      				marcados++;
		      			}
		      		}
		      		var ratio=Math.round(marcados/total*100);
		      		if(total==0) ratio=0;
		      		$scope.ratio=ratio+'%';
		          	$scope.items=response.data.items;
		      	}, function errorCallback(response) {
		      		 console.log(response.data.status);
		      	});
	    };
	    
	    $scope.guardarItem=function(id_lista,id_grupo,tipoLista,id_item){
			var reqAmbito;
			var reqUrl;
			if(id_grupo==0){
				reqAmbito="usuario";
			}else{
				reqAmbito="grupo";
			}
			var reqValor;
			var reqItem;
			if(tipoLista=="CHECKLIST"){
				reqItem=$("#item_chk").val();
				reqValor="0";
			}else{
				reqItem=$("#item").val();
				reqValor=$("#valor").val();
			}
			if(id_item==0){
				reqUrl=url+"listas/nuevo_item";
			}else{
				reqUrl=url+"listas/modificacion_item";
				reqItem=$("#item_"+id_item).text();
				reqValor=$("#item_value_"+id_item).val();
				if(tipoLista=="CHECKLIST"){
					reqValor=$("#item_value_"+id_item).is(":checked");
					if(reqValor==true){
						reqValor="1";
					}else{
						reqValor="0";
					}
				}
			}
		    $http({
		    	  method: 'POST',
		    	  url: reqUrl,
		    	  headers: {"token":InfoUsuario.token},
		    	  data:{
		    		  "id":id_grupo.toString(),
		    		  "idLista":id_lista.toString(),
		    		  "idItem":id_item.toString(),
		    		  "nombre":reqItem,
		    		  "valor":reqValor,
		    		  "orden":"1",
		    		  "ambito":reqAmbito
		    	  }
		    	}).then(function successCallback(response) {
		    		$scope.getItemsLista(id_lista,id_grupo);
		    	  }, function errorCallback(response) {
		  				console.log(response.data.status);	
		    	  });
	    };
	    
	    $scope.eliminarItem=function(id_lista,id_item,id_grupo){
			var reqAmbito;
			if(id_grupo==0){
				reqAmbito="usuario";
			}else{
				reqAmbito="grupo";
			}
		    $http({
		    	  method: 'POST',
		    	  url: url+"listas/eliminacion_item",
		    	  headers: {"token":InfoUsuario.token},
		    	  data:{
		    		  "id":id_grupo.toString(),
		    		  "idLista":id_lista.toString(),
		    		  "idItem":id_item.toString(),
		    		  "ambito":reqAmbito
		    	  }
		    	}).then(function successCallback(response) {
		    		$scope.getItemsLista(id_lista,id_grupo);
		    	  }, function errorCallback(response) {
		  				console.log(response.data.status);	
		    	  });
	    }
	    
	    $scope.comparticionLista=function(id_lista,id_grupo,comp){
			if(id_grupo==0){
				ambito="USUARIO"
			}else{
				ambito="GRUPO"
			}
			$http({
		    	  method: 'POST',
		    	  url: url+"listas/comparticion_lista",
		    	  headers: {"token":InfoUsuario.token},
		    	  data:{
		    		  "idLista":id_lista.toString(),
		    		  "id": id_grupo.toString(),
		    		  "compartida":comp.toString(),
		    		  "ambito":ambito
		    	  }
		    	}).then(function successCallback(response) {
		    		$("#ok_grupo").show();
					$scope.ok_msg="La lista se ha copiado correctamente";
		    	  }, function errorCallback(response) {
		  				$("#error_grupo").show();
		  				$scope.error_msg="Se ha producido un error al copiar la lista";
		  				console.log(response.data.status);
		    	  });
	    };
	    
	    
	    $scope.$on('seleccion', function(event, data) { $scope.getListasUsuario(data)});
});

listoplan.controller("menuController", function($scope,$http,InfoUsuario,$rootScope) {
	
	$scope.getGrupos=function(){
    $http({
    	  method: 'GET',
    	  url: url+"grupos/grupos_usuario/",
    	  headers: {"token":InfoUsuario.token},
    	}).then(function successCallback(response) {
        	$scope.grupos=response.data;
    	}, function errorCallback(response) {
    		 console.log(response.data.status);
    	});
	};
    $rootScope.$on('modificarListadoGrupos', function(event) { $scope.getGrupos()});
});

listoplan.controller('dashboardController', function($scope,$http,InfoUsuario,InfoGrupo,$rootScope) {
	
	$scope.refrescarDashboard= function(idGrupo){
		$scope.id_grupo=idGrupo;
		if(idGrupo > 0){
			//Si idGrupo > 0 -> Obtenemos la información del grupo
		    $http({
		    	  method: 'GET',
		    	  url: url+"grupos/informacion_grupo/"+idGrupo,
		    	  headers: {"token":InfoUsuario.token},
		    	}).then(function successCallback(response) {
		        	 InfoGrupo.infoGrupo=response.data;
		        	 $scope.infoGrupo=InfoGrupo.infoGrupo;
		        	 $http({
		        	    	  method: 'GET',
		        	    	  url: url+"grupos/usuarios_grupo/"+idGrupo,
		        	    	  headers: {"token":InfoUsuario.token},
		        	    	}).then(function successCallback(response) {
		        	    		InfoGrupo.miembros=response.data;
		        	        	var miembrosString="";
		        	        	var admin=0;
		        	        	var c;
		        	        	for (c=0;c< InfoGrupo.miembros.length; c++){
		        	        		miembrosString += InfoGrupo.miembros[c].nombre + InfoGrupo.miembros[c].apellido;
		        	        		if(c<InfoGrupo.miembros.length-1){
		        	        			miembrosString += ', ';
		        	        		}
		        	        	}
		        	        	$scope.miembrosString=miembrosString;
		        	    	}, function errorCallback(response) {
		        	    		 console.log(response.data.status);
		        	 });
		    	}, function errorCallback(response) {
		    		 console.log(response.data.status);
		    	});
		}
		$scope.$broadcast('seleccion', idGrupo);
		$scope.vistaDashboard="fragmentos/items_usuario.html";
	}
	$scope.refrescarDashboard(0);
	$rootScope.$on('refrescarDashboard', function(event, data) { $scope.refrescarDashboard(data)});
	
});

listoplan.controller('gruposController', function($scope,$http,InfoUsuario,InfoGrupo,$rootScope){
	$scope.infoGrupo=InfoGrupo;
	$scope.guardarGrupo=function(id_grupo){
		var reqUrl;
		if(id_grupo==0){
			reqUrl=url+"grupos/nuevo_grupo";
		}else{
			reqUrl=url+"grupos/modificacion_grupo";
		}
		$http({
	    	  method: 'POST',
	    	  url: reqUrl,
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "nombreGrupo":$scope.nombre_grupo,
	    		  "idGrupo":id_grupo.toString()
	    	  }
	    	}).then(function successCallback(response) {
		        	alert("El grupo se ha guardado correctamente");
		        	$rootScope.$broadcast('modificarListadoGrupos');
		        	$('#modal_generico').modal('toggle');
	    	  }, function errorCallback(response) {
	  				$("#error_grupo").show();
	  				$scope.error_msg="Se ha producido un error al guardar el grupo " + response.data.toString();
	  				console.log(response.data.status);
	    	  });
	};
	$scope.desactivarGrupo=function(id_grupo){
    	if(confirm("Estás seguro que deseas eliminar el grupo?") && id_grupo > 0){
    		$http({
  	    	  method: 'POST',
  	    	  url: url+"grupos/desactivacion_grupo",
  	    	  headers: {"token":InfoUsuario.token},
  	    	  data:{
  	    		  "idGrupo":id_grupo.toString()
  	    	  }
  	    	}).then(function successCallback(response) {
  		        	alert("El grupo se ha eliminado correctamente");
  		        	$rootScope.$broadcast('modificarListadoGrupos');
  		        	$('#modal_generico').modal('toggle');
  	    	  }, function errorCallback(response) {
  	  				$("#error_grupo").show();
  	  				$scope.error_msg="Se ha producido un error al eliminar el grupo";
  	  				console.log(response.data.status);
  	    	    	
  	    	  });
    	};
	};
	
	$scope.desvincularUsuario=function(id_usuario, id_grupo){
		$http({
	    	  method: 'POST',
	    	  url: url+"grupos/desvinculacion_usuario_grupo",
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "idUsuario":id_usuario.toString(),
	    		  "idGrupo":id_grupo.toString(),
	    	  }
	    	}).then(function successCallback(response) {
	    		$("#ok_grupo").show();
  				$scope.ok_msg="El usuario se ha desvinculado correctamente";
  				$rootScope.$broadcast('refrescarDashboard',id_grupo);
	    	  }, function errorCallback(response) {
	  				$("#error_grupo").show();
	  				$scope.error_msg="Se ha producido un error al desvincular el usuario";
	  				console.log(response.data.status);
	    	  });
	    	    	
	};
	$scope.vincularUsuario=function(id_usuario, id_grupo){
		var esAdministrador;
		var res= $("#esAdministrador_"+id_usuario).is(":checked");
		if(res==true){
			esAdministrador="1";
		} else{
			esAdministrador="0";
		}
		$http({
	    	  method: 'POST',
	    	  url: url+"grupos/vinculacion_usuario_grupo",
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "idUsuario":id_usuario.toString(),
	    		  "idGrupo":id_grupo.toString(),
	    		  "esAdministrador":esAdministrador
	    	  }
	    	}).then(function successCallback(response) {
	    		$("#ok_grupo").show();
				$scope.ok_msg="El usuario se ha vinculado correctamente";
				$rootScope.$broadcast('refrescarDashboard',id_grupo);
	    	  }, function errorCallback(response) {
	  				$("#error_grupo").show();
	  				$scope.error_msg="Se ha producido un error al vincular el usuario";
	  				console.log(response.data.status);
	    	  });
	};
	
	$scope.buscarUsuarios=function(){
		var idMiembros=[];
		var c;
		for (c=0; c<InfoGrupo.miembros.length; c++){
			idMiembros.push(InfoGrupo.miembros[c].id_usuario);
		}
	    $http({
	    	  method: 'GET',
	    	  url: url+"usuarios/busqueda_usuario?filtro="+$scope.textoBusqueda,
	    	  headers: {"token":InfoUsuario.token}
	    	}).then(function successCallback(response) {
	    		//Solo se muestran aquellos usuarios que no pertenecen al grupo
	    		var usuarios=[];
	    		for (c=0; c<response.data.length; c++){
	    			if(!idMiembros.includes(response.data[c].id_usuario)){
	    				usuarios.push(response.data[c]);
	    			}
	    		}
	        	$scope.resultadoUsuarios=usuarios;
	    	}, function errorCallback(response) {
	    		 console.log(response.data.status);
	    	});
	};
});

listoplan.controller('listasCompartidasController', function($scope,$http,InfoUsuario,$rootScope){
	$scope.buscarListasCompartidas=function(){
	    $http({
	    	  method: 'GET',
	    	  url: url+"listas/listas_compartidas?filtro="+$scope.filtro,
	    	  headers: {"token":InfoUsuario.token}
	    	}).then(function successCallback(response) {
	        	$scope.resultadolistas=response.data;
	    	}, function errorCallback(response) {
	    		 console.log(response.data.status);
	    	});
	};
	$scope.copiarLista= function(id_grupo, id_lista){
		var ambito;
		if(id_grupo==0){
			ambito="USUARIO"
		}else{
			ambito="GRUPO"
		}
		$http({
	    	  method: 'POST',
	    	  url: url+"listas/duplicacion_lista",
	    	  headers: {"token":InfoUsuario.token},
	    	  data:{
	    		  "idLista":id_lista.toString(),
	    		  "id": id_grupo.toString(),
	    		  "ambito":ambito
	    	  }
	    	}).then(function successCallback(response) {
	    		$("#ok_grupo").show();
				$scope.ok_msg="La lista se ha copiado correctamente";
				$rootScope.$broadcast('modificarListadoListas', id_grupo);
	    	  }, function errorCallback(response) {
	  				$("#error_grupo").show();
	  				$scope.error_msg="Se ha producido un error al copiar la lista";
	  				console.log(response.data.status);
	    	  });
	}
});

