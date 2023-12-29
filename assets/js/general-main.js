const root = document.querySelector(':root');
const scrollBar = document.getElementById('scroll-bar');
var ticking = false; // for throttling scroll events
var tocking = false; // for throttling scroll events


root.style.setProperty('--scroll-bar-height', `${window.innerHeight * (window.innerHeight / document.body.scrollHeight)}px`);

window.addEventListener('scroll', () => {
    if (!ticking) {
        // event throtteling
        window.requestAnimationFrame(function () {
            root.style.setProperty('--scroll-postion', `${window.innerHeight * window.scrollY / document.body.scrollHeight}px`);
            scrollBar.animate({
                opacity: '1'
            }, { fill: "forwards", duration: 800 });

            ticking = false;
        });
        ticking = true;
    }
});

window.addEventListener('scrollend', () => {
    scrollBar.animate({
        opacity: '0'
    }, { fill: "forwards", duration: 400, delay: 400 })
});



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
        // openMenu();
    } else {
        menu.animate({
            top: '100%',
            //borderTopLeftRadius: ['50%', '0'],
            //borderTopRightRadius: ['50%', '0']
        }, { duration: 300, fill: 'forwards' });
        menuToggled = false;
        toggleMenu.children[1].classList.add('hide');
        toggleMenu.children[0].classList.remove('hide');
        // closeMenu();
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


function randomGlow() {
    const blob = document.getElementById("blob");
    blob.style.top = `${Math.random() * 100}%`;
    blob.style.left = `${Math.random() * 100}%`;
}

randomGlow();