'use strict'

const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const fadeUp = document.querySelectorAll(".js-fadeUp");
fadeUp.forEach((el) => {
  const Observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if( entry.isIntersecting ) {
          el.classList.add("visibled");
            Observer.unobserve(el);
        } 
    });
  });
  Observer.observe(el);
});

const headings = document.querySelectorAll(".head2");
headings.forEach((heading) => {
  const headObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if( entry.isIntersecting ) {
        heading.classList.add("visibled");
        headObserver.unobserve(heading);
      } 
    });
    }, {
      rootMargin: '0% 0% -20% 0%'
    });
    headObserver.observe(heading);
});

const aboutImgs = document.querySelectorAll(".about__img");
aboutImgs.forEach((aboutImg) => {
  const aboutObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if( entry.isIntersecting ) {
            aboutImg.classList.add("visibled");
            Observer.unobserve(aboutImg);
        } 
    });
  }, {
    rootMargin: '0% 0% -20% 0%'
  });
  aboutObserver.observe(aboutImg);
});