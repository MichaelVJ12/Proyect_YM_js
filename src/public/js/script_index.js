const products = [];
  for (let i = 1; i <= 12; i++) {
    products.push({
      name: `Producto ${i}`,
      price: `$${(Math.random() * 100000).toFixed(0)}`,
    });
  }

  const carouselInner = document.querySelector('#carrusel-novedades .carousel-inner');
  const indicators = document.querySelector('#carrusel-novedades .carousel-indicators');

  const itemsPerSlide = () => {
    const w = window.innerWidth;
    if (w >= 768) return 4;
    if (w >= 576) return 3;
    return 2;
  };

  function renderBootstrapCarousel() {
    const perSlide = itemsPerSlide();
    const slides = [];
    for (let i = 0; i < products.length; i += perSlide) {
      slides.push(products.slice(i, i + perSlide));
    }

    // Render slides
    carouselInner.innerHTML = slides.map((slide, idx) => `
      <div class="carousel-item ${idx === 0 ? 'active' : ''}">
        <div class="row">
          ${slide.map(prod => `
            <div class="col-6 col-sm-4 col-md-3 mb-3 mb-md-2">
              <div class="card rounded-0 shadow">
                <img src="./img/image-demo.webp" class="card-img-top object-fit-cover rounded-0 px-3 pt-3" alt="${prod.name}">
                <div class="card-body justify-content-center d-flex flex-column">
                  <h4 class="card-title fs-6 fw-normal">${prod.name}</h4>
                  <p class="card-text">${prod.price}</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    // Render indicators
    indicators.innerHTML = slides.map((_, idx) => `
      <button type="button" data-bs-target="#carrusel-novedades" data-bs-slide-to="${idx}" class="${idx === 0 ? 'active' : ''}" aria-current="${idx === 0}" aria-label="Slide ${idx + 1}"></button>
    `).join('');
  }

  // Inicial render y on resize
  window.addEventListener('load', renderBootstrapCarousel);
  window.addEventListener('resize', () => {
    // Reconstruir y resetear al primer slide
    renderBootstrapCarousel();
    const bsCarousel = bootstrap.Carousel.getInstance(document.getElementById('carrusel-novedades'));
    bsCarousel.to(0);
  });