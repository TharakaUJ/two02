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

const carasolImages = ["assets/images/answr-dev-homepage.png", "assets/images/geoscraper-homepage.png", "assets/images/expelbg-homepage.png", "assets/images/midj-homepage.png"];
var scrollPercent
updateScrollPercent();
var camRotateX = Math.PI * 0.5 * (1 - scrollPercent)
camera.rotation.x = Math.PI * 0.5 * (1 - scrollPercent);


//object that all the Carasol planes added
var carasolPivot = new THREE.Object3D();
carasolPivot.position.set(0, 0, 5);
carasolPivot.rotation.set(Math.PI * 0.2, 0, 0);
scene.add(carasolPivot);


function carasolInit() {
    let axis = new THREE.Vector3(0, 1, 0);
    let axisPosition = new THREE.Vector3(0, 0, 5);
    let deltaAngle = 2 * Math.PI / carasolImages.length;

    for (let i = 0; i < carasolImages.length; i++) {
        let object = createACurvedPlane(carasolImages[i]);
        object.name = i;
        scene.add(object);
        
        let vTemp = new THREE.Vector3(0, 0, 0).sub(axisPosition);
        vTemp.applyAxisAngle(axis, -deltaAngle * i);
        object.position.copy(vTemp);
        object.rotation.y = -deltaAngle * i;
        carasolPivot.add(object);
    };
}


function createACurvedPlane(imag) {
    const geometry = new THREE.PlaneGeometry(16 / 4, 9 / 4, 16, 16);
    const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: loader.load(imag),
        opacity: 1,
        transparent: true,
        // side: THREE.DoubleSide
    });
    const object = new THREE.Mesh(geometry, material);
    return object;
}

function planeCurve(g, z) {

    let p = g.parameters;
    let hw = p.width * 0.5;

    let a = new THREE.Vector2(-hw, 0);
    let b = new THREE.Vector2(0, z);
    let c = new THREE.Vector2(hw, 0);

    let ab = new THREE.Vector2().subVectors(a, b);
    let bc = new THREE.Vector2().subVectors(b, c);
    let ac = new THREE.Vector2().subVectors(a, c);

    let r = (ab.length() * bc.length() * ac.length()) / (2 * Math.abs(ab.cross(ac)));
    // let t = (ab.length() * ab.length()) / (2*z)
    // console.log(r-t)

    let center = new THREE.Vector2(0, z - r);
    let baseV = new THREE.Vector2().subVectors(a, center);
    let baseAngle = baseV.angle() - (Math.PI * 0.5);
    let arc = baseAngle * 2;

    let uv = g.attributes.uv;
    let pos = g.attributes.position;
    let mainV = new THREE.Vector2();
    for (let i = 0; i < uv.count; i++) {
        let uvRatio = 1 - uv.getX(i);
        let y = pos.getY(i);
        mainV.copy(c).rotateAround(center, (arc * uvRatio));
        pos.setXYZ(i, mainV.x, y, -mainV.y);
    }

    pos.needsUpdate = true;
}


document.body.onscroll = () => {
    updateScrollPercent()    
    // carasolPivot.rotation.y = 2 * Math.PI * scrollPercent;
    // carasolPivot.rotation.x = 0.2 * Math.PI * (1 + 0.5 * scrollPercent);
    // carasolPivot.position.y = 10 * scrollPercent -5;
    camRotateX = Math.PI * 0.5 * (1 - scrollPercent);
    siteLogoAnime();
}

function updateScrollPercent() {
    //calculate the current scroll progress as a percentage
    scrollPercent =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
            document.documentElement.clientHeight))
}


//carasol drag____________________________________________________________________________________
const scrollContainer = document.getElementsByClassName('section')[1];
let isDragging = false;
let startX;
let horizontalNudge = 0;
let previousHNudge = 0;

scrollContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX;
    // horizontalNudge = scrollContainer.horizontalNudge;
    scrollContainer.style.cursor = "grabbing"; // Change cursor when dragging
});

scrollContainer.addEventListener("mouseup", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab"; // Change cursor back to "grab"
    previousHNudge = horizontalNudge;
});

scrollContainer.addEventListener("mouseleave", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab"; // Change cursor back to "grab"
    previousHNudge = horizontalNudge;
});

scrollContainer.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    // e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) * 1; // Adjust the multiplier for faster/slower scrolling
    // scrollContainer.scrollLeft = horizontalNudge - walk;
    horizontalNudge = previousHNudge + walk;
});
//______________________________________________________________________________________________

carasolInit();
updateScrollPercent();
//_________________________________________carasol hover _____________________________________________
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const hoverTexts = document.getElementById('hover-text-container').children;
var previousIntersects = [];


function carasolHover(event) {
        // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( carasolPivot.children );

    if (intersects === previousIntersects) return;
    previousIntersects = intersects;
    if (intersects.length === 0) {
        // document.querySelector('.hovering')?.classList.remove('hovering');
        // hoverTexts[0].classList.add('hovering');
        return
    };
    let hoveringObj = intersects[0];
    let i = hoveringObj.object.name;
    document.querySelector('.hovering')?.classList.remove('hovering');
    hoverTexts[i+1].classList.add('hovering');
}


//============================================toggle menu ====================================================
const menuItemsContainer = document.getElementById('menu-items-container');
const menuItems = menuItemsContainer.children;
// var clock = new THREE.Clock();
var targetQuaternion = new THREE.Quaternion();
var cubeRotating = false;

function cubeInit() {
    //create shape
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    let cubeMaterials = [
        new THREE.MeshLambertMaterial({ map: loader.load('assets/images/answr-dev-homepage.png') }), //right side
    new THREE.MeshLambertMaterial({ map: loader.load('assets/images/answr-dev-homepage.png') }), //left side
    new THREE.MeshLambertMaterial({ map: loader.load('assets/images/geoscraper-homepage.png') }), //top side
    new THREE.MeshLambertMaterial({ map: loader.load('assets/images/geoscraper-homepage.png') }), //bottom side
    new THREE.MeshLambertMaterial({ map: loader.load('assets/images/midj-homepage.png') }), //front side
    new THREE.MeshLambertMaterial({ map: loader.load('assets/images/midj-homepage.png') }), //back side
    ];

    //create material, color, or image texture
    let object = new THREE.Mesh(geometry, cubeMaterials);
    return object
}

const cube = cubeInit();
cube.position.set(3, 0, -20);


export function openMenu() {
    scene.add(cube);
    container.style.zIndex = 100;
    camera.position.z = -15;
    camRotateX = 0;
}

export function closeMenu() {
    scene.remove(cube);
    container.style.zIndex = -1;
    camera.position.z =5;
    camRotateX = Math.PI * 0.5 * (1 - scrollPercent);
}

// var speed = Math.PI * 0.5;
// var delta = clock.getDelta();
var step = Math.PI * 0.01

for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('mouseenter', () => {
        targetQuaternion.setFromEuler(new THREE.Euler(Math.PI * 0.5 * i, Math.PI * (i + 1), 0));
        // if ( ! cube.quaternion.equals( targetQuaternion ) ) {

        //     var step = speed * delta;
        //     cube.quaternion.rotateTowards( targetQuaternion, step );

        // }
        startCubeRotation();
    });

    menuItems[i].addEventListener('mouseleave', () => {
        targetQuaternion.setFromEuler(new THREE.Euler(0, 0, 0));
        startCubeRotation();
    });
};

function startCubeRotation() {
    if (cubeRotating) return;
    cubeRotating = true;
    rotateCube();
}

function rotateCube() {
    if (cube.quaternion.equals(targetQuaternion)) {
        cubeRotating = false;
        return;
    };
    // delta = clock.getDelta();
    // var step = speed * delta;
    cube.quaternion.rotateTowards(targetQuaternion, step);
    requestAnimationFrame(rotateCube);
}

//=========================hover animation variables======================================================================
// var mouse = { x: 0, y: 0 };
var planePos = { x: 0, y: 0, z: 0 };
var hoverPlanes = [];
var lastScrollPos = 0;
var ticking = false;
var hovering = false;
const zRotation = -0.3; //radians of mesh rotation
const hoverImages = ["assets/images/answr-dev-homepage.png", "assets/images/geoscraper-homepage.png", "assets/images/expelbg-homepage.png", "assets/images/midj-homepage.png"];
const hoverElements = document.getElementsByClassName("insight-items");


function createAPlane(imag) {
    const geometry = new THREE.PlaneGeometry(1.5, 1); //use the aspect ratio of the images
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

//part of carasol ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    carasolHover(event);
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
    carasolPivot.rotation.y = lerpRotation((1 * Math.PI * (scrollPercent - (horizontalNudge/window.innerWidth))), carasolPivot.rotation.y);
    carasolPivot.rotation.x = lerpRotation((0.2 * Math.PI * (1 + 0.5 * scrollPercent)), carasolPivot.rotation.x, 0.5);
    camera.rotation.x = lerpRotation(camRotateX, camera.rotation.x);
}

animate();


function lerpRotation(finalValue, initialValue, step=0.2) {
    return (finalValue - initialValue) * step + initialValue;
}


//==========================================logo shrink ====================================
const siteLogo = document.getElementById('site-logo');

function siteLogoAnime() {
    if (scrollPercent > 0.1) {
        siteLogo.animate({
            width: '4.5vw',
        }, { duration: 1000, fill: 'forwards' });
    } else {
        siteLogo.animate({
            width: '20vw',
        }, { duration: 1000, fill: 'forwards' });
    }
}

siteLogoAnime();