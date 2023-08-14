import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

/*
const geometryroom = new THREE.BoxGeometry( 2000, 2000, 2000 );
const materialroom = new THREE.MeshStandardMaterial( { 
    color: 0x00ff00,
    side: THREE.DoubleSide
 } );
const cube = new THREE.Mesh( geometryroom, materialroom );
scene.add( cube );
*/


const ambient = new THREE.AmbientLight(0Xffffff);
scene.add( ambient )

camera.position.z = 400;
camera.position.x = 20;
const camerahelper = new THREE.CameraHelper( camera );
scene.add( camerahelper );


const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 20, 0, 0 );
controls.update();
controls.addEventListener( 'change', render );
window.addEventListener( 'resize', onWindowResize );

/*controls.addEventListener( "change", event => {  
    console.log( controls.object.position ); 
});*/



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function render() {

    renderer.render( scene, camera );

}



var fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json',function(tex){ 
    var  textGeo = new TextGeometry('two 02', {
            size: 100,
            height: 20,
            curveSegments: 16,
            font: tex,
    });
    var  color = new THREE.Color();
    color.setRGB(255, 250, 250);
    var  textMaterial = new THREE.MeshStandardMaterial({ color: color });
    var  text = new THREE.Mesh(textGeo , textMaterial);
    text.position.set(-400, 0, 0)
    text.castShadow = true;
    scene.add(text);
})




const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
directionalLight.position.set(50, 50, 60);
directionalLight.castShadow = true;
directionalLight.shadow.camera.bottom = -1000;
directionalLight.shadow.camera.left = -2000;
directionalLight.shadow.camera.top = 1000;
directionalLight.shadow.camera.right = 1000;



scene.add( directionalLight );
const lighthelper = new THREE.DirectionalLightHelper( directionalLight, 50 );
scene.add( lighthelper );
const dlighthelperCamera = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(dlighthelperCamera);





const geometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );
const material = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
plane.position.set(0, 0, -100);
plane.receiveShadow = true;
scene.add( plane );





function animate() {
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();