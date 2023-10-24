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

