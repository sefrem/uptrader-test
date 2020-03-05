const animatedStrategy = document.querySelectorAll(".hero__strategy");
const anchor = document.querySelectorAll(".hero__strategy-link");
const main = document.querySelector('.main')
const hero = document.querySelector('.hero')

// ScrollReveal().reveal(".main", {
//   duraion: 0,
//   delay: 500,
//   // distance: "1000px",
//   // opacity: 0
// });


anchor.forEach(anchor => anchor.addEventListener("click", function(e) {
  e.preventDefault;
 
  // -> removing the class
  animatedStrategy.forEach(item =>
    item.classList.remove("hero__strategy-info_animated")
  );
  
  
  // -> triggering reflow /* The actual magic */
  // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
  // Oops! This won't work in strict mode. Thanks Felis Phasma!
  // element.offsetWidth = element.offsetWidth;
  // Do this instead:
  animatedStrategy.forEach(item =>
    void item.offsetWidth
  );
 
  
  // -> and re-adding the class
  animatedStrategy.forEach(item =>
    item.classList.add("hero__strategy-info_animated")
  );
  main.classList.add("main_visible")
  hero.classList.add("hero_hidden")
}, false));


// anchor.addEventListener("click", scrolling);
