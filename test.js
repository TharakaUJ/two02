import * as THREE from 'three';


//1. Call for Threejs librairies
let camera, scene, renderer
//2. Create an array to store stars
let stars = []
//3 Asd a filter
let planeMesh
//4.Spped of the stars
let speed = 0.09

/*const mouse = {
//  x: innerWidth / 2,
//  y: innerHeight / 2
}*/
//const text = document.querySelector('.text')
const title = document.querySelector('.title')
const main = document.getElementById('main')

title.style.top = innerHeight / 2 - 50 + 'px'
title.style.left = innerWidth / 2 - 200 + 'px'

//Lauch the light speed
let activated = false

//render animation or not
let isAnimation = true

function launchToLightSpeed() {
  activated = true
  title.classList.remove('apparition')
  title.classList.add('disparition')
 /*
  text.classList.remove('apparition')
  text.classList.add('disparition')
*/
}

function exitLightSpeed() {
  activated = false;
  title.classList.remove('disparition')
  title.classList.add('apparition')
  /*
  text.classList.remove('disparition')
  text.classList.add('apparition')
  */
}


window.addEventListener("mousedown", (event) => {
  /*activated = true
  title.classList.remove('apparition')
  title.classList.add('disparition')
  text.classList.remove('apparition')
  text.classList.add('disparition')*/
  launchToLightSpeed();
})


window.addEventListener("mouseup", (event) => {
  /*activated = false;
  title.classList.remove('disparition')
  title.classList.add('apparition')
  text.classList.remove('disparition')
  text.classList.add('apparition')*/
  exitLightSpeed();
})


const colors = ["#0952BD", "#A5BFF0", "#118CD6", "#1AAEE8", "#ffffff"]

/*
//Mouse Moves Listener
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})
*/

addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  title.style.top = innerHeight / 2 - 50 + 'px'
  title.style.left = innerWidth / 2 - 200 + 'px'
})
/*
//Animated Circle Text Effects
text.innerHTML = text.textContent.replace(/\S/g,"<span>$&</span>")
const element = document.querySelectorAll('span')
for (let i = 0; i<element.length; i++) {
  element[i].style.transform = "rotate("+i*28+"deg)"
}
document.addEventListener('mousemove', (event) => {
  text.style.left = event.pageX + 'px'
  text.style.top = event.pageY + 'px'
})
*/

/*---------------------
    Implementation
---------------------*/
function init() {
  //Set up the scene
  scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 0.015, 72)
  //Set up the camera 
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, alpha: true })
  renderer.sortObjects = false
  renderer.autoClearColor = false

  //Camera initialization
  camera.position.z = 55

  //Add the background
  renderer.setClearColor("#000", 1);
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  //Add the scene
  document.body.appendChild(renderer.domElement)

  //Create stars in random locations within a cube
  //Store the stars in an array to be moved within render
  for (let i =0; i < 3000; i++) {
    let geometry = new THREE.SphereGeometry(0.12 * Math.random(), 10, 10)
   // let geometry = new THREE.SphereBufferGeometry(0.12 * Math.random(), 10, 10)
    let material = new THREE.MeshBasicMaterial({
      color: colors[Math.floor(Math.random() * colors.length)],
      envMap: null,
      combine: THREE.AddOperation,
      //shading: THREE.FlatShading 
     }) 
    let star = new THREE.Mesh(geometry, material)

    star.position.x = Math.random() * 100 - 50;
    star.position.y = Math.random() * 100 - 50;
    star.position.z = Math.random() * 50 - 25;   
    star.shadowBlur = 20;
    star.shadowColor = "rgba(255,0,0,1)";

    scene.add(star)
    stars.push(star)
  }

  let planeGeometry = new THREE.PlaneGeometry(1000, 500, 1,1)
  let planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1 })

  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  scene.add(planeMesh)
}

/*-------------------------
       Render
--------------------------*/
function render() {
  if (isAnimation) {
  //Animation loop
  requestAnimationFrame(render)
  }
  //Add the scene cube plus the camera
  renderer.render(scene, camera)
  
  //Move stars within a cube and 
  //reinitilize the position when the stars go out of the cube
  for (let i = 0; i < stars.length; i++) {
    stars[i].position.z += speed

    if (stars[i].position.z >= 60) {
    stars[i].position.x = Math.random() * 100 - 50
    stars[i].position.y = Math.random() * 100 - 50
    stars[i].position.z = 5
    }
  }
  //When the mouse is pressed, light effect is activated
  if (activated) {
    speed = 0.27
    planeMesh.material.opacity = 0.01
  } else {
    if (planeMesh.material.opacity < 1) {
      planeMesh.material.opacity += 0.01
      speed = 0.09
    }
  }
}

init()
render()

function endAnimation() {
    exitLightSpeed();
    isAnimation = false;
    document.body.removeChild(renderer.domElement);
    document.body.removeChild(title);
    main.classList.remove('disaparition');
    main.classList.add('apparition')

};

setTimeout( function(){
    launchToLightSpeed();
}, 5000);

setTimeout(function() {
    endAnimation();
    exitLightSpeed();
}, 9000);


