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
    } else {
        menu.animate({
            top: '100%',
        }, { duration: 300, fill: 'forwards' });
        menuItemsAnimeClose();
        menuToggled = false;
        toggleMenu.children[1].classList.add('hide');
        toggleMenu.children[0].classList.remove('hide');
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