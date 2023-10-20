---
---

import * as THREE from "https://esm.sh/three";

//common constants
const renderer = new THREE.WebGLRenderer({
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();


const loader = new THREE.TextureLoader();


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 5;



const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 60);
scene.add(directionalLight);

const container = document.getElementById("canvas-container");
container.appendChild(renderer.domElement);

//resized shape based on windows
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

//================common constants end =========================================================

//======================================carasol===================================================
/*
const carasolContainer = document.getElementById('gallery-container');
const carasolItems = carasolContainer.children;
const carasolImages = ["https://images.unsplash.com/photo-1695512294611-80be329e683b?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTY3NjQ4NjN8&ixlib=rb-4.0.3&q=85", "{{ site.baseurl }}/pics/featured-image-for-desktop-without-monitor-with-VNC.png", "{{ site.baseurl }}/pics/finding-ip-adress-featured-img.png", "{{ site.baseurl }}/pics/finding-ip-adress-featured-img.png"];
const carsolPlanes = [];

//use a dictionary to map element to plane
//for (let i = 0; i < carasolItems.length; i++) {
for (let i = 0; i < 4; i++) {
    carsolPlanes.push(createAPlane(carasolImages[i]));
    setCarasol(carsolPlanes[i], carasolItems[i]);
};


function setCarasol(object, element) {
    scene.add(object);
    object.material.opacity = 1;
    let elRect = element.getBoundingClientRect();
    let elStartX = ((elRect.right / window.innerWidth)) * 2 - 1;
    let elStartY = -(elRect.top / window.innerHeight) * 2 + 1;
    object.position.copy(IntoThreeD(elStartX, elStartY, camera));
}

carasolContainer.addEventListener('scroll', () => {
    for (let i = 0; i < 4; i++) {
        setCarasol(carsolPlanes[i], carasolItems[i]);
    };
});

*/
//============================================togle menu ====================================================
const menuItemsContainer = document.getElementById('menu-items-container');
const menuItems = menuItemsContainer.children;
// var clock = new THREE.Clock();
var targetQuaternion = new THREE.Quaternion();
var cubeRotating = false;

//create shape
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('pics/connecting-a-LED-to-GPIO-pin.png') }), //right side
    new THREE.MeshLambertMaterial({ map: loader.load('pics/connecting-a-LED-to-GPIO-pin.png') }), //left side
    new THREE.MeshLambertMaterial({ map: loader.load('pics/connecting-a-LED-to-GPIO-pin.png') }), //top side
    new THREE.MeshLambertMaterial({ map: loader.load('pics/connecting-a-LED-to-GPIO-pin.png') }), //bottom side
    new THREE.MeshLambertMaterial({ map: loader.load('pics/connecting-a-LED-to-GPIO-pin.png') }), //front side
    new THREE.MeshLambertMaterial({ map: loader.load('pics/connecting-a-LED-to-GPIO-pin.png') }), //back side
];

//create material, color, or image texture
const cube = new THREE.Mesh(geometry, cubeMaterials);
cube.position.set(3, 0, 0);
cube.rotation.y = -0.4;


export function openMenu() {
    scene.add(cube);
    container.style.zIndex = 100;
}

export function closeMenu() {
    scene.remove(cube);
    container.style.zIndex = -1;
}

// var speed = Math.PI * 0.5;
// var delta = clock.getDelta();
var step = Math.PI * 0.01

for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('mouseenter', ()=>{
        targetQuaternion.setFromEuler( new THREE.Euler( Math.PI * 0.5 * i, Math.PI * (i+1), 0 ) );
        // if ( ! cube.quaternion.equals( targetQuaternion ) ) {

        //     var step = speed * delta;
        //     cube.quaternion.rotateTowards( targetQuaternion, step );
        
        // }
        startCubeRotation();
    });

    menuItems[i].addEventListener('mouseleave', ()=>{
        targetQuaternion.setFromEuler( new THREE.Euler( 0, 0, 0 ) );
        startCubeRotation();
    });
};

function startCubeRotation() {
    if (cubeRotating) return;
    cubeRotating = true;
    rotateCube();
}

function rotateCube() {
    if ( cube.quaternion.equals( targetQuaternion ) ) {
        cubeRotating = false;
        return;
    };
    // delta = clock.getDelta();
    // var step = speed * delta;
    cube.quaternion.rotateTowards( targetQuaternion, step );
    requestAnimationFrame(rotateCube);
}

//=========================hover animation variables======================================================================
var mouse = { x: 0, y: 0 };
var planePos = { x: 0, y: 0, z: 0 };
var hoverPlanes = [];
var lastScrollPos = 0;
var ticking = false;
var hovering = false;
const zRotation = -0.3; //radians of mesh rotation
const hoverImages = ["https://images.unsplash.com/photo-1695512294611-80be329e683b?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTY3NjQ4NjN8&ixlib=rb-4.0.3&q=85", "{{ site.baseurl }}/pics/featured-image-for-desktop-without-monitor-with-VNC.png", "{{ site.baseurl }}/pics/finding-ip-adress-featured-img.png", "{{ site.baseurl }}/pics/finding-ip-adress-featured-img.png"];
const hoverElements = document.getElementsByClassName("insight-items");


function createAPlane(imag) {
    const geometry = new THREE.PlaneGeometry(1.5, 2); //use the aspect ratio of the images
    const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: loader.load(imag),
        opacity: 0,
        transparent: true
    });
    const object = new THREE.Mesh(geometry, material);
    return object;
}


//=================================================hover event listeners================================================
window.addEventListener("mousemove", (event) => {
    planePos = onMouseMove(event);
    lastScrollPos = window.scrollY;
});

window.addEventListener("scroll", (event) => {
    if (!ticking) {
        // event throtteling
        window.requestAnimationFrame(function () {
            planePos = IntoThreeD(mouse.x, mouse.y + (window.scrollY - lastScrollPos) / window.innerHeight * 2, camera);
            [...hoverPlanes].forEach((plane) => {
                plane.position.lerp(planePos, 0.3);
            });
            ticking = false;
        });
        ticking = true;
    }
});


for (let i = 0; i < hoverElements.length; i++) {
    hoverPlanes.push(createAPlane(hoverImages[i]));
    hoverPlanes[i].rotation.z = zRotation;
    hoverElements[i].addEventListener("mouseenter", () => {
        atHoverStart(hoverPlanes[i], hoverElements[i]);
        hoverPlanes[i].material.opacity = 1;
        lastScrollPos = window.scrollY;
    });

    hoverElements[i].addEventListener("mouseleave", () => {
        atHoverEnd(hoverPlanes[i].material, hoverPlanes[i]);
    });
    //});
}


//================================================hover functions========================================
// Follows the mouse event
function onMouseMove(event) {
    // Update the mouse variable
    event.preventDefault();

    mouse.x = ((event.clientX + 80) / window.innerWidth) * 2 - 1;

    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var pos = IntoThreeD(mouse.x, mouse.y, camera);
    //plane.position.copy(pos);

    return pos;

    // Make the sphere follow the mouse
    //	mouseMesh.position.set(event.clientX, event.clientY, 0);
}

function IntoThreeD(x, y, camera) {
    // Make the object follow the mouse
    var vector = new THREE.Vector3(x, y, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = -camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return pos;
}

function hoverAnimate() {
    if (!hovering) {
        return
    } else {
        requestAnimationFrame(hoverAnimate);
        //plane.position.lerp(planePos, 0.02);
        [...hoverPlanes].forEach((plane) => {
            plane.position.lerp(planePos, 0.02);
            plane.rotation.z = zRotation + (planePos.x + planePos.y - plane.position.y - plane.position.x) * 0.06;
        });
    }
}

function runAnimate() {
    if (hovering) {
        return;
    }
    hovering = true;
    hoverAnimate();
}


var hoverEndRAFId = [];

function atHoverEnd(material, object) {
    if (material.opacity > 0) {
        hoverEndRAFId[hoverPlanes.indexOf(object)] = requestAnimationFrame(() => {
            atHoverEnd(material, object);
        });
        material.opacity = material.opacity - 0.04;
    } else {
        scene.remove(object);
        //to stop the rendering
        let hasMesh = false;
        scene.traverse(function (object) {
            if (object.isMesh && hoverPlanes.indexOf(object) !== -1) hasMesh = true;
        });
        if (!hasMesh) hovering = false;
    }
}

function atHoverStart(object, element) {
    if (object.parent != scene) {
        runAnimate();
        scene.add(object);
        let elRect = element.getBoundingClientRect();
        let elStartX = ((elRect.right - 50) / window.innerWidth) * 2 - 1;
        let elStartY = -((elRect.top + 50) / window.innerHeight) * 2 + 1;
        object.position.copy(IntoThreeD(elStartX, elStartY, camera));
    } else {
        cancelAnimationFrame(hoverEndRAFId[hoverPlanes.indexOf(object)]);
    }
}
//==============hover functions end=======================================================


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();