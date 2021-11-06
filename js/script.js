window.addEventListener('DOMContentLoaded', () => {

    const body = document.querySelector('body'),
          products = document.querySelector('.products'),
          closeVideo = document.querySelectorAll('.modal__close--video'),
          video = document.querySelector('.modal__video'),
          videoOpen = document.querySelector('.video'),
          loadMore = products.querySelector('.btn--load');

    let order = 1,
        iframe = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/linlz7-Pnvw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ></iframe>';

console.log(video);

    

    videoOpen.addEventListener('click', () =>{
        let videoHTML = video.innerHTML;
        video.innerHTML = iframe + videoHTML;
        document.querySelector('#modal-video').style.display = "block";
        video.parentNode.prepend(video);
        body.style.overflow = "hidden";

        const closeVideo = video.querySelector('.modal__close--video');
        closeVideo.addEventListener('click', () => {
            video.innerHTML = videoHTML;
            document.querySelectorAll('#modal-video').forEach(modal => {
                modal.style.display = "none";
            });
            body.style.overflow = "";
        });

    });

    // -------------------------------------------------------------
    function setInMotionProduct(dataProduct) {
        const product = products.querySelector(dataProduct),
              sliderView = product.querySelector('.slider__view'),
              slider = product.querySelector('.slider'),
              slides = product.querySelectorAll('.slider__item'),
              next = product.querySelector('.slider-next'),
              prev = product.querySelector('.slider-prev'),
              sliderNav = product.querySelectorAll('.slider__nav-item'),
              productOptions = product.querySelector('.product__options'),
              options = productOptions.querySelectorAll('.option'),
              rentsTime = product.querySelectorAll('.rent__time-item'),
              btn = product.querySelector('.btn'),
              productName = product.querySelector('.product__name').textContent,
              resultPriceContent = product.querySelector('.product__result-price');


        let offset = 0,
            width = sliderView.clientWidth,
            constPrice = 17000,
            rentPrice = +rentsTime[0].getAttribute('data-rentPrice'),
            resultOptionPrice = 0,
            RT,
            index = 0;

        function getResultPrice(){
            return (constPrice * rentPrice) + resultOptionPrice;
        }

        let resultPrice = getResultPrice();

        resultPriceContent.textContent = resultPrice + ' RUB';
        slider.style.width = 100 * slides.length + '%';

        next.addEventListener('click', () =>{
            if (offset == width * (slides.length - 1)){
                offset = 0;
                index = 0;
            } else {
                offset += width;
                index++;
            }

            sliderNav.forEach(item => {
                item.classList.remove('_active');
            });

            sliderNav[index].classList.add('_active');
            
            slider.style.transform = `translateX(-${offset}px)`;
        });

        prev.addEventListener('click', () => {
            if (offset == 0){
                offset = width * (slides.length - 1);
                index = sliderNav.length - 1;
            } else {
                offset -= width;
                index--;
            }

            sliderNav.forEach(item => {
                item.classList.remove('_active');
            });

            sliderNav[index].classList.add('_active');

            slider.style.transform = `translateX(-${offset}px)`;
        });

        options.forEach(option =>{
            const checkbox = option.querySelector('.option__checkbox'),
                  optionPrice = option.getAttribute('data-optionPrice');

            option.querySelector('.option__price').textContent = optionPrice + ' RUB';

            option.addEventListener('click', () =>{

                if (checkbox.classList.contains('_active')){
                    checkbox.classList.remove('_active');
                    resultOptionPrice -= +optionPrice;
                } else {
                    checkbox.classList.add('_active');
                    resultOptionPrice += +optionPrice;
                }

                resultPrice = getResultPrice();

                resultPriceContent.textContent = resultPrice + ' RUB';

            });
        });


        rentsTime[0].classList.add('_active');
        RT = rentsTime[0].textContent;

        rentsTime.forEach(rent => {
            rent.addEventListener('click', () => {
                if (!rent.classList.contains('_active')){
                    rentsTime.forEach(item => {
                        item.classList.remove('_active');
                    });
                    rent.classList.add('_active');
                    RT = rent.textContent;
                    rentPrice = +rent.getAttribute('data-rentPrice');

                    resultPrice = getResultPrice();

                    resultPriceContent.textContent = resultPrice + ' RUB';
                }
            });
        });

        btn.addEventListener('click', () => {
            const optionActiveCheckbox = product.querySelectorAll('.option ._active');
            let optionActive = [];

            optionActiveCheckbox.forEach((item, key) =>{
                optionActive[key] = item.parentNode;
            });


            body.style.overflow = "hidden";
            new MobileOrder(productName,resultPrice, resultOptionPrice, rentPrice, constPrice, '#modal-order',RT).render(constPrice, resultOptionPrice);
            optionActive.forEach(option => {
                let price = +option.getAttribute('data-optionPrice'),
                    name = option.querySelector('.option__name').textContent;
                new OrderOptions(name, price, '.modal__options').render();
            });
            
            document.querySelector('#modal-order').style.display = "block";
        });

              
    }

    // NEW Options

    class Options {
        constructor(index, product, parentSelector) {
            this.index = index;
            this.price = 2500 + (500 * index);
            this.product = document.querySelector(product);
            this.parent = this.product.querySelector(parentSelector);
        }

        render(){
            const element = document.createElement('div');
            element.innerHTML = `
                <div data-optionPrice=${this.price} class="option">
                    
                    <div class="option__content">
                        <div class="option__content-picture">
                            <img src="img/photo-option.jpg" alt="" class="option__img">
                        </div>

                        <div class="option__content-text">
                            <h6 class="option__name">Разработка макета #${this.index + 1}</h6>
                            <p class="option__price">${this.price} RUB</p>
                        </div>

                        
                    </div>
                    <div class="option__checkbox"></div>
                </div>
           `;

           this.parent.append(element);
        }
    }

    // NEW Product Card--------------------------------------------------------------
    class ProductCard {
        constructor(order, parentSelector){
            this.order = order;
            this.parent = document.querySelector(parentSelector); 
        }

        render(){
            const element = document.createElement('div');
            element.style.transition = "all .3s linear";
            element.style.opacity = "0";
            element.innerHTML = `
            <div data-product${this.order} class="product">
                    <div class="slider__view">
                        <div class="slider-prev"></div>
                        <div class="slider-next"></div>

                        <div class="slider">
                            <div class="slider__item">
                                <img class="slider__img" src="img/slider-photo-1.jpg" alt="">
                            </div>
    
                            <div class="slider__item">
                                <img class="slider__img" src="img/slider-photo-2.jpg" alt="">
                            </div>
    
                            <div class="slider__item">
                                <img class="slider__img" src="img/slider-photo-3.jpg" alt="">
                            </div>
                        </div>
                    </div>

                    <ul class="slider__nav">
                        <li class="slider__nav-item _active"></li>
                        <li class="slider__nav-item"></li>
                        <li class="slider__nav-item"></li>
                    </ul>

                    <h3 class="product__name">Фотобудка с ширмой #${order}</h3>
                    <div class="product__size">Размер: <span>2м x 1.5м x 2 м</span></div>

                    <h5 class="options__title">Доп. опции</h5>

                    <div class="product__options">
                        
                    </div>

                    <div class="product__rent">
                        <div class="rent__title">Укажите время аренды</div>
                        <div class="rent__time">
                            <div data-rentPrice=1 class="rent__time-item">1 час</div>
                            <div data-rentPrice=1.9 class="rent__time-item">2 часа</div>
                            <div data-rentPrice=2.7 class="rent__time-item">3 часа</div>
                            <div data-rentPrice=4.3 class="rent__time-item">5 часов</div>
                            <div data-rentPrice=10 class="rent__time-item">выставка 2 дня</div>
                            <div data-rentPrice=14 class="rent__time-item">выставка 3 дня</div>
                        </div>
                    </div>

                    <div class="product__result">
                        <p class="product__result-price">17 000 ₽</p>
                        <button class=" btn">Оставить заявку</button>
                    </div>
                </div>
            `;

            this.parent.before(element);
            setTimeout(()=>{
                element.style.opacity = "1";
            },200);
        }
    }

    // NEW Order---------------------------------------------------------------------
    class MobileOrder {
        constructor(name, resultPrice, resultOptionPrice, rentPrice, constPrice, parentSelector, time){
            this.name = name;
            this.resultPrice = resultPrice;
            this.resultOptionPrice = resultOptionPrice;
            this.rentPrice = rentPrice;
            this.constPrice = constPrice;
            this.parentSelector = document.querySelector(parentSelector);
            this.time = time;
        }

        render(constPrice, resultOptionPrice){
            const element = document.createElement('div');
            element.classList.add('modal');
            element.setAttribute('id','modal-order');
            element.innerHTML = `
            
            <div class="container">
                <div class="modal__order">
                    <div class="modal__close"></div>
                    <div class="modal__title">Ваша заявка</div>
                    <div class="modal__product">
                        <div class="modal__product-about">
                            <div class="modal__product-name">${this.name}</div>
                            <div class="modal__product-size">Размер: <span>2м x 1.5м x 2 м</span></div>
                        </div>
                        
                        <div class="modal__product-price">${this.constPrice * this.rentPrice} ₽</div>
                    </div>

                    <div class="modal__rent-time"><span>${this.time}</span>
                        <ul class="_hide">
                            <li data-rentPrice=1 >1 час</li>
                            <li data-rentPrice=1.9 >2 часа</li>
                            <li data-rentPrice=2.7 >3 часа</li>
                            <li data-rentPrice=4.3 >5 часов</li>
                            <li data-rentPrice=10 >выставка 2 дня</li>
                            <li data-rentPrice=14 >выставка 3 дня</li>
                        </ul>
                    </div>

                    <div class="modal__options">
                    </div>

                    <div class="modal__result">
                        <p class="modal__result-text">Итого:</p>
                        <p class="modal__result-price">${this.resultPrice}RUB</p>
                    </div>

                    <form class="moda__form" action="">
                        <input class="modal__form-input" type="tel" name="tel" placeholder="+7 (000) 000 00 00" id="">
                        <button class="btn btn--modal">Отправить заявку</button>
                    </form>
                </div>
            </div>
            `;

            if (this.parentSelector) {
                this.parentSelector.replaceWith(element); 
            } else {
                body.prepend(element);
            }

            const modalClose = element.querySelector('.modal__close'),
                  rentTime = element.querySelector('.modal__rent-time'),
                  rentChois = rentTime.querySelector('ul'),
                  RP = element.querySelector('.modal__result-price'),
                  BP = element.querySelector('.modal__product-price'),
                  btnClose = element.querySelector('.btn--modal');

            function closeModal(triger){
                triger.addEventListener('click', (e)=> {
                    e.preventDefault();
                    element.style.display = "none";
                    body.style.overflow = "";
                });
            }

            closeModal(modalClose);
            closeModal(btnClose);

            rentTime.addEventListener('click', () => {
                rentChois.classList.toggle('_hide');
            });

            rentChois.addEventListener('click', (e) =>{
                rentChois.classList.add('_hide');
                e.stopPropagation();
                BP.textContent = constPrice * +e.target.getAttribute('data-rentPrice');
                rentTime.querySelector('span').textContent = e.target.textContent;
                RP.textContent = ((constPrice * +e.target.getAttribute('data-rentPrice')) + resultOptionPrice) + "RUB";
            });
             
        }
    }

    // NEW OrderOptions
    class OrderOptions {
        constructor(name, price, parentSelector){
            this.name = name;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
        }

        render(){
            const element = document.createElement('div');
            element.classList.add('modal__option');
            element.innerHTML = `
                <h5 class="modal__option-name">${this.name}</h5>
                <p class="modal__option-price">${this.price} ₽</p>
            `;
            this.parent.append(element);
        }

    }

    function createProductCard(){
        new ProductCard(order, '.btn--load').render();

        for(let i = 0; i < 10; i++){
            new Options(i,`[data-product${order}]`,'.product__options').render();
        }

        setInMotionProduct(`[data-product${order}]`);
    }

    createProductCard();


    loadMore.addEventListener('click', () => {
        order++;
        createProductCard();

        if (order === 10) {
            loadMore.style.display = 'none';
        }
        
    });
    

});