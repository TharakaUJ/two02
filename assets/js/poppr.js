const root = document.querySelector(':root');
const scrollBar = document.getElementById('scroll-bar');
const gap = window.innerWidth * 0.08 //css grid gap in gallery-container
var initialFact = 0; //horizontal scroll when vertical scroll
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

            //horizontal scroll when vertical scroll
            let fact = window.scrollY / document.body.scrollHeight;
            if (fact <= 0.6) {
                if (initialFact < fact) {
                    scrollContainer.scrollLeft = scrollContainer.scrollLeft + fact * 10;
                } else {
                    scrollContainer.scrollLeft = scrollContainer.scrollLeft - fact * 10;
                }

                initialFact = fact
            }
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


scrollContainer.addEventListener("scroll", function () {
    if (!tocking) {
        // event throtteling
        window.requestAnimationFrame(function () {
            parallax();
            atScrollEnd();
            tocking = false;
        });
        tocking = true;
    }
});


function parallax() {
    let galleryItems = document.getElementsByClassName('gallery-item');
    [...galleryItems].forEach((element) => {
        const divRect = element.getBoundingClientRect();
        if (divRect.left >= 0 && divRect.left <= window.innerWidth || divRect.right >= 0 && divRect.right <= window.innerWidth) {
            element.scrollLeft = divRect.left * 0.06 + 20;
            element.style.transform = `rotateZ(${divRect.left * 20 / window.innerWidth - 12}deg) rotateY(${divRect.left * 20 / window.innerWidth - 12}deg)`;
            element.style.scale = `${1.2 - Math.abs(divRect.left / window.innerWidth - 0.35)}`;
            element.parentNode.style.transform = `rotateY(${divRect.left * 20 / window.innerWidth - 12}deg)`;
        }
    });
}


function atScrollEnd() {
    if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 100) {
        let children = scrollContainer.children;
        scrollContainer.appendChild(children[0]);
        scrollContainer.appendChild(children[1]);
        scrollContainer.scrollLeft = scrollContainer.scrollLeft - 2 * children[0].offsetWidth - gap;
    }

    if (scrollContainer.scrollLeft === 0) {
        let children = scrollContainer.children;
        scrollContainer.prepend(children[children.length - 1]);
        scrollContainer.prepend(children[children.length - 2]);
        scrollContainer.scrollLeft = scrollContainer.scrollLeft + 2 * children[0].offsetWidth;
    }
}



// only on hover devices

const isMobile = /Mobi/.test(navigator.userAgent) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
const isTouchOnlyDevice = isMobile && window.innerWidth <= 768; // Adjust the screen width as needed

if (isTouchOnlyDevice) {
    // This is likely a touch-only device, such as a mobile phone
    addScript('/two02/assets/js/mobile-non-hover.js');

} else {
    // This is not a touch-only device, like a desktop with touch support
    addScript('/two02/assets/js/dekstop-hover.js', "module");
    addScript('/two02/assets/js/threejs-poppr.js', "module");
}


function addScript(scriptSource, scriptType="text/javascript") {
    var script = document.createElement('script');
    script.src = scriptSource;
    script.type = scriptType
    document.body.appendChild(script);
}