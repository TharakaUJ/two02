import { openMenu, closeMenu } from "./three-desktop.js";

/* -- Glow effect -- */

const blob = document.getElementById("blob");

window.onpointermove = event => {
    const { clientX, clientY } = event;

    blob.animate({
        left: `${clientX}px`,
        top: `${clientY}px`
    }, { duration: 3000, fill: "forwards" });
}

/* --- turning effect on typogram --*/
const turner = document.getElementById("video-container");
turner.parentNode.onpointermove = event => {
    const { clientX, clientY } = event;

    turner.animate({
        transform: `rotateX(${15 - 30 * clientY / window.innerHeight}deg) rotateY(${30 * clientX / window.innerWidth - 15}deg)`,
    }, { duration: 10000, fill: "forwards" });
}

//menu
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
        openMenu();
        document.body.style.overflow = 'hidden';
    } else {
        menu.animate({
            top: '100%',
            //borderTopLeftRadius: ['50%', '0'],
            //borderTopRightRadius: ['50%', '0']
        }, { duration: 300, fill: 'forwards' });
        menuToggled = false;
        toggleMenu.children[1].classList.add('hide');
        toggleMenu.children[0].classList.remove('hide');
        closeMenu();
        document.body.style.overflow ='auto';
    }
});


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
