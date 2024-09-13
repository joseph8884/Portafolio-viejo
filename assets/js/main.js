/*----------------- navigation menu --------------------*/

(() => {

  const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

  hamburgerBtn.addEventListener("click", showNavMenu);
  closeNavBtn.addEventListener("click", hideNavMenu);

  function showNavMenu() {
    navMenu.classList.add("open");
    bodyScrollingToggle();
  }
  function hideNavMenu() {
    navMenu.classList.remove("open");
    fadeOutEffect();
    bodyScrollingToggle();
  }
  function fadeOutEffect() {
    document.querySelector(".fade-out-effect").classList.add("active");
    setTimeout(() => {
      document.querySelector(".fade-out-effect").classList.remove("active");
    }, 300)
  }
  // attach an event handler to document
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains('link-item')) {
      /* make sure event.target.hash has a value before overridding default behavior*/
      if (event.target.hash !== "") {
        // prevent default anchor click behavior
        event.preventDefault();
        const hash = event.target.hash;
        // deactivate existing active 'section'
        document.querySelector(".section.active").classList.add("hide");
        document.querySelector(".section.active").classList.remove("active");
        // activate new 'section'
        document.querySelector(hash).classList.add("active");
        document.querySelector(hash).classList.remove("hide");
        /* deactivate existing active navigation menu 'link-item' */
        navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
        navMenu.querySelector(".active").classList.remove("active", "inner-shadow");
        /* if clicked 'link-item is contained within the navigation menu' */
        if (navMenu.classList.contains("open")) {
          // activate new navigation menu 'link-item'
          event.target.classList.add("active", "inner-shadow");
          event.target.classList.remove("outer-shadow", "hover-in-shadow");
          // hide navigation menu
          hideNavMenu();
        }
        else {
          let navItems = navMenu.querySelectorAll(".link-item");
          navItems.forEach((item) => {
            if (hash === item.hash) {
              // activate new navigation menu 'link-item'
              item.classList.add("active", "inner-shadow");
              item.classList.remove("outer-shadow", "hover-in-shadow");
            }
          })
          fadeOutEffect();
        }
        // add hash (#) to url
        window.location.hash = hash;
      }
    }
  })

})();
/*----------------- skills animation progress bar --------------------*/
document.addEventListener('DOMContentLoaded', function() {
  const progressBars = document.querySelectorAll('.about-section .skills .skill-item .progress-bar');

  function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
  }

  function checkProgressBars() {
      progressBars.forEach(bar => {
          if (isElementInViewport(bar)) {
              bar.classList.add('animate');
          }
      });
  }

  window.addEventListener('scroll', checkProgressBars);
  window.addEventListener('resize', checkProgressBars);

  // Initial check in case the element is already in view
  checkProgressBars();
});

/*------------ about section tabs ------------------*/

(() => {
  const aboutSection = document.querySelector(".about-section"),
    tabsContainer = document.querySelector(".about-tabs");

  tabsContainer.addEventListener("click", (event) => {
    /* if event.target contains 'tab-item' class and not contains
    'active' class */
    if (event.target.classList.contains("tab-item") &&
      !event.target.classList.contains("active")) {
      const target = event.target.getAttribute("data-target");
      // deactivate existing active 'tab-item'
      tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
      // activate new 'tab-item'
      event.target.classList.add("active", "outer-shadow");
      // deactivate existing active 'tab-content'
      aboutSection.querySelector(".tab-content.active").classList.remove("active");
      // activate new 'tab-content'
      aboutSection.querySelector(target).classList.add("active");
    }
  })
})();

function bodyScrollingToggle() {
  document.body.classList.toggle("hidden-scrolling");
}

/*---------------- portfolio filter and popup -------------------*/

(() => {

  const filterContainer = document.querySelector(".portfolio-filter"),
    portfolioItemsContainer = document.querySelector(".portfolio-items"),
    portfolioItems = document.querySelectorAll(".portfolio-item"),
    popup = document.querySelector(".portfolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
  let itemIndex, slideIndex, screenshots;

  /* filter portfolio items*/
  filterContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('filter-item') && !event.target.classList.contains('active')) {
      filterContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
      event.target.classList.add('active', 'outer-shadow');

      const target = event.target.getAttribute('data-target');
      portfolioItems.forEach((item) => {
        if (target === item.getAttribute('data-category') || target === 'all') {
          item.classList.remove('hide');
          item.classList.add('show');
        }
        else {
          item.classList.remove('show');
          item.classList.add('hide')
        }
      })
    }
  })

  portfolioItemsContainer.addEventListener('click', (event) => {
    if (event.target.closest('.portfolio-item-inner')) {
      const portfolioItem = event.target.closest('.portfolio-item-inner').parentElement;
      // get the portfolioItem index
      itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
      screenshots = portfolioItems[itemIndex].querySelector('.portfolio-item-img img').getAttribute("data-screenshots");
      // convert screenshots into array
      screenshots = screenshots.split(",");
      if (screenshots.length === 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      }
      else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
      }
      slideIndex = 0;
      popupToggle();
      popupSlideshow();
      popupDetails();
    }
  })

  closeBtn.addEventListener("click", () => {
    popupToggle();
    if (projectDetailsContainer.classList.contains("active")) {
      popupDetailsToggle();
    }
  })

  function popupToggle() {
    popup.classList.toggle("open");
    bodyScrollingToggle();
  }

  function popupSlideshow() {
    const imgSrc = screenshots[slideIndex];
    const popupImg = popup.querySelector(".pp-img");
    /*activate loader until the popupImg loaded */
    popup.querySelector(".pp-loader").classList.add("active");
    popupImg.src = imgSrc;
    popupImg.onload = () => {
      // deactivate loader after the popupImg loaded
      popup.querySelector(".pp-loader").classList.remove("active");
    }
    popup.querySelector(".pp-counter").innerHTML = (slideIndex + 1) + " of " + screenshots.length;
  }

  // next slide
  nextBtn.addEventListener("click", () => {
    if (slideIndex === screenshots.length - 1) {
      slideIndex = 0;
    }
    else {
      slideIndex++;
    }
    popupSlideshow();
  })

  // prev slide
  prevBtn.addEventListener("click", () => {
    if (slideIndex === 0) {
      slideIndex = screenshots.length - 1
    }
    else {
      slideIndex--;
    }
    popupSlideshow();
  })

  function popupDetails() {
    // if portfolio-item-details not exists
    if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
      projectDetailsBtn.style.display = "none";
      return; /*end function execution*/
    }
    projectDetailsBtn.style.display = "block";
    // get the project details
    const details = portfolioItems[itemIndex].querySelector(".portfolio-item-details").innerHTML;
    // set the project details
    popup.querySelector(".pp-project-details").innerHTML = details;
    // get the project title
    const title = portfolioItems[itemIndex].querySelector(".portfolio-item-title").innerHTML;
    // set the project title
    popup.querySelector(".pp-title h2").innerHTML = title;
    // get the project category
    const category = portfolioItems[itemIndex].getAttribute("data-category");
    // set the project category
    popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
  }

  projectDetailsBtn.addEventListener("click", () => {
    popupDetailsToggle();
  })

  function popupDetailsToggle() {
    if (projectDetailsContainer.classList.contains("active")) {
      projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
      projectDetailsBtn.querySelector("i").classList.add("fa-plus");
      projectDetailsContainer.classList.remove("active");
      projectDetailsContainer.style.maxHeight = 0 + "px"
    }
    else {
      projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
      projectDetailsBtn.querySelector("i").classList.add("fa-minus");
      projectDetailsContainer.classList.add("active");
      projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
      popup.scrollTo(0, projectDetailsContainer.offsetTop);
    }
  }

})();


// testimonial section
const testimonialsContainer = document.querySelector('.testimonials-container')
const testimonial = document.querySelector('.testimonial')
const userImage = document.querySelector('.user-image')
const username = document.querySelector('.username')
const role = document.querySelector('.role')

const testimonials = [
  {
    name: 'Ana Martínez',
    position: 'Gerente de La Fuente - Colegio Educativo',
    photo:
      'https://fotoartevip.cl/img/portafolio/fotos-para-linkedin/Fotografia%20Corporativa.jpg',
    text:
      "Como gerente de La Fuente, puedo afirmar que la colaboración con Webelopers ha sido una experiencia transformadora. La página web que crearon para nuestro colegio no solo es visualmente atractiva, sino que también ha simplificado enormemente la comunicación con padres, estudiantes y personal. La integración de funciones personalizadas ha optimizado la gestión interna y ha mejorado la experiencia educativa de nuestra comunidad. Estamos agradecidos por la profesionalidad y creatividad que Webelopers ha aportado a nuestro proyecto.",
  },
  {
    name: '',
    position: 'Dueño-Panda Sport Bar',
    photo: 'https://images.unsplash.com/photo-1606663889134-b1dedb5ed=format&fit=crop&w=387&q=80',
    text:
      "La creación de la página web de Panda Sport Bar por parte de Webelopers ha sido un éxito rotundo. Su equipo demostró un profundo conocimiento de las necesidades de nuestro negocio y creó un sitio web que refleja nuestra identidad de marca y valores. La página es fácil de navegar y ha mejorado significativamente la visibilidad de nuestro bar en línea. Estamos muy satisfechos con el resultado y con la colaboración que hemos tenido con Webelopers.",
  },
  {
    name: 'Juan Grau',
    position: 'Administrativo-Ferretería JF',
    photo: "./assets/img/portfolio/alejandro.jpg",
    text:
      "Como administrativo de Ferretería JF, puedo afirmar que la colaboración con Webelopers ha sido una experiencia transformadora. La página web que crearon para nuestro negocio no solo es visualmente atractiva, sino que también ha simplificado enormemente la comunicación con clientes y proveedores. La integración de funciones personalizadas ha optimizado la gestión interna y ha mejorado la experiencia de compra de nuestros clientes. Estamos agradecidos por la profesionalidad y creatividad que Webelopers ha aportado a nuestro proyecto.",
  },
  {
    name: 'Alejandro',
    position: 'Dueño-Comercializadora Ale',
    photo: 'https://images.unsplash.com/photo-1606663889134-b1dedb5ed=format&fit=crop&w=387&q=80',
    text:
      "La creación de la página web de Comercializadora Ale por parte de Webelopers ha sido un éxito rotundo. Su equipo demostró un profundo conocimiento de las necesidades de nuestro negocio y creó un sitio web que refleja nuestra identidad de marca y valores. La página es fácil de navegar y ha mejorado significativamente la visibilidad de nuestro negocio en línea. Estamos muy satisfechos con el resultado y con la colaboración que hemos tenido con Webelopers.",
  }
]

let idx = 1

function updateTestimonial() {
  const { name, position, photo, text } = testimonials[idx]

  testimonial.innerHTML = text
  userImage.src = photo
  username.innerHTML = name
  role.innerHTML = position

  idx++

  if (idx > testimonials.length - 1) {
    idx = 0
  }
}
setInterval(updateTestimonial, 10000);

// audio
const audio = document.getElementById("audio");
const playPause = document.getElementById("play");

playPause.addEventListener("click", () => {
  if (audio.paused || audio.ended) {
    playPause.querySelector(".pause-btn").classList.toggle("hide");
    playPause.querySelector(".play-btn").classList.toggle("hide");
    audio.play();
  } else {
    audio.pause();
    playPause.querySelector(".pause-btn").classList.toggle("hide");
    playPause.querySelector(".play-btn").classList.toggle("hide");
  }
});