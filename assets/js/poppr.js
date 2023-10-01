const root = document.querySelector(':root');
const scrollBar = document.getElementById('scroll-bar');

root.style.setProperty('--scroll-bar-height', `${window.innerHeight * (window.innerHeight / document.body.scrollHeight)}px`);

window.addEventListener('scroll', () => {
    root.style.setProperty('--scroll-postion', `${window.innerHeight * window.scrollY / document.body.scrollHeight}px`);
    scrollBar.animate({
        opacity: '1'
    }, { fill: "forwards", duration: 800 })
});

window.addEventListener('scrollend', () => {
    scrollBar.animate({
        opacity: '0'
    }, { fill: "forwards", duration: 400, delay: 400 })
});

const toggleMenu = document.getElementById('toggle-menu');
const menu = document.getElementById('menu');
var menuToggled = false

toggleMenu.addEventListener('click', () => {
    if (!menuToggled) {
        menu.animate({
            top: ['-100%', '0'],
            borderRadius: ['100%', '0']
        }, { duration: 300, fill: 'forwards' });
        menuItemsAnimeOpen();
        menuToggled = true;
        toggleMenu.children[0].classList.add('hide');
        toggleMenu.children[1].classList.remove('hide');
    } else {
        menu.animate({
            top: '100%',
            //borderTopLeftRadius: ['50%', '0'],
            //borderTopRightRadius: ['50%', '0']
        }, { duration: 300, fill: 'forwards' });
        menuItemsAnimeClose();
        menuToggled = false;
        toggleMenu.children[1].classList.add('hide');
        toggleMenu.children[0].classList.remove('hide');
    }
});

const scrollContainer = document.getElementById("gallery-container");
let isDragging = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    scrollContainer.style.cursor = "grabbing"; // Change cursor when dragging
});

scrollContainer.addEventListener("mouseup", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab"; // Change cursor back to "grab"
});

scrollContainer.addEventListener("mouseleave", () => {
    isDragging = false;
    scrollContainer.style.cursor = "grab"; // Change cursor back to "grab"
});

scrollContainer.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the multiplier for faster/slower scrolling
    scrollContainer.scrollLeft = scrollLeft - walk;
    if (scrollContainer.scrollLeft === 0 | scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 100) {
        isDragging = false;
        scrollContainer.style.cursor = "grab";
    }
});




//horizontal scroll when vertical scroll
var initialFact = 0;
window.addEventListener('scroll', () => {
    let fact = window.scrollY / document.body.scrollHeight;
    if (fact <= 0.6) {
        if (initialFact < fact) {
            scrollContainer.scrollLeft = scrollContainer.scrollLeft + fact * 10;
        } else {
            scrollContainer.scrollLeft = scrollContainer.scrollLeft - fact * 10;
        }

        initialFact = fact
    }
});



/* -- Glow effect -- And turning effect */

const blob = document.getElementById("blob");
const turner = document.getElementById("video-container");

window.onpointermove = event => {
    const { clientX, clientY } = event;

    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" });

    turner.animate({
        transform: `rotateX(${30 * clientY * 0.001}deg) rotateY(${30 * clientX * 0.001}deg)`,
    }, { duration: 5000, fill: "forwards" });
}





scrollContainer.addEventListener("scroll", function () {
    parallax();

    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 100) {
        let children = scrollContainer.children;
        scrollContainer.appendChild(children[0]);
        scrollContainer.appendChild(children[1]);
        scrollContainer.scrollLeft = scrollContainer.scrollLeft - 2 * children[0].offsetWidth - 40;
    }

    if (scrollContainer.scrollLeft === 0) {
        let children = scrollContainer.children;
        scrollContainer.prepend(children[children.length - 1]);
        scrollContainer.prepend(children[children.length - 2]);
        scrollContainer.scrollLeft = scrollContainer.scrollLeft + 2 * children[0].offsetWidth;
    }
});


function parallax() {
    let galleryItems = scrollContainer.children;
    [...galleryItems].forEach((element) => {
        const divRect = element.getBoundingClientRect();
        element.scrollLeft = divRect.left * 0.06 + 20;
        element.style.transform = `rotateZ(${divRect.left *20 / window.innerWidth - 12}deg)`;
        element.style.scale = `${1.2 - Math.abs(divRect.left/window.innerWidth - 0.35)}`;
    });
}

const menuItemscontainer = document.getElementById('menu-items-container');

function menuItemsAnimeOpen() {
    let menuItems = menuItemscontainer.children;
    [...menuItems].forEach((menuItem) => {
        let i = 0;
        [...menuItem.children].forEach((letter) => {
            letter.animate({
                opacity: ['0', '1']
            }, { duration: 1000, fill: 'forwards', delay: 300 + i * 100 });
            i = i + 1;
        })
    });
}

function menuItemsAnimeClose() {
    let menuItems = menuItemscontainer.children;
    [...menuItems].forEach((menuItem) => {
        [...menuItem.children].forEach((letter) => {
            letter.animate({
                opacity: '0'
            }, { duration: 200, fill: 'forwards'});
        })
    });
}