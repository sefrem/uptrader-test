const animatedStrategy = document.querySelector(".hero__content");
const anchor = document.querySelectorAll(".hero__strategy-link");
const main = document.querySelector('.main')
const hero = document.querySelector('.hero')
const mainContent = document.querySelector('.main__strategy-info')


function throttle(func, delay) {  
  let inThrottle;
  return function() {
      if(!inThrottle) {
          func.apply(this, arguments);
          inThrottle = true;
          setTimeout(() => inThrottle = false, delay);
      }
  }
}

const downScrollAnimation = () => {
    animatedStrategy.classList.remove("hero__strategy-info_animated")
    void animatedStrategy.offsetWidth
    animatedStrategy.classList.add("hero__strategy-info_animated")
 
  main.classList.add("main_visible")
  hero.classList.add("hero_hidden")
  mainContent.classList.add("main__strategy-info_visible")
}

const throttledDownScrollAnimation = throttle(downScrollAnimation, 500)

const upScroll = () => {
  main.classList.remove("main_visible")
  hero.classList.remove("hero_hidden")
  mainContent.classList.remove("main__strategy-info_visible")
}


const  checkScrollDirection = e =>  {
  if (checkScrollDirectionIsUp(e)) {
    upScroll()
  } else {
    throttledDownScrollAnimation()
  }
}

const checkScrollDirectionIsUp = e => {
  if (e.wheelDelta) {
    return e.wheelDelta > 0;
  }
  return e.deltaY < 0;
}


anchor.forEach(anchor => anchor.addEventListener("click", downScrollAnimation, false));
document.body.addEventListener('wheel', checkScrollDirection)


