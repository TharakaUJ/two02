---

---

const verticalGrids = document.getElementsByClassName('vertical-grid');

	const speeds = [0.1, 0.22, 0.14];
	const intervalScroll1 = setInterval(function() {
		scrollAnime(0)
	}, 10);
	const intervalScroll2 = setInterval(function() {
		scrollAnime(1)
	}, 10);
	const intervalScroll3 = setInterval(function() {
		scrollAnime(2)
	}, 10);

	for (let i = 0; i < 3; i++) {
		verticalGrids[i].addEventListener('scroll', function() {
			position[i] = verticalGrids[i]?.scrollTop;
		});
	};


	const maxScrollHeight = verticalGrids[0].scrollHeight - 400;

//scroll 2nd div to bottom so that animation can moveupwards
	var position = [0, maxScrollHeight, 0];
	var scrollDirection = [1, -1, 1];


	function scrollAnime(i) {
		position[i] = position[i] + speeds[i] * scrollDirection[i];
		verticalGrids[i].scrollTop = position[i];

		if (position[i] >  maxScrollHeight || position[i] < 0) {
			scrollDirection[i] = scrollDirection[i] * (-1);
		};

	}

	


	const menu = document.getElementById('menu-toggle');

	menu.children[0].addEventListener('click', function() {
		menu.animate({
			width: `100%`,
			height: `100%`,
			opacity: `0.8`,
			borderRadius: `0`
		}, {duration: 1000, fill: "forwards"});

		menu.children[0].classList.add('hide');
		menu.children[1].classList.remove('hide')

	});

	menu.children[1].addEventListener('click', function() {
		menu.animate({
			width: `100px`,
			height: `100px`,
			opacity: `1`,
			borderBottomLeftRadius: `100%`
		}, {duration: 1000, fill: "forwards"});

		menu.children[0].classList.remove('hide');
		menu.children[1].classList.add('hide')
	});


		const section2 = document.getElementById('section2');

		const main = document.getElementById('main-wrapper');



		const timeline = new ScrollTimeline({
			source: document.documentElement,
			axis: "block",
	});
		

	window.addEventListener('scroll', () => {
		scrollIfs();
	});

var sectionAnimHaventDone = true;

	function scrollIfs() {

		let decimal = window.scrollY/window.innerHeight;
        //console.log(decimal);

        if (decimal < 0.5 && sectionAnimHaventDone) {
            vGridsAnimation(2);
            vGridsAnimation(1);
            vGridsAnimation(0);
        } else if (0.5 < decimal && sectionAnimHaventDone) {
            section2Animation();
        }
	}

    const hTwos = section2.getElementsByTagName('h2');

function vGridsAnimation(i) {
    let vGrid = verticalGrids[i];
    let dFromTOp = window.scrollY + hTwos[2-i].getBoundingClientRect().top;
    let dFromLeft = vGrid.offsetLeft;
    let decimal = window.scrollY / window.innerHeight;

	vGrid.style.width = `${(window.innerWidth-60)/3}px`;
	vGrid.style.position = 'absolute';
	vGrid.animate({
		top: `${dFromTOp * decimal}px`,
		left: [`${dFromLeft}px`, `${dFromLeft}px`],
        transform: `rotate(-${10 * (i+1) * decimal}deg)`,
	}, {duration: (3000 * decimal), fill: 'forwards'});
}


const title = document.querySelector('.title')


function section2Animation() {
	section2.animate({
        top: ['100%', '0%']
	}, {duration: 1000, fill: 'forwards'});

	title.scrollIntoView({behavior: 'smooth', block: 'start'})

		for (let i = 0; i < 3; i++) {
			verticalGrids[i].animate({
				top: '-1000px'
			}, {duration: 2000, fill: 'forwards'});

    }
	setTimeout(function() {
		clearInterval(intervalScroll1);
		clearInterval(intervalScroll2);
		clearInterval(intervalScroll3);
		main.remove();
		animate();

	}, 3000);

	sectionAnimHaventDone = false;
}






//THREE js part

import * as THREE from 'three';


const canvasContainer = document.getElementById('canvas-container')


const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: false, alpha: true })
  renderer.sortObjects = false
  renderer.autoClearColor = false

  //Camera initialization
  camera.position.z = 55

  //Add the background
  renderer.setClearColor("#000", 1);
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)

  //Add the scene
  canvasContainer.appendChild(renderer.domElement)

  let imgs = []


  addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })


  
// instantiate a loader
const loader = new THREE.TextureLoader();



{% assign image_files = site.static_files | where: "image", true %}
const picNames = [{% for image in image_files %}"{{ image.path }}",{% endfor %}]
//const picNames = ["/pics/GPIO-pinouts.jpg", "/pics/featured-image-for-desktop-without-monitor-with-VNC.png", "/pics/steel-mountain-hack-mr.-robot-e1686160421682-1080x675.png", "/pics/Screenshot-from-2023-04-26-16.33.55@2x-e1682518769168.png", "/pics/save-the-code.png", "/pics/recomended-software.png"]


for (let i =0; i < picNames.length; i++) {
    let picName = picNames[i];
    let url = "{{ site.baseurl }}" + picName;
    let planegeometry = new THREE.PlaneGeometry(10,10);
    let planematerial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        map: loader.load(url)
    });
    let img = new THREE.Mesh(planegeometry, planematerial);
    img.position.x = Math.random() * 100 - 50;
    img.position.y = Math.random() * 1000 - 50;
    img.position.z = Math.random() * 50 - 25;   
    scene.add(img);
    imgs.push(img)
  };

  function animate() {
    requestAnimationFrame( animate );
      renderer.render( scene, camera );
    

    const speed = -0.3

    for (let i = 0; i < imgs.length; i++) {
        imgs[i].position.y += speed
    
        if (imgs[i].position.y >= 60) {
        imgs[i].position.x = Math.random() * 100 - 50
        imgs[i].position.z = Math.random() * 100 - 50
        imgs[i].position.y = 5
        }
      }

    }


    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(0, 0, 60)
    scene.add( directionalLight );






/*
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


const scaleFactor = window.innerWidth / 1000;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );




const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const fontLoader = new FontLoader();
fontLoader.load('fonts/helvetiker_regular.typeface.json',function(tex){ 
    var  textGeo = new TextGeometry('two 02', {
            size: 16 * scaleFactor,
            height: 20 * scaleFactor,
            curveSegments: 16,
            font: tex,
    });
    var  color = new THREE.Color();
    color.setRGB(255, 250, 250);
    var  textMaterial = new THREE.MeshStandardMaterial({ color: color });
    var  text = new THREE.Mesh(textGeo , textMaterial);
    text.position.set(0, 0, 0)
    text.castShadow = true;
    scene.add(text);
})


const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(0, 0, 60)
    scene.add( directionalLight );

	camera.position.set(40 * scaleFactor, 20 * scaleFactor, 60 * scaleFactor)


	window.addEventListener('scroll', function() {
		let decimal = window.scrollY / window.innerHeight;

	});

	const cursor = {x: 0, y: 0}

	window.addEventListener('mousemove', (e) => {
		cursor.x = e.clientX / window.innerWidth -0.5
		cursor.y = e.clientY / window.innerHeight - 0.5


	})




function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

	const cameraX = cursor.x * 10 + 40;
	const cameraY = -cursor.y * 20 + 20;

	camera.position.x = cameraX;
	camera.position.y = cameraY
	}
animate();


camera.rotate = 30;

</script-->*/
