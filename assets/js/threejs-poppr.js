import * as THREE from "https://esm.sh/three";

var mouse = { x: 0, y: 0 };
var planePos = { x: 0, y: 0, z: 0 };

const container = document.getElementById("insights");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 0, 60);
scene.add(directionalLight);

const loader = new THREE.TextureLoader();
const imag = "https://images.unsplash.com/photo-1695512294611-80be329e683b?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTY3NjQ4NjN8&ixlib=rb-4.0.3&q=85";

function createAPlane(imag) {
  const geometry = new THREE.PlaneGeometry(1.5, 2);
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    map: loader.load(imag),
    opacity: 0,
    transparent: true
  });
  const object = new THREE.Mesh(geometry, material);
  return object;
}

const plane = createAPlane(imag);

container.addEventListener("mousemove", (event) => {
  planePos = onMouseMove(event);
});

const hoverElements = document.getElementsByClassName("insight-items");

[...hoverElements].forEach((hoverElement) => {
  hoverElement.addEventListener("mouseenter", () => {
    atHoverStart(plane, hoverElement);
    plane.material.opacity = 1;
  });

  hoverElement.addEventListener("mouseleave", () => {
    atHoverEnd(plane.material, plane);
  });
});

// Follows the mouse event
function onMouseMove(event) {
  // Update the mouse variable
  event.preventDefault();

  //dafault * 2 -1
  mouse.x = (event.clientX / window.innerWidth) * 1.8 - 0.8;

  //default *2 + 1
  mouse.y = -(event.clientY / window.innerHeight) * 1.8 + 1;

  var pos = IntoThreeD(mouse.x, mouse.y);
  //plane.position.copy(pos);

  return pos;

  // Make the sphere follow the mouse
  //	mouseMesh.position.set(event.clientX, event.clientY, 0);
}

function IntoThreeD(x, y) {
  // Make the object follow the mouse
  var vector = new THREE.Vector3(x, y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  return pos;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  plane.position.lerp(planePos, 0.02);
}
animate();

var hoverEndRAFId;

function atHoverEnd(material, object) {
  if (material.opacity > 0) {
    hoverEndRAFId = requestAnimationFrame(() => {
      atHoverEnd(material, object);
    });
    material.opacity = material.opacity - 0.025;
    console.log(material.opacity);
  } else {
    scene.remove(object);
  }
}

function atHoverStart(object, element) {
  if (object.parent != scene) {
    scene.add(object);
    let elRect = element.getBoundingClientRect();
    let elStartX = (elRect.right / window.innerWidth) * 2 - 1;
    let elStartY = -(elRect.top / window.innerWidth) * 2 + 1;
    plane.position.copy(IntoThreeD(elStartX, elStartY));
  } else {
    cancelAnimationFrame(hoverEndRAFId);
  }
}
