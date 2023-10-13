---
---

import * as THREE from "https://esm.sh/three";

//common constants
const renderer = new THREE.WebGLRenderer({
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new THREE.TextureLoader();



//================common constants end =========================================================
const carasolContainer = document.getElementById('gallery-container');
const carasolItems = carasolContainer.children;
const carasolImages = ["https://images.unsplash.com/photo-1695512294611-80be329e683b?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTY3NjQ4NjN8&ixlib=rb-4.0.3&q=85", "{{ site.baseurl }}/pics/featured-image-for-desktop-without-monitor-with-VNC.png", "{{ site.baseurl }}/pics/finding-ip-adress-featured-img.png", "{{ site.baseurl }}/pics/finding-ip-adress-featured-img.png"];
const carsolPlanes = [];

const carasolScene = new THREE.Scene();
const carasolCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

carasolCamera.position.z = 5;
carasolScene.add(carasolCamera);

const carasolDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
carasolDirectionalLight.position.set(0, 0, 60);
carasolScene.add(carasolDirectionalLight);


//use a dictionary to map element to plane
//for (let i = 0; i < carasolItems.length; i++) {
for (let i = 0; i < 4; i++) {
    carsolPlanes.push(createAPlane(carasolImages[i]));
    setCarasol(carsolPlanes[i], carasolItems[i]);
};


function setCarasol(object, element) {
        carasolScene.add(object);
        let elRect = element.getBoundingClientRect();
        let elStartX = ((elRect.right + 50) / window.innerWidth) * 2 - 1;
        let elStartY = -((elRect.top - 500) / window.innerHeight) * 2 + 1;
        object.position.copy(IntoThreeD(elStartX, elStartY, carasolCamera));
}



function carasolAnimate() {
    requestAnimationFrame(carasolAnimate);
    renderer.render(carasolScene, carasolCamera);
}

carasolAnimate();







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
const container = document.getElementById("insights");
container.appendChild(renderer.domElement);

const hoverScene = new THREE.Scene();
const hoverCamera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

hoverCamera.position.z = 5;



const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 60);
hoverScene.add(directionalLight);

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
        window.requestAnimationFrame(function() {
        planePos = IntoThreeD(mouse.x, mouse.y + (window.scrollY - lastScrollPos)/window.innerHeight * 2, hoverCamera);
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

    var pos = IntoThreeD(mouse.x, mouse.y, hoverCamera);
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
        renderer.render(hoverScene, hoverCamera);
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
        hoverScene.remove(object);
        //to stop the rendering
        let hasMesh = false;
        hoverScene.traverse(function (object) {
            if (object.isMesh) hasMesh = true;
          });
        if (!hasMesh) hovering = false;
    }
}

function atHoverStart(object, element) {
    if (object.parent != hoverScene) {
        runAnimate();
        hoverScene.add(object);
        let elRect = element.getBoundingClientRect();
        let elStartX = ((elRect.right - 50) / window.innerWidth) * 2 - 1;
        let elStartY = -((elRect.top + 50) / window.innerHeight) * 2 + 1;
        object.position.copy(IntoThreeD(elStartX, elStartY, hoverCamera));
    } else {
        cancelAnimationFrame(hoverEndRAFId[hoverPlanes.indexOf(object)]);
    }
}
//==============hover functions end=======================================================

