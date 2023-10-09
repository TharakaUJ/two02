import * as THREE from "https://esm.sh/three";

var mouse = {x: 0, y: 0};
var planePos = {x: 0, y: 0, z: 0};

const container = document.getElementById('insights');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 5;


const renderer = new THREE.WebGLRenderer({
  alpha: true
});
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );


const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(0, 0, 60);
scene.add( directionalLight );


const loader = new THREE.TextureLoader();
const imag = "https://images.unsplash.com/photo-1695512294611-80be329e683b?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTY3NjQ4NjN8&ixlib=rb-4.0.3&q=85"



function createAPlane(imag) {
  const geometry = new THREE.PlaneGeometry( 3, 4 );
  const material = new THREE.MeshLambertMaterial({
                  color: 0xffffff,
                  map: loader.load(imag),
                  opacity: 0,
                  transparent: true
              });
  const object = new THREE.Mesh( geometry, material );
  return object;
};


const plane = createAPlane(imag);
//plane.position.set(0, 10, -5);

  scene.add( plane );



const hoverElement = document.getElementsByClassName('insight-items')[0];

hoverElement.addEventListener('mouseenter', ()=>{
  let elRect = hoverElement.getBoundingClientRect();
  let elStartX = (elRect.right / window.innerWidth) * 2 - 1;
  let elStartY = -(elRect.top / window.innerWidth) * 2 + 1;;
  plane.position.copy(IntoThreeD(elStartX, elStartY));
  plane.material.opacity = 1;
  setTimeout(() => {
    hoverElement.addEventListener('mousemove', (event) => {
      planePos = onMouseMove(event);
    });
  }, 10);
});

hoverElement.addEventListener('mouseleave', () => {
  looper();
  hoverElement.removeEventListener('mousemove', (event) => {
      onMouseMove(event);
    });
});




// Follows the mouse event
function onMouseMove(event) {

	// Update the mouse variable
	event.preventDefault();
  
  //dafault * 2 -1
	mouse.x = (event.clientX / window.innerWidth) * 1.8 - 0.8; 
  
  //default *2 + 1
	mouse.y = - (event.clientY / window.innerHeight) * 1.8 + 1;
  
  var pos = IntoThreeD(mouse.x, mouse.y);
  //plane.position.copy(pos);
  
  return pos;
  
	// Make the sphere follow the mouse
//	mouseMesh.position.set(event.clientX, event.clientY, 0);
};


function IntoThreeD(x, y) {
  // Make the object follow the mouse
  var vector = new THREE.Vector3(x, y, 0.5);
	vector.unproject( camera );
	var dir = vector.sub( camera.position ).normalize();
	var distance = - camera.position.z / dir.z;
	var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  return pos
};


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  plane.position.lerp(planePos, 0.02);
}
animate();


function looper() {
  if (plane.material.opacity > 0) {
    requestAnimationFrame( looper );
    plane.material.opacity = plane.material.opacity - 0.05;
    console.log(plane.material.opacity);
  }
}