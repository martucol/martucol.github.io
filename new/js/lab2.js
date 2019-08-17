//LANDER

// variables generales

var mouse = new THREE.Vector2;
var width = window.innerWidth;
var height= window.innerHeight;
var time, start = Date.now();
var raycaster = new THREE.Raycaster();
var intersects = [];
var scene, camera, renderer;
var material, objeto, geometry, mesh, light;
var texNum = 1;
var k,j; // multiplicador global

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	mouseX = event.clientX ;
	mouseY = event.clientY ;
	k = map(mouse.x, 0, window.innerWidth, 7, 5);
    j = map(mouse.y, 0, window.innerWidth, 7, 5);
}

function onWindowResize() {

	width = window.innerWidth;
	height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width , height );
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function map(x,a,b,c,d){
	var y = (x-a)/(b-a)*(d-c)+c;
	return y;
}

// inicializacion
function init(){
	k=5;
	j=6;
	//interactividad
	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('onClick', function(event) {
		texNum === 22 ? 1 : texNum + 1;
		material.uniforms.tMatCap.value = `'textures/matcap/matcap${texNum}.jpg'`
	});
 	
	window.addEventListener('resize', onWindowResize, false);

	//creación de escena threejs
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(width*0.75, height*0.75);
	renderer.setClearColor(0xb3073b, 1);//color de fondo

	document.querySelector("#container").appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/ window.innerHeight, 1, 5000 );	
    camera.position.z = -150; //posicion de la cámara

	
	material = new THREE.ShaderMaterial( {
	  uniforms: {
	    tMatCap: {
	      type: 't',
	      value: THREE.ImageUtils.loadTexture('textures/matcap/matcap1.jpg')
	    },
	    time: {
	    	type: "f",
	    	value: time
	    }
	  },
	  vertexShader: document.getElementById('sem-vs2' ).textContent,
	  fragmentShader: document.getElementById('sem-fs2' ).textContent,
	  shading: THREE.SmoothShading
	} );
	material.uniforms.tMatCap.value.wrapS = 
			material.uniforms.tMatCap.value.wrapT = THREE.ClampToEdgeWrapping;
	objeto = new THREE.Mesh(new THREE.TorusKnotGeometry(50, 10, 50, 20 ), material);
	scene.add(objeto);

	geometry =  new THREE.SphereGeometry(1, 64, 64);

	light = new THREE.PointLight(0xbbff55, 1 , 100);
	light.position.set(0,15,-120);
	scene.add(light);

	var ambient = new THREE.AmbientLight(0x00ffff, 0.5);
	scene.add(ambient);
};

// update function
function update() {
	//multiplicar por float
	//var k = 7;// k local

	//plan a
	// for (var i = 0; i < geometry.vertices.length; i++) {
  //  		var p = geometry.vertices[i];
  //  		p.normalize().multiplyScalar(1 + 0.2 * noise.perlin3(p.x*k + time, p.y * j + Math.cos(time), p.z ));//multiplica el noise por 0.3 y le suma 1 ; rango final 0.7 a 1.3
	// }
	
	//plan b (FLUBBER)
		for (var i = 0; i < geometry.faces.length; i++) {
    var uv = geometry.faceVertexUvs[0][i]; //faceVertexUvs is a huge arrayed stored inside of another array
    var f = geometry.faces[i];
    var p = geometry.vertices[f.a];//take the first vertex from each face
    p.normalize().multiplyScalar(1+0.3*noise.perlin3(uv[0].x*k, uv[0].y*k, time));
	}
	
	//updatear
	geometry.verticesNeedUpdate = true; //must be set or vertices will not update
	geometry.computeVertexNormals();
	geometry.normalsNeedUpdate = true;
};

// render 
function render(){
	//update variables y uniforms

	material.uniforms[ 'time' ].value = .005 * ( Date.now() - start );
	time = (Date.now() - start ) * 0.001;

	update();

	light.position.x = 5 * Math.cos(time) + 25;
  light.position.y = 5 * Math.sin(time) ;

	//raycasting
	raycaster.setFromCamera( mouse, camera );
	intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0  ) {

	} else {

	}

	objeto.rotation.z += 0.003;
	objeto.rotation.y += 0.003;


	camera.lookAt( scene.position );
	renderer.render(scene, camera);
	requestAnimationFrame( render );
}

init();
render();