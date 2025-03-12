//A- Global variables

let currentRappGeneratorType = 1;

const onLoad = document.querySelectorAll('.onLoad')
const onLoadItem = document.querySelectorAll('.onLoadItem')
const onLoadMenu = document.querySelectorAll(".onLoadMenu")
const onLoadText = document.querySelectorAll(".onLoadText")

const currentGeneratorType_title = document.getElementById("currentGeneratorType-title");
const currentGeneratorType_selection = document.querySelectorAll("input.currentGeneratorType-selection");

//A- Global variables END

//~ LOAD
window.onload = () => {
  showMenu()
  setTimeout(() => {
    const loadingWrapper = document.querySelector(".loadingWrapper")
    const loadingBlock = document.querySelector(".loadingBlock")
    const loadingBlockBlur = document.querySelector(".loadingBlock-blur")
    loadingBlock.style.filter = "blur(200px)"
    loadingBlockBlur.style.filter = "blur(200px)"
    hideMenu()
    setTimeout(() => {
      loadingWrapper.remove()
      setTimeout(() => {
        freshLoading()
      }, 50);
    }, 500);
  }, 50);
};

function freshLoading(){
  onLoadItem.forEach(loadingItem =>{
    loadingItem.classList.remove("onLoadItem")
  })
  onLoad.forEach(loadingItem => {
    loadingItem.classList.remove("onLoad")
  });
  onLoadMenu.forEach(loadingItem => {
    loadingItem.classList.remove("onLoadMenu")
  });
  onLoadText.forEach(loadingItem => {
    loadingItem.classList.remove("onLoadText")
  });
}
//~ LOAD END 

//~ CANVAS textarea overlay

const textAreaOverLay__textarea = document.querySelector('textarea.allOrders');
const textAreaOverLay__canvas = document.createElement('canvas');
const textAreaOverLay__ctx = textAreaOverLay__canvas.getContext('2d');

textAreaOverLay__canvas.style.position = 'absolute';
textAreaOverLay__canvas.style.pointerEvents = 'none';
textAreaOverLay__canvas.style.top = textAreaOverLay__textarea.offsetTop + 'px';
textAreaOverLay__canvas.style.left = textAreaOverLay__textarea.offsetLeft + 'px';

function textAreaOverLay__updateCanvas() {
    textAreaOverLay__canvas.width = textAreaOverLay__textarea.clientWidth;
    textAreaOverLay__canvas.height = textAreaOverLay__textarea.clientHeight;
    textAreaOverLay__ctx.clearRect(0, 0, textAreaOverLay__canvas.width, textAreaOverLay__canvas.height);
    
    const text = textAreaOverLay__textarea.value;
    const lines = text.split('\n');
    const fontSize = parseInt(window.getComputedStyle(textAreaOverLay__textarea).fontSize);
    const lineHeight = fontSize * 1.2;
    const scrollTop = textAreaOverLay__textarea.scrollTop;
    const startY = 14 - scrollTop;
    textAreaOverLay__ctx.font = `${fontSize}px ${window.getComputedStyle(textAreaOverLay__textarea).fontFamily}`;
    textAreaOverLay__ctx.textBaseline = 'top';
    
    let y = startY;
    for (const line of lines) {
        if (y + lineHeight > 0 && y < textAreaOverLay__canvas.height) { // Отображать только видимые строки
            const words = line.split(' ');
            let x = 10; // Padding
            let firstWordColor = '#00ff68';
            let secondWordColor = '#ccff00';
            let otherWordsColor = '#ffffff';
            
            if (/^(F0254|0|72|YP)/.test(line)) {
                firstWordColor = '#ccff00';
                secondWordColor = '#fff';
                otherWordsColor = '#fff';
            } else if (/^(F1254|FA254|F3000000000)/.test(line)) {
                firstWordColor = '#00dcff';
                secondWordColor = '#fff';
                otherWordsColor = '#fff';
            }
            
            words.forEach((word, index) => {
                if (index === 0) textAreaOverLay__ctx.fillStyle = firstWordColor;
                else if (index === 1) textAreaOverLay__ctx.fillStyle = secondWordColor;
                else textAreaOverLay__ctx.fillStyle = otherWordsColor;
                
                textAreaOverLay__ctx.shadowColor = textAreaOverLay__ctx.fillStyle;
                textAreaOverLay__ctx.shadowBlur = 10;
                textAreaOverLay__ctx.fillText(word, x, y);
                x += textAreaOverLay__ctx.measureText(word + ' ').width;
            });
        }
        y += lineHeight;
    }
}
textAreaOverLay__textarea.parentNode.insertBefore(textAreaOverLay__canvas, textAreaOverLay__textarea.nextSibling);
textAreaOverLay__textarea.addEventListener('input', textAreaOverLay__updateCanvas);
textAreaOverLay__textarea.addEventListener('scroll', textAreaOverLay__updateCanvas);
textAreaOverLay__updateCanvas();

//~ CANVAS textarea overlay END

//~ CHANGE generator type

currentGeneratorType_selection.forEach(input => {
  input.addEventListener("change", (event) => {
    let title = "";
    getDataAndMakeOrderRow(event);
    if (input.id === "rapp-1") {
      title = "Магистрали";
      currentRappGeneratorType = 1;
    } else if (input.id === "rapp-2") {
      title = "Курьеры";
      currentRappGeneratorType = 2;
    } else if (input.id === "rapp-3") {
      title = "Мерчи";
      currentRappGeneratorType = 3;
    } else if (input.id === "rapp-4") {
      title = "Аномалии";
      currentRappGeneratorType = 4;
    } else if (input.id === "rapp-5") {
      title = "Засылы / Дубли / Lost";
      currentRappGeneratorType = 5;
    } else {
      title = "Что-то новенькое 😐";
    }
    currentGeneratorType_title.innerText = title;

    // Получаем textarea
    const textarea = document.querySelector('.allOrders');
    
    // Создаем событие input для textarea и отправляем его
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    
    // Вызов функции предпросмотра после изменения
    throttledGeneratePreview();
    setTimeout(() => {
      hideMenu()
    }, 600);
  });
});

//~ CHANGE generator type END

//~ CARD Controls

const allHintCards = document.querySelectorAll(".hints-card-container > div");
const hintsContainer = document.querySelector(".hints-card-container");
const controlsContainer = document.querySelector(".hints-container-controls-position");
const btnForward = document.getElementById("changeHintCard-forward");
const btnBackward = document.getElementById("changeHintCard-backward");

const cardCount = allHintCards.length;
const cardWidth = allHintCards[0].offsetWidth;
const gap = 10;
const transitionDuration = 200;

let hintCardOnScreenID = 1;
let isTransitioning = false;
let autoSwitchInterval = null;

// Клонируем только первый и последний элемент
const firstClone = allHintCards[0].cloneNode(true);
const lastClone = allHintCards[cardCount - 1].cloneNode(true);
firstClone.classList.add("cloned");
lastClone.classList.add("cloned");

hintsContainer.appendChild(firstClone);
hintsContainer.insertBefore(lastClone, allHintCards[0]);

const allCards = document.querySelectorAll(".hints-card-container > div");
const totalCards = allCards.length;

// Устанавливаем стартовую позицию
hintsContainer.style.transform = `translateX(-${(cardWidth + gap) * hintCardOnScreenID}px)`;

// Создаем контролы
controlsContainer.innerHTML = "";
const indicators = [];

for (let i = 0; i < cardCount; i++) {
  let span = document.createElement("span");
  span.dataset.index = i;
  indicators.push(span);
  controlsContainer.appendChild(span);
}

function updateIndicators(index) {
  indicators.forEach((span, i) => {
    span.classList.toggle("active", i === index);
  });
}

updateIndicators(0);

function moveCarousel(direction) {
  if (isTransitioning) return;
  isTransitioning = true;
  hintCardOnScreenID += direction;
  let cardPosition = hintCardOnScreenID * (cardWidth + gap);
  hintsContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
  hintsContainer.style.transform = `translateX(-${cardPosition}px)`;

  setTimeout(() => {
    if (hintCardOnScreenID === totalCards - 1) {
      hintCardOnScreenID = 1;
      hintsContainer.style.transition = "none";
      hintsContainer.style.transform = `translateX(-${(cardWidth + gap) * hintCardOnScreenID}px)`;
    } else if (hintCardOnScreenID === 0) {
      hintCardOnScreenID = totalCards - 2;
      hintsContainer.style.transition = "none";
      hintsContainer.style.transform = `translateX(-${(cardWidth + gap) * hintCardOnScreenID}px)`;
    }
    updateIndicators(hintCardOnScreenID - 1);
    isTransitioning = false;
  }, transitionDuration);
}

btnForward.addEventListener("click", () => moveCarousel(1));
btnBackward.addEventListener("click", () => moveCarousel(-1));

indicators.forEach((span) => {
  span.addEventListener("click", (e) => {
    let index = Number(e.target.dataset.index);
    hintCardOnScreenID = index + 1;
    let cardPosition = hintCardOnScreenID * (cardWidth + gap);
    hintsContainer.style.transition = `transform ${transitionDuration}ms ease-in-out`;
    hintsContainer.style.transform = `translateX(-${cardPosition}px)`;
    updateIndicators(index);
  });
});

// Автоматическое переключение слайдов
function startAutoSwitch() {
  autoSwitchInterval = setInterval(() => {
    moveCarousel(1);
  }, 6000); // переключение слайдов каждые 5 секунд
}

function stopAutoSwitch() {
  if (autoSwitchInterval) {
    clearInterval(autoSwitchInterval);
    autoSwitchInterval = null;
  }
}

// Запуск авто-переключения при покидании мышью
hintsContainer.addEventListener("mouseleave", () => {
  startAutoSwitch();
});
startAutoSwitch();
// Остановка авто-переключения при наведении мыши
hintsContainer.addEventListener("mouseenter", () => {
  stopAutoSwitch();
});


//~ CARD Controls END

//~ HEADER toggle button
const header = document.querySelector('header');
const container = document.querySelector('.container');
const menuToggle = document.querySelector('.menuToggle');
const modalWindow = document.querySelector('.modalWindow');
const menuSelection = document.querySelector('.menuSelection');

menuToggle.addEventListener('click', () => {
  if (header.classList.contains("active")) {
    hideMenu()
  } else {
    showMenu()
  }
});

modalWindow.addEventListener('click', ()=>{
  hideMenu()
})

hideMenu()

function hideMenu(){
  if(header.classList.contains("onLoading")){
    header.classList.remove("onLoading")
  }
  modalWindow.style.display = "none"
  menuToggle.style.backgroundColor = "transparent"
  let menuToggleHeight = 60
  header.style.transform = `translateY(calc(-100% + ${menuToggleHeight}px))`;
  menuToggle.innerHTML = `<i class=\"fa-solid fa-bars\"></i>`
  header.classList.remove("active");
  container.removeAttribute("inert")
  menuSelection.setAttribute("inert", true)
  const pdfForm = document.getElementById("pdf-form")
  pdfForm.removeAttribute("inert")
}

function showMenu(){
  if(header.classList.contains("onLoading")){
    header.classList.remove("onLoading")
  }
  calendarModalWindow.classList.remove("active")
  modalWindow.style.display = "flex"
  menuToggle.style.backgroundColor = "#ff0000"
  header.style.transform = `translateY(0)`;
  menuToggle.innerHTML = `<i class=\"fa-solid fa-xmark\"></i>`
  header.classList.add("active");
  container.setAttribute("inert", true)
  menuSelection.removeAttribute("inert")
}
//~ HEADER toggle button END

//~ Tootltip toggle

const checkbox = document.getElementById("disableTooltip");

function toggleTooltipClass() {
  const elements = document.querySelectorAll(".pegasusTooltip, .tooltipRemoved");
  elements.forEach(el => {
    if (checkbox.checked) {
      el.classList.add("pegasusTooltip");
      el.classList.remove("tooltipRemoved");
    }else{
      el.classList.remove("pegasusTooltip");
      el.classList.add("tooltipRemoved"); // Сохраняем возможность вернуть класс
    }
  });
}

checkbox.addEventListener("change", toggleTooltipClass);
toggleTooltipClass(); // Вызываем при загрузке, чтобы применить начальное состояние

//~ Tootltip toggle END

//~ Direction dropdown menu

const direction__options = [
  "СЦ Домодедово ЕВСЦ",
  "СЦ Яндекс Маркет Софьино ФФЦ",
  "СЦ Яндекс Маркет Софьино Суперсклад",
  "СЦ Яндекс Маркет Софьино КГТ",
  "СЦ Тарный (Тарный Дропофф)",
  "СЦ Липецк",
  "СЦ Курск",
  "СЦ Белгород",
  "СЦ Ростов",
  "СЦ Краснодар",
  "Ростов КГТ",
  "СЦ Строгино",
  "СЦ Дзержинский",
  "СЦ Троицкий",
  "СЦ Казань",
  "СЦ Запад",
  "СЦ Самара",
  "СЦ Грибки",
  "СЦ Ставрополь",
  "СЦ Дмитровское",
  "СЦ СПБ Бугры",
  "СЦ Ленинские горки",
  "СЦ Муром",
  "СЦ Челябинск",
  "СЦ Чебоксары",
  "СЦ Ижевск",
  "СЦ Тюмень",
  "СЦ Екатеринбург",
  "СЦ Набережные Челны",
  "СЦ Оренбург",
  "СЦ Новосибирск",
  "СЦ Барнаул",
  "СЦ Вологда",
  "СЦ Смоленск"
];

const direction__input = document.getElementById("recipient");
const direction__dropdownList = document.getElementById("dropdownList");
let previousValue = "";

// Карта для перевода букв из английской раскладки в русскую
const ruEnMap = {
  "q": "й", "w": "ц", "e": "у", "r": "к", "t": "е", "y": "н", "u": "г", "i": "ш", "o": "щ", "p": "з",
  "a": "ф", "s": "ы", "d": "в", "f": "а", "g": "п", "h": "р", "j": "о", "k": "л", "l": "д", 
  "z": "я", "x": "ч", "c": "с", "v": "м", "b": "и", "n": "т", "m": "ь", "Q": "Й", "W": "Ц", "E": "У",
  "R": "К", "T": "Е", "Y": "Н", "U": "Г", "I": "Ш", "O": "Щ", "P": "З", "A": "Ф", "S": "Ы", "D": "В",
  "F": "А", "G": "П", "H": "Р", "J": "О", "K": "Л", "L": "Д", "Z": "Я", "X": "Ч", "C": "С", "V": "М",
  "B": "И", "N": "Т", "M": "Ь"
};

// Функция для преобразования английских символов в русские
function transliterate(text) {
  return text.split('').map(char => ruEnMap[char] || char).join('');
}

function updateDropdownList() {
  const search = transliterate(direction__input.value.toLowerCase()); // Преобразуем введенный текст в правильные русские символы
  direction__dropdownList.innerHTML = "";
  const filteredOptions = direction__options.filter(option => option.toLowerCase().includes(search));
  
  if (filteredOptions.length === 0) {
      const noMatch = document.createElement("div");
      noMatch.classList.add("dropdown-item", "no-matches");
      noMatch.textContent = "Нет совпадений";
      direction__dropdownList.appendChild(noMatch);
  } else {
      filteredOptions.forEach(option => {
          const item = document.createElement("div");
          item.classList.add("dropdown-item");
          item.textContent = option;
          item.addEventListener("click", () => {
              direction__input.value = option;
              direction__dropdownList.classList.remove("show");
          });
          direction__dropdownList.appendChild(item);
      });
  }
  direction__dropdownList.classList.add("show");
}

direction__input.addEventListener("input", updateDropdownList);
direction__input.addEventListener("focus", () => {
  previousValue = direction__input.value;
  direction__input.value = "";
  updateDropdownList();
});

direction__input.addEventListener("blur", () => {
  setTimeout(() => {
      if (!direction__dropdownList.contains(document.activeElement)) {
          direction__dropdownList.classList.remove("show");
          if (!direction__options.includes(direction__input.value)) {
              direction__input.value = previousValue;
          }
      }
  }, 200);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) {
      direction__dropdownList.classList.remove("show");
  }
});

//~ Direction dropdown menu END

//~ CANVAS header
const canvas = document.getElementById('headerArrowCanvas');
const ctx = canvas.getContext('2d');

// Устанавливаем размер canvas равным размеру header
canvas.width = header.clientWidth;
canvas.height = header.clientHeight;

const arrows = [];
const arrowSpeedMin = 1; // Минимальная скорость стрелки
const arrowSpeedMax = 3; // Максимальная скорость стрелки
const arrowSpawnRate = 100; // Интервал создания стрелок (в миллисекундах)
const arrowLifeTime = 5000; // Время жизни стрелки (в миллисекундах)
const mouseRadius = 50; // Радиус свечения вокруг мыши
let mouseX = -100, mouseY = -100; // Позиция мыши (вне canvas по умолчанию)
let isMouseOnCanvas = false; // Флаг, указывающий, находится ли курсор на canvas

// Параметры для точек на заднем фоне
const dotColor = '#333'; // Цвет точек
const dotSize = 1; // Размер точек
const dotSpacing = 10; // Расстояние между точками
const dots = []; // Массив для хранения точек

// Создаём точки на заднем фоне
for (let x = 0; x < canvas.width; x += dotSpacing) {
    for (let y = 0; y < canvas.height; y += dotSpacing) {
        dots.push({ x, y });
    }
}

// Функция для отрисовки точек на заднем фоне
function drawDottedBackground() {
    dots.forEach(dot => {
        if (isMouseOnCanvas) {
            const dx = dot.x - mouseX;
            const dy = dot.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Если точка в радиусе наведения, подсвечиваем её
            if (distance <= mouseRadius) {
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - distance / mouseRadius})`; // Плавное свечение
            } else {
                ctx.fillStyle = dotColor;
            }
        } else {
            ctx.fillStyle = dotColor; // Если курсор вне canvas, точки не подсвечиваются
        }

        ctx.fillRect(dot.x, dot.y, dotSize, dotSize);
    });
}

class Arrow {
    constructor(x, y, angle, speed) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.createdAt = Date.now(); // Время создания стрелки
        this.rotationSpeed = (Math.random() - 0.5) * 0.05; // Случайная скорость вращения
        this.initialOpacity = Math.random() * 0.3 + 0.3; // Прозрачность от 30% до 60%
        this.currentOpacity = this.initialOpacity;
        this.initialSize = 16; // Размер стрелки
        this.currentSize = this.initialSize;
    }

    getAge() {
        return Date.now() - this.createdAt; // Возвращает возраст стрелки в миллисекундах
    }

    // Проверка, находится ли стрелка в радиусе свечения мыши
    isNearMouse() {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        return Math.sqrt(dx * dx + dy * dy) <= mouseRadius;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.scale(this.currentSize / this.initialSize, this.currentSize / this.initialSize); // Масштабирование

        // Цвет стрелки
        const baseColor = `rgba(255, 255, 255, ${this.currentOpacity})`; // Белый цвет с прозрачностью
        const glowColor = 'rgba(255, 255, 255, 1)'; // Яркий белый для свечения

        // Если стрелка рядом с мышкой, добавляем свечение
        if (this.isNearMouse() && isMouseOnCanvas) {
            ctx.shadowBlur = 10; // Свечение
            ctx.shadowColor = glowColor;
        } else {
            ctx.shadowBlur = 0;
        }

        // Рисуем символ стрелки ➜
        ctx.font = `${this.initialSize}px Arial`;
        ctx.fillStyle = baseColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('➜', 0, 0);

        ctx.restore();
    }

    update() {
        // Обновляем позицию стрелки
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Меняем угол для закручивания или поворота
        this.angle += this.rotationSpeed;

        // Уменьшаем прозрачность и размер при приближении к концу жизни
        const age = this.getAge();
        if (age > arrowLifeTime * 0.8) {
            const fadeProgress = (age - arrowLifeTime * 0.8) / (arrowLifeTime * 0.2);
            this.currentOpacity = this.initialOpacity * (1 - fadeProgress);
            this.currentSize = this.initialSize * (1 - fadeProgress);
        }

        this.draw();
    }

    isOutOfBounds() {
        // Проверяем, вышла ли стрелка за пределы canvas
        return (
            this.x < -20 || this.x > canvas.width + 20 ||
            this.y < -20 || this.y > canvas.height + 20
        );
    }

    isDead() {
        // Проверяем, истекло ли время жизни стрелки
        return this.getAge() > arrowLifeTime;
    }
}

function createArrow() {
    // Случайные координаты внутри canvas
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const angle = Math.random() * Math.PI * 2; // Случайный угол
    const speed = Math.random() * (arrowSpeedMax - arrowSpeedMin) + arrowSpeedMin; // Случайная скорость
    arrows.push(new Arrow(x, y, angle, speed));
}

function animate() {
    // Очищаем canvas и рисуем точечный фон
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDottedBackground();

    // Обновляем и рисуем все стрелки
    arrows.forEach((arrow, index) => {
        arrow.update();

        // Удаляем стрелки, которые вышли за пределы canvas или истекло время их жизни
        if (arrow.isOutOfBounds() || arrow.isDead()) {
            arrows.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

let spawnInterval;

// Создаём стрелки с интервалом
spawnInterval = setInterval(createArrow, arrowSpawnRate);

// Отслеживаем движение мыши по всему документу
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    // Проверяем, находится ли курсор в пределах canvas
    isMouseOnCanvas = (
        mouseX >= 0 && mouseX <= canvas.width &&
        mouseY >= 0 && mouseY <= canvas.height
    );
});

animate();

// Обновляем размер canvas при изменении размера окна
window.addEventListener('resize', () => {
    canvas.width = header.clientWidth;
    canvas.height = header.clientHeight;
    dots.length = 0; // Очищаем массив точек
    for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
            dots.push({ x, y });
        }
    }
});
//~ CANVAS header END

//~ CANVAS Container

const containerCanvas = document.getElementById('containerCanvas');
const containerCanvas_ctx = containerCanvas.getContext('2d');

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

let containerCanvas_bgColor = '#2E2E2E';
let containerCanvas_gridColor = '#232323';
let containerCanvas_highlightColor = '#5E5E5E';
const containerCanvas_gridSize = 50;  // Размер квадрата
const containerCanvas_gap = 2;  // Расстояние между квадратами
let containerCanvas_offsetX = 0;
let containerCanvas_offsetY = 0;
let containerCanvas_mouseX = -1000;
let containerCanvas_mouseY = -1000;
const containerCanvas_circleSize = 60;  // Размер круга, который будет следовать за курсором
const containerCanvas_circleYOffset = -60;  // Смещение круга по вертикали

function containerCanvas_resizeCanvas() {
    containerCanvas.width = window.innerWidth;
    containerCanvas.height = window.innerHeight;
}

function containerCanvas_drawGrid() {
    containerCanvas_ctx.fillStyle = containerCanvas_bgColor;
    containerCanvas_ctx.fillRect(0, 0, containerCanvas.width, containerCanvas.height);

    // Сначала рисуем круг за квадратами, смещая его по вертикали на -60 пикселей
    const gradient = containerCanvas_ctx.createRadialGradient(containerCanvas_mouseX, containerCanvas_mouseY + containerCanvas_circleYOffset, 0, containerCanvas_mouseX, containerCanvas_mouseY + containerCanvas_circleYOffset, containerCanvas_circleSize);
    gradient.addColorStop(0, containerCanvas_highlightColor);
    gradient.addColorStop(1, containerCanvas_bgColor);
    
    containerCanvas_ctx.fillStyle = gradient;
    containerCanvas_ctx.beginPath();
    containerCanvas_ctx.arc(containerCanvas_mouseX, containerCanvas_mouseY + containerCanvas_circleYOffset, containerCanvas_circleSize, 0, 2 * Math.PI);
    containerCanvas_ctx.fill();
    
    // Теперь рисуем квадраты, которые будут поверх круга
    for (let x = -containerCanvas_gridSize; x < containerCanvas.width + containerCanvas_gridSize; x += containerCanvas_gridSize + containerCanvas_gap) {
        for (let y = -containerCanvas_gridSize; y < containerCanvas.height + containerCanvas_gridSize; y += containerCanvas_gridSize + containerCanvas_gap) {
            let drawX = x + containerCanvas_offsetX % (containerCanvas_gridSize + containerCanvas_gap);
            let drawY = y + containerCanvas_offsetY % (containerCanvas_gridSize + containerCanvas_gap);
            
            containerCanvas_ctx.fillStyle = containerCanvas_gridColor;
            containerCanvas_ctx.fillRect(drawX, drawY, containerCanvas_gridSize, containerCanvas_gridSize);
        }
    }
}

function containerCanvas_animate() {
    containerCanvas_offsetX += 0.2;
    containerCanvas_offsetY += 0.2;
    containerCanvas_drawGrid();
    requestAnimationFrame(containerCanvas_animate);
}

window.addEventListener('resize', containerCanvas_resizeCanvas);
window.addEventListener('mousemove', (e) => {
    containerCanvas_mouseX = e.clientX;
    containerCanvas_mouseY = e.clientY;
});

containerCanvas_resizeCanvas();
containerCanvas_animate();


//~ CANVAS Container END

//~ Календарь

const dateDisplay = document.getElementById('dateDisplay');
const calendarModalWindow = document.getElementById('calendarModalWindow');
const calendar = document.getElementById('calendar');
const calendarDays1 = document.getElementById('calendarDays1');
const calendarDays2 = document.getElementById('calendarDays2');
const todayBtn = document.getElementById('todayBtn');
const tomorrowBtn = document.getElementById('tomorrowBtn');
const noDayBtn = document.getElementById('noDayBtn');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const currentMonth1 = document.getElementById('currentMonth1');
const currentMonth2 = document.getElementById('currentMonth2');
const monthButtons = document.querySelectorAll('.calendar-nav-sellction');

let selectedDate = new Date();
let selectedMonth = selectedDate.getMonth(); // Месяц, в котором выбран день
let selectedDay = selectedDate.getDate();  // День, который выбран

function renderCalendar(date) {
    calendarDays1.innerHTML = '';
    calendarDays2.innerHTML = '';
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    generateMonth(calendarDays1, currentMonth1, year, month);
    generateMonth(calendarDays2, currentMonth2, year, month + 1);
    
    updateCalendarNavButtons(month);
}

function generateMonth(container, label, year, month) {
    const tempDate = new Date(year, month, 1);
    label.textContent = tempDate.toLocaleString('ru', { month: 'long', year: 'numeric' });
    
    container.innerHTML = ''; // Очищаем контейнер перед заполнением
    
    const daysOfWeek = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    
    // Добавляем заголовки дней недели
    daysOfWeek.forEach(day => {
        let dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('calendar-daysOfWeek');
        container.appendChild(dayDiv);
    });
    
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0) ? 6 : firstDay - 1;
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Добавляем дни из предыдущего месяца
    for (let i = firstDay; i > 0; i--) {
        let div = document.createElement('div');
        div.textContent = daysInPrevMonth - i + 1;
        div.style.opacity = '0.5';
        div.classList.add('prev-month');
        container.appendChild(div);
    }
    
    // Добавляем дни текущего месяца
    for (let i = 1; i <= daysInMonth; i++) {
        let div = document.createElement('div');
        div.textContent = i;
        div.classList.add('current-month');
        div.addEventListener('click', () => {
            selectedDate = new Date(year, month, i);
            dateDisplay.textContent = selectedDate.toLocaleDateString('ru');
            calendarModalWindow.classList.remove('active');
            selectedMonth = selectedDate.getMonth(); // Теперь точно обновляет по факту выбранной даты
            selectedDay = i; // Обновляем выбранный день
            renderCalendar(selectedDate); // Перерисовываем календарь с выбранным днем
            throttledGeneratePreview()
        });
        container.appendChild(div);
        
        // Подсветим текущий день
        if (year === new Date().getFullYear() && month === new Date().getMonth() && i === new Date().getDate()) {
            div.classList.add('currentDay');
        }
        
        // Подсветим выбранный день, если месяц совпадает с отображаемым в календаре
        if (shouldHighlightSelectedDay(year, month, i)) {
            div.classList.add('selectedCurrentDay');
        }
    }
}

function shouldHighlightSelectedDay(year, month, day) {
  const dateStr = dateDisplay.textContent.trim();

  if (dateStr.startsWith('__')) {
      return false; // Если это "__", не подсвечиваем выбранный день
  }

  // Разбираем строку даты вручную
  const [dayDisplay, monthDisplay, yearDisplay] = dateStr.split('.').map(Number);
  const displayDate = new Date(yearDisplay, monthDisplay - 1, dayDisplay);

  return displayDate.getFullYear() === year && displayDate.getMonth() === month && displayDate.getDate() === day;
}

function updateCalendarNavButtons(currentMonth) {
  const currentYear = new Date().getFullYear();
  const selectedDateParts = dateDisplay.textContent.trim().split('.');
  const selectedDay = parseInt(selectedDateParts[0], 10);
  const selectedMonthFromDate = parseInt(selectedDateParts[1], 10) - 1; // Индексация месяцев в JS с 0
  const selectedYear = parseInt(selectedDateParts[2], 10);

  monthButtons.forEach(button => {
      const monthIndex = parseInt(button.textContent, 10) - 1; // Преобразуем текст кнопки в номер месяца

      // Убираем старые классы
      button.classList.remove('calendar-nav-currentMonth', 'calendar-nav-showingMonth', 'calendar-nav-showingMonth-selectedDay');

      // Подсвечиваем текущий месяц (где системная дата)
      if (monthIndex === new Date().getMonth() && currentYear === new Date().getFullYear()) {
          button.classList.add('calendar-nav-currentMonth');
      }

      // Подсвечиваем отображаемый в календаре месяц
      if (monthIndex === currentMonth) {
          button.classList.add('calendar-nav-showingMonth');
      }

      // Подсвечиваем месяц, который совпадает с месяцем выбранной даты в `#dateDisplay`
      if (monthIndex === selectedMonthFromDate && selectedYear) {
          button.classList.add('calendar-nav-showingMonth-selectedDay');
      }
  });
}

dateDisplay.addEventListener('click', () => {
    calendarModalWindow.classList.toggle('active');
    renderCalendar(selectedDate);
    const pdfForm = document.getElementById("pdf-form")
    const preview = document.querySelector(".preview")
    if(pdfForm && preview){
      pdfForm.setAttribute("inert", true)
      preview.setAttribute("inert", true)
    }
    function setupCalendarModal() {
      const calendarModalWindow = document.getElementById('calendarModalWindow');
      
      if (!calendarModalWindow || !calendar) return;
      
      calendarModalWindow.addEventListener('click', (event) => {
          if (!calendar.contains(event.target)) {
              calendarModalWindow.classList.remove("active")
          }
          if(pdfForm && preview){
            pdfForm.removeAttribute("inert")
            preview.removeAttribute("inert")
          }
      });
    }
    setupCalendarModal()
});

dateDisplay.addEventListener("click", (event) => {
  if (!document.getElementById("calendar").contains(event.target)) {
      renderCalendar(selectedDate);
  }
});

todayBtn.addEventListener('click', () => {
    selectedDate = new Date();
    dateDisplay.textContent = selectedDate.toLocaleDateString('ru');
    calendarModalWindow.classList.remove('active');
    selectedMonth = selectedDate.getMonth(); // Обновляем выбранный месяц
    selectedDay = selectedDate.getDate(); // Обновляем выбранный день
    renderCalendar(selectedDate); // Перерисовываем календарь с сегодняшним днем
    throttledGeneratePreview()
});

tomorrowBtn.addEventListener('click', () => {
    selectedDate = new Date();
    selectedDate.setDate(selectedDate.getDate() + 1);
    dateDisplay.textContent = selectedDate.toLocaleDateString('ru');
    calendarModalWindow.classList.remove('active');
    selectedMonth = selectedDate.getMonth(); // Обновляем выбранный месяц
    selectedDay = selectedDate.getDate(); // Обновляем выбранный день
    renderCalendar(selectedDate); // Перерисовываем календарь с завтрашним днем
    throttledGeneratePreview()
});

noDayBtn.addEventListener('click', () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    dateDisplay.textContent = `___.${month}.${year}`;
    calendarModalWindow.classList.remove('active');
    renderCalendar(selectedDate); // Перерисовываем календарь
    throttledGeneratePreview()
});

prevMonth.addEventListener('click', () => {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    selectedMonth = selectedDate.getMonth(); // Обновляем выбранный месяц
    renderCalendar(selectedDate);
});

nextMonth.addEventListener('click', () => {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    selectedMonth = selectedDate.getMonth(); // Обновляем выбранный месяц
    renderCalendar(selectedDate);
});

monthButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        const monthIndex = parseInt(event.target.textContent, 10) - 1;
        selectedDate.setMonth(monthIndex);
        selectedMonth = monthIndex; // Обновляем выбранный месяц
        renderCalendar(selectedDate);
    });
});


//~ Календарь END

//~ Анимация превью при загрузке страницы
const previewWelcomeMessageIcon = document.querySelector(".previewWelcomeMessage-icon");

if (previewWelcomeMessageIcon) {
  const changingHourglassIcon = setInterval(() => {
    previewWelcomeMessageIcon.innerHTML = "<i class=\"fa-solid fa-hourglass-start\"></i>";
    setTimeout(() => {
      previewWelcomeMessageIcon.innerHTML = "<i class=\"fa-solid fa-hourglass-half\"></i>";
    }, 300);
    setTimeout(() => {
      previewWelcomeMessageIcon.innerHTML = "<i class=\"fa-solid fa-hourglass-end\"></i>";
    }, 600);
  }, 900);

} else {
  if (changingHourglassIcon) {
    clearInterval(changingHourglassIcon);
  }
}

//~ Анимация превью при загрузке страницы END

let localBlob

let history = [""];
let historyIndex = 0;
const allOrders = document.querySelector(".allOrders");
const lineNumbers = document.querySelector("#line-numbers");
const undoBtn = document.getElementById("textareaUndo-btn");
const redoBtn = document.getElementById("textareaRedo-btn");
const clearBtn = document.getElementById("clearAllEmptyLines-btn");

function saveToHistory() {
  if (history[historyIndex] !== allOrders.value) {
    history = history.slice(0, historyIndex + 1);
    history.push(allOrders.value);
    historyIndex++;
  }
}

function updateLineNumbers() {
  const lines = allOrders.value.split("\n");
  lineNumbers.innerHTML = lines.map((line, i) => 
    line.trim() === "" ? '<div class="empty-line">×</div>' : `<div>${i + 1}</div>`
  ).join("");
}

allOrders.addEventListener("input", () => {
  saveToHistory();
  updateLineNumbers();
});

clearBtn.addEventListener("click", (event) => {
  event.preventDefault();
  allOrders.value = allOrders.value
    .split("\n")
    .filter(line => line.trim() !== "")
    .join("\n");
  updateLineNumbers();
  saveToHistory();
});

undoBtn.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--;
    allOrders.value = history[historyIndex];
    allOrders.dispatchEvent(new Event("input", { bubbles: true }));
    throttledGeneratePreview();
  }
});

redoBtn.addEventListener("click", () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    allOrders.value = history[historyIndex];
    allOrders.dispatchEvent(new Event("input", { bubbles: true }));
    throttledGeneratePreview();
  }
});

updateLineNumbers();

document.getElementById("allSelect-btn").addEventListener("click", (event) => {
  event.preventDefault();
  let allOrders = document.querySelector(".allOrders");
  if (allOrders) {
    allOrders.select();
  }
});

document.getElementById("clearAll-btn").addEventListener("click", (event) => {
  event.preventDefault();
  const allOrders = document.querySelector(".allOrders");
  allOrders.value = "";
  allOrders.dispatchEvent(new Event("input", { bubbles: true }));
  allOrders.focus();
  document.querySelector("#line-numbers").innerHTML = "<div>1</div>";
  formatingAnimation();
  throttledGeneratePreview();
});

document.getElementById("clearAllEmptyLines-btn").addEventListener("click", (event) => {
  event.preventDefault();
  let allOrders = document.querySelector(".allOrders");
  if (allOrders) {
    allOrders.value = allOrders.value
      .split("\n")
      .filter(line => line.trim() !== "")
      .join("\n");
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Увеличение скролом
document.querySelector("#canvasContainer").addEventListener("wheel", function(event) {
  if (event.ctrlKey) {
    event.preventDefault();
    const canvases = this.querySelectorAll("canvas");

    canvases.forEach(canvas => {
      let currentWidth = parseFloat(getComputedStyle(canvas).width);
      let newWidth = currentWidth * (event.deltaY > 0 ? 0.94 : 1.06);
      newWidth = Math.max(298, Math.min(newWidth, 850));
      canvas.style.width = `${newWidth}px`;
    });

    let scalePercent = Math.round((parseFloat(getComputedStyle(canvases[0]).width) / 595) * 100);
    if (scalePercent === 96 || scalePercent === 104) {
      scalePercent = 100;
    }
    document.querySelector(".scalePersent").textContent = `${scalePercent}%`;
  }
});

const canvasContainer = document.getElementById("canvasContainer");

if (canvasContainer) {
  const observer = new MutationObserver(() => {
    const previewScaleMinusBtn = document.querySelector(".previewScale-minus-btn");
    const previewScalePlusBtn = document.querySelector(".previewScale-plus-btn");

    if (previewScaleMinusBtn && !previewScaleMinusBtn.dataset.listenerAdded) {
      previewScaleMinusBtn.dataset.listenerAdded = "true";
      previewScaleMinusBtn.addEventListener("click", () => {
        updateCanvasScale(0.94);
      });
    }

    if (previewScalePlusBtn && !previewScalePlusBtn.dataset.listenerAdded) {
      previewScalePlusBtn.dataset.listenerAdded = "true";
      previewScalePlusBtn.addEventListener("click", () => {
        updateCanvasScale(1.06);
      });
    }
  });

  observer.observe(canvasContainer, { childList: true, subtree: true });
} else {
}

function updateCanvasScale(scaleFactor) {
  const canvases = document.querySelectorAll("#canvasContainer canvas");
  if (canvases.length === 0) {
    return;
  }

  canvases.forEach(canvas => {
    let currentWidth = parseFloat(getComputedStyle(canvas).width);
    let newWidth = currentWidth * scaleFactor;
    newWidth = Math.max(250, Math.min(newWidth, 850)); // Ограничения

    canvas.style.width = `${newWidth}px`;
  });

  let scalePercent = Math.round((parseFloat(getComputedStyle(canvases[0]).width) / 595) * 100);
  if (scalePercent === 96 || scalePercent === 104) scalePercent = 100;

  const scalePersentText = document.querySelector(".scalePersent");
  if (scalePersentText) {
    scalePersentText.textContent = `${scalePercent}%`;
  }
}

document.getElementById("pdf-form").addEventListener("submit", function (event) {
  event.preventDefault();
  
  if (event.submitter && document.getElementById("calendar").contains(event.submitter)) {
    return;
  }else if(document.getElementById("disableTooltip")){
    return;
  }

  formatingAnimation();
  throttledGeneratePreview();
});


//~ Анимация генерации документа в DASHBOARD
function formatingAnimation() {
  const checkForloaderContainer = document.querySelector('.loaderContainer')
  const dashboardIcon = document.querySelector('.textAreaDashboard > i')
  const dashboardIconEND = document.querySelector('.textAreaDashboard > i.fa-check')
  const statusFinishIcon = document.querySelector('.statusFinishIcon')
  const dashboardInfoText = document.querySelector('.dashboardInfoText');
  containerCanvas_highlightColor = "#00dcff"
  if (dashboardInfoText) {
    dashboardInfoText.classList.add("generating");
  } else {
    console.warn("Элемент .dashboardInfoText не найден!");
  }
  if (!checkForloaderContainer) {
    const canvasContainer = document.getElementById("canvasContainer");
    canvasContainer.scrollTo(0, 0)
    canvasContainer.style.overflowY = "hidden"
    
    const loaderContainer = document.createElement("div");
    loaderContainer.classList.add("loaderContainer")
    const loaderContainerText = document.createElement("div");
    loaderContainerText.classList.add("loaderContainerText")
    loaderContainerText.innerText = "Формирование документа"
    
    const loaderContainerTextSpan = document.createElement("span");
    loaderContainerText.classList.add("loaderContainerTextSpan")
    loaderContainerTextSpan.innerText = ""
    let dots = 0;
    setInterval(() => {
      loaderContainerTextSpan.innerText = ".".repeat(dots);
      dots = (dots + 1) % 4;
    }, 150);
    
    loaderContainerText.appendChild(loaderContainerTextSpan);
    loaderContainer.appendChild(loaderContainerText);
    
    const loadingCircle = document.createElement("div");
    loadingCircle.classList.add("loaderContainerCircle")
    const loaderContainerIcon = document.createElement("i")
    loaderContainerIcon.classList.add("loaderContainerIcon", "fa-solid", "fa-file", "fa-beat-fade")
    
    loaderContainer.appendChild(loaderContainerIcon);
    loaderContainer.appendChild(loadingCircle);
    canvasContainer.appendChild(loaderContainer);
    
  } else if (dashboardIcon) {
    dashboardIcon.remove();
    
    const statusFinishIcon = document.createElement("span");
    statusFinishIcon.classList.add("statusFinishIcon");
    statusFinishIcon.style.setProperty("--statusDanceColor", "0, 220, 255");
    const textAreaDashboard = document.querySelector(".textAreaDashboard");
    if (textAreaDashboard) {
      textAreaDashboard.insertBefore(statusFinishIcon, textAreaDashboard.firstChild);
    }


  } else if (statusFinishIcon) {
    statusFinishIcon.style.setProperty("--statusDanceColor", "0, 220, 255");
    
  } else if (dashboardIconEND) {
    statusFinishIcon.remove();
  }
}
//~ Анимация генерации документа в DASHBOARD

//~ Сбор данных из textarea и заполнение их в order-row 
function getDataAndMakeOrderRow(){

  let setcionNumber = 1;
  const textarea = document.querySelector('.allOrders');
  const lineNumbersDiv = document.getElementById('line-numbers');

  const lineNumber = textarea.value.split('\n');
  let lineNumbers = '';
  let number = 1;

  lineNumber.forEach((line, index) => {
      if (line.trim() !== '') {
          lineNumbers += `<div>${number}</div>`;
          number++;
      } else {
          lineNumbers += `<div class="empty-line">×</div>`;
      }
  });

  lineNumbersDiv.innerHTML = lineNumbers;

  // Синхронизация скролла
  textarea.addEventListener('scroll', () => {
      lineNumbersDiv.scrollTop = textarea.scrollTop;
  });

  // Подсветка активной строки
  function highlightActiveLine() {
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const currentLineIndex = textBeforeCursor.split("\n").length - 1;

      // Убираем старую подсветку
      document.querySelectorAll(".line-highlight").forEach(el => el.classList.remove("line-highlight"));

      // Подсвечиваем строку в номерах
      const lineNumbers = lineNumbersDiv.querySelectorAll("div");
      if (lineNumbers[currentLineIndex]) {
          lineNumbers[currentLineIndex].classList.add("line-highlight");
      }
  }
  textarea.addEventListener("keyup", highlightActiveLine);
  textarea.addEventListener("click", highlightActiveLine);

  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const textarea = document.querySelector(".allOrders");
    const lineNumbersDiv = document.getElementById("line-numbers");
    const lineNumbers = lineNumbersDiv.querySelectorAll("div");

    const start = textarea.selectionStart;
    let end = textarea.selectionEnd;

    const textBeforeStart = textarea.value.substring(0, start);
    const textBeforeEnd = textarea.value.substring(0, end);

    let startLine = textBeforeStart.split("\n").length - 1;
    let endLine = textBeforeEnd.split("\n").length - 1;

    // Если `selectionEnd` стоит в начале строки, уменьшаем `endLine`
    if (end > 0 && textarea.value[end - 1] === '\n') {
        endLine--;
    }

    lineNumbers.forEach((line, index) => {
        if (index >= startLine && index <= endLine) {
            line.classList.add("line-selected");
        } else {
            line.classList.remove("line-selected");
        }
    });
});

document.addEventListener("click", (event) => {
  const textarea = document.querySelector(".allOrders");
  const lineNumbersDiv = document.getElementById("line-numbers");
  const scaleButtons = document.querySelectorAll(".previewScale-btn");

  // Если клик был по одной из кнопок масштаба — ничего не делаем
  if ([...scaleButtons].some(btn => btn.contains(event.target))) {
    return;
  }

  if (!textarea.contains(event.target) && !lineNumbersDiv.contains(event.target)) {
    document.querySelectorAll(".line-selected").forEach(el => el.classList.remove("line-selected"));
  }
});



  const ordersContainer = document.getElementById("orders-container");
  const lines = event.target.value
      .split('\n')
      .map(line => line.trim().replace(/\s+/g, ' '))
      .filter(line => line.length > 0);

  ordersContainer.innerHTML = '';

  lines.forEach((line, index) => {
      line = line.replace(/[()]/g, '');
      const parts = line.split(' ').filter(part => part.length > 0);

      let orderNumber = '';
      let cargoCode = '';
      let anomalyDescription = '';
      let orderType = '—'
      let oneRow = false;

      if(currentRappGeneratorType === 1){
        //~ МАГИСТРАЛИ • МАГИСТАРЛИ • МАГИСТАРЛИ 
        if (parts.length > 0) {
          const firstPart = parts[0];

          if (parts.length > 1 && parts[1].startsWith('LO-')) {
              cargoCode = parts[0];
              orderNumber = parts[1];
              oneRow = false;
          }else if (firstPart.startsWith('LO-')) {
              orderNumber = firstPart;
              cargoCode = parts.slice(1).join(' ');
              oneRow = false;
          }else if (firstPart.startsWith('F0254')) {
              cargoCode = firstPart;
              orderNumber = parts.slice(1).join(' ');
              oneRow = false;
          }else if (firstPart.startsWith('0')) {
              cargoCode = parts[0];
              orderNumber = parts.slice(1).join(' ');
              oneRow = false;
          }else if (firstPart.startsWith('72')) {
              cargoCode = parts[0];
              orderNumber = parts.slice(1).join(' ');
              oneRow = false;
          }else if (firstPart.startsWith('YP')) {
              cargoCode = firstPart;
              orderNumber = parts.slice(1).join(' ');
              oneRow = false;
          }else if (firstPart.startsWith('F1254') || firstPart.startsWith('VOZ') || firstPart.startsWith('PVZ') || firstPart.startsWith('FBS') || firstPart.startsWith('FBY')) {
              orderNumber = firstPart;
              cargoCode = '';
              oneRow = true;
          }else if( firstPart.startsWith('FA254')){
            orderNumber = firstPart;
            cargoCode = 'Аномалия';
            oneRow = false;
          }else if( firstPart.startsWith('F3000000000')){
            orderNumber = firstPart;
            cargoCode = 'Полибокс';
            oneRow = false;
          }else if (/^\d{9,}-\d+$/.test(firstPart)) {
              cargoCode = firstPart;
              orderNumber = firstPart.split('-')[0];
              oneRow = false;
          }else {
              orderNumber = parts[0] || '';
              cargoCode = parts.slice(1).join(' ') || '';
              oneRow = false;
          }
      }
    }
    if (currentRappGeneratorType === 4) {
      //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
      if (parts.length > 1 && parts[1].startsWith('FA254')) {
          orderNumber = parts[0] || '';
          cargoCode = parts.length > 1 ? parts[1] : '';
  
          if (cargoCode.includes(' ')) {
              let cargoParts = cargoCode.split(' ');
              cargoCode = cargoParts[0]; // Берем только первую часть
              anomalyDescription = cargoParts.slice(1).join(' '); // Остальное уходит в anomalyDescription
          } else {
              anomalyDescription = parts.length > 2 ? parts.slice(2).join(' ') : '';
          }
      } else {
          orderNumber = parts[0] || '';
          cargoCode = parts.slice(1).join(' ') || '';
  
          if (cargoCode.includes(' ')) {
              let cargoParts = cargoCode.split(' ');
              cargoCode = cargoParts[0]; // Оставляем первую часть в cargoCode
              anomalyDescription = cargoParts.slice(1).join(' '); // Остальное в anomalyDescription
          }
      }
  
      // Удаляем все виды кавычек из anomalyDescription
      anomalyDescription = anomalyDescription.replace(/["'`]/g, '');
  }else if (currentRappGeneratorType === 5) {
      const firstPart = parts[0];
  
      if (firstPart.startsWith('YP') || firstPart.startsWith('P0')) {
          orderNumber = "—";
          cargoCode = firstPart; // Текст, начинающийся с YP

          if (parts.length > 1) {
              const lowerText = parts[1].toLowerCase();
              if (lowerText.includes("дубль") || lowerText.includes("le,km")) {
                orderType = "Дубль";
            } else if (lowerText.includes("lost") || lowerText.includes("дщые")) {
                orderType = "LOST";
            } else if (lowerText.includes("засыл") || lowerText.includes("pfcsk")) {
                orderType = "Засыл";
            } else if (lowerText.includes("невыкуп") || lowerText.includes("ytdsreg")) {
                orderType = "Невыкуп";
            } else {
                orderType = "Неизвестно"; // Если тип не найден
            }
          }
          oneRow = false;
      } else if (parts.length > 1 && parts[1].startsWith('LO-')) {
          cargoCode = parts[0];
          orderNumber = parts[1];
          oneRow = false;
      } else if (firstPart.startsWith('LO-')) {
          orderNumber = firstPart;
          cargoCode = parts.slice(1).join(' ').split(' ')[0]; // Только первая часть после пробела
          oneRow = false;
      } else if (firstPart.startsWith('FA254')) {
          orderNumber = firstPart;
          cargoCode = 'Аномалия';
          orderType = "LOST";
          oneRow = false;
      }else if (/^\d{9,}-\d+$/.test(firstPart)) {
        cargoCode = firstPart;
        orderNumber = firstPart.split('-')[0];
        oneRow = false;
      }else {
          orderNumber = parts[0] || '';
          cargoCode = parts.slice(1).join(' ').split(' ')[0] || ''; // Только первая часть после пробела
          oneRow = false;
      }
  
      // Автоопределение типа грузоместа
      const lowerText = line.toLowerCase();
      if (lowerText.includes("дубль") || lowerText.includes("le,km") || lowerText.includes("дубль") || lowerText.includes("dubll") || lowerText.includes("dubl") || lowerText.includes("duble")) {
        orderType = "Дубль";
    } else if (lowerText.includes("lost") || lowerText.includes("лост") || lowerText.includes("лос") || lowerText.includes("дщые") || lowerText.includes("лсот") || lowerText.includes("лост") || lowerText.includes("лоcт") || lowerText.includes("loost")) {
        orderType = "LOST";
    } else if (lowerText.includes("засыл") || lowerText.includes("pfcsk") || lowerText.includes("зсыл") || lowerText.includes("засил") || lowerText.includes("засыль") || lowerText.includes("зссыл") || lowerText.includes("зсы") || lowerText.includes("зслы") || lowerText.includes("звсыл")) {
        orderType = "Засыл";
    } else if (lowerText.includes("невыкуп") || lowerText.includes("ytdsreg") || lowerText.includes("невкуп") || lowerText.includes("ytdsrb")) {
      orderType = "Невыпкуп";
  }      
  }
  
    
      const newOrderRow = document.createElement("div");
      newOrderRow.classList.add("order-row");

      newOrderRow.innerHTML = `
      <div class="orderRowNumber">${setcionNumber++}</div>

      <div class="orderData-container">
        <input
        type="text"
        class="orderData-input"
        id="orderNumber${index + 1}"
        value="${orderNumber}"
        placeholder="${
          currentRappGeneratorType === 1 || 5
          ?
          'Введите номер отправления'
          :
          currentRappGeneratorType === 4 
          ?
          'Номер аномалии'
          :
          'Что-то сломлось'
        }"
        required autocomplete="off">

        <label
        for="orderNumber${index + 1}"
        class="orderData-label">
        ${
          currentRappGeneratorType === 1 || 5
          ?
          'Номер отправления'
          :
          currentRappGeneratorType === 4 
          ?
          'Номер аномалии'
          :
          'Что-то сломлось'
        }
        </label>
      </div>
      <button type="button" class="switchCargo pegasusTooltip" title="Поменять местами">
        <i class="fa-solid fa-arrows-repeat"></i>
      </button>

      <div class="orderData-container">
        <input
          type="text"
          class="orderData-input cargoGroup"
          id="cargoCode${index + 1}"
          value="${cargoCode}"
          placeholder="${
            currentRappGeneratorType === 1 || 5
            ?
            'Код грузоместа' :
            currentRappGeneratorType === 4 
            ?
            'Тикет аномалии' 
            :
            'Что-то сломлось'
          }"
          ${oneRow === true ? 'disabled' : ''}
          autocomplete="off"
        >
        <label
          for="cargoCode${index + 1}"
          class="orderData-label">
          ${
            currentRappGeneratorType === 1 || 5
            ?
            'Код грузоместа' 
            :
            currentRappGeneratorType === 4 
            ?
            'Тикет аномалии' 
            :
            'Что-то сломлось'
          }
        </label>
        
        ${
          currentRappGeneratorType === 4
            ? ''
            : 
            (oneRow === true
                ? 
                (currentRappGeneratorType === 1
                    ? 
                    `<button type="button" class="no-cargo buttonAutoDisabled"><i class="fa-solid fa-eye"></i></button>`
                    : 
                    `<button type="button" class="no-cargo"><i class="fa-solid fa-eye-slash"></i></button>`)
                : 
                `<button type="button" class="no-cargo"><i class="fa-solid fa-eye-slash"></i></button>`)
        }
      </div>

   

      ${
        currentRappGeneratorType === 4
        ?
        `<div class="orderData-container anomalyDescription-container">
          <input
          type="text"
          class="orderData-input"
          id="anomalyDescription${index + 1}"
          value="${anomalyDescription}"
          placeholder="Описание Аномалии"
          required autocomplete="off">
          <label
          for="anomalyDescription${index + 1}"
          class="orderData-label">
            Описание Аномалии
          </label>
        </div>`
        :
        currentRappGeneratorType === 5
        ?
        `
        <div class="orderData-container">
          <label class="orderType" for="selectOrderType${index + 1}">
              <h1>Тип грузоместа:</h1>
              <select class="selectListener" id="selectOrderType${index + 1}">
                  <option value="Засыл" ${orderType === "Засыл" ? 'selected' : ''}>Засыл</option>
                  <option value="Дубль" ${orderType === "Дубль" ? 'selected' : ''}>Дубль</option>
                  <option value="LOST" ${orderType === "LOST" ? 'selected' : ''}>LOST</option>
                  <option value="Невыкуп" ${orderType === "Невыкуп" ? 'selected' : ''}>Невыкуп</option>
                  <option value="—" ${orderType === "—" ? 'selected' : ''}>—</option>
              </select>
          </label>
        </div>`
        :
        ``
      }

      <div class="orderData-container">
        <input type="number" class="orderData-input orderData-inputCount" id="cargoCount${index + 1}" placeholder="Введите количество" value="1" autocomplete="off" min="1">
        <label for="cargoCount${index + 1}" class="orderData-label">Кол-во:</label>
      </div>

        ${currentRappGeneratorType === 1 && Math.random() < 0.01
        ?
        `
        <div class="orderData-container">
          <input
            type="text"
            class="orderData-input"
            id="orderNumber${index + 1}"
            value="Ильяшенко - клоун 🤡"
            placeholder="Ильяшенко - клоун 🤡"
            required
            readonly
            autocomplete="off">
      
          <label
            for="orderNumber${index + 1}"
            class="orderData-label">
            Чистая правда:
          </label>
        </div>
        `
        :
        `` 
      }   
      `;

      ordersContainer.appendChild(newOrderRow);

      newOrderRow.querySelectorAll(".orderData-container .no-cargo").forEach(button => {
        button.addEventListener("click", function () {
          this.classList.remove('buttonAutoDisabled')
          const container = this.closest(".orderData-container"); // Находим ближайший контейнер
          const cargoInput = container.querySelector(".orderData-input"); // Находим input в этом контейнере
          const icon = this.querySelector("i"); // Находим иконку внутри кнопки
    
          cargoInput.disabled = !cargoInput.disabled; // Переключаем disabled у input
    
          // Переключаем классы иконки
          icon.classList.toggle("fa-eye-slash", !cargoInput.disabled);
          icon.classList.toggle("fa-eye", cargoInput.disabled);
          throttledGeneratePreview()
        });
      });

      newOrderRow.querySelectorAll("input").forEach(input => {
          input.addEventListener("input", throttledGeneratePreview);
      });
  });

  document.querySelectorAll(".order-row").forEach(row => {
      row.querySelectorAll(".switchCargo").forEach(button => {
          button.addEventListener("click", function () {
              const orderInput = row.querySelector('input[id^="orderNumber"]');
              const cargoInput = row.querySelector('input[id^="cargoCode"]');
              if (!cargoInput.disabled) { // Меняем местами, если поле не заблокировано
                  [orderInput.value, cargoInput.value] = [cargoInput.value, orderInput.value];
                  throttledGeneratePreview()
              }
          });
      });
  });

throttledGeneratePreview()

}
//~ Сбор данных из textarea и заполнение их в order-row END

//~ Слушатель событий в TEXTAREA
document.querySelector("textarea.allOrders").addEventListener("input", function (event) {
  getDataAndMakeOrderRow(event);
});
//~ Слушатель событий в TEXTAREA END

//~ Пересоздать файл

const reGenerateDocument = document.querySelector(".reGenerateDocument")
reGenerateDocument.addEventListener('click', ()=>{
  throttledGeneratePreview()
})

//~ Пересоздать файл END


let timeout;
function throttledGeneratePreview() {
    clearTimeout(timeout);
    formatingAnimation()
    timeout = setTimeout(() => {
        generatePreview();
    }, 2000);
}

document.querySelectorAll(".orderData-container .no-cargo").forEach(button => {
  button.addEventListener("click", function () {
    this.classList.remove('buttonAutoDisabled')
    const container = this.closest(".orderData-container"); // Находим ближайший контейнер
    const cargoInput = container.querySelector(".orderData-input"); // Находим input в этом контейнере
    const icon = this.querySelector("i"); // Находим иконку внутри кнопки

    cargoInput.disabled = !cargoInput.disabled; // Переключаем disabled у input

    // Переключаем классы иконки
    icon.classList.toggle("fa-eye-slash", !cargoInput.disabled);
    icon.classList.toggle("fa-eye", cargoInput.disabled);
  });
});

// Обработчики изменений
document.getElementById("recipient").addEventListener("change", throttledGeneratePreview);
document.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", throttledGeneratePreview);
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    attachSelectListeners();
  });

  const ordersContainer = document.querySelector("#orders-container");
  if (ordersContainer) {
    observer.observe(ordersContainer, { childList: true, subtree: true });
  } else {
    console.warn("Контейнер #orders-container не найден.");
  }

  function attachSelectListeners() {
    const selectElements = document.querySelectorAll(".selectListener");

    if (selectElements.length === 0) {
      console.warn("Элементы с классом .selectListener не найдены.");
      return;
    }

    selectElements.forEach(option => {
      if (!option.dataset.listenerAttached) { // Чтобы не вешать обработчики повторно
        option.dataset.listenerAttached = "true";
        option.addEventListener("change", () => {
          if (typeof throttledGeneratePreview === "function") {
            throttledGeneratePreview();
          } else {
            console.error("Функция throttledGeneratePreview не найдена!");
          }
        });
      }
    });
  }

  attachSelectListeners(); // Вызываем сразу, если элементы уже есть
});


function getDateToday(){
  const today = new Date().toLocaleDateString();
  document.getElementById("dateDisplay").innerText = today;
  throttledGeneratePreview()
}
getDateToday()

// Основная функция генерации PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Настройка шрифта
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  // Получение данных формы
  const sender = document.getElementById("sender").value;
  const recipient = document.getElementById("recipient").value;
  // const actNumber = document.getElementById("actNumber");
  // let actNumber_data = null;
  // actNumber.value =
  const date = document.getElementById("dateDisplay").innerText;

  const actNumber = document.getElementById("actNumber");
  const typeMap = { 1: "m", 2: "c", 3: "s", 4: "a", 5: "z" };
  const randomString = Array.from({ length: 8 }, () => 
    Math.random() < 0.5 
      ? String.fromCharCode(48 + Math.floor(Math.random() * 10))
      : String.fromCharCode(65 + Math.floor(Math.random() * 26) + (Math.random() < 0.5 ? 32 : 0))).join("");
  let actNumber_data = `iRDG-${typeMap[currentRappGeneratorType] || "e"}:${randomString}`;
  actNumber.value = actNumber_data;

  // Адреса получателей
  const recipientAddresses = {
    "СЦ Домодедово ЕВСЦ": "Микрорайон Белые Столбы, д. владение Склады 104, стр. 6/1",
    "СЦ Яндекс Маркет Софьино ФФЦ": "Московская область, территория Логистический технопарк Софьино, Раменский городской округ, дом к1, строение 3/1",
    "СЦ Яндекс Маркет Софьино Суперсклад": "Московская область, территория Логистический технопарк Софьино, Раменский городской округ, дом 2/1",
    "СЦ Яндекс Маркет Софьино КГТ": "Московская область, Раменский городской округ, территория Логистический технопарк Софьино, с4",
    "СЦ Тарный (Тарный Дропофф)": "г. Москва, Промышленная, дом 12A",
    "СЦ Липецк" : "Липецкая область, городской округ Липецк, Липецк, Базарная улица, д. уч3А",
    "СЦ Курск" : "Курская область, городской округ Курск, Курск, проспект Ленинского Комсомола, д. 49",
    "СЦ Белгород" : "Белгородская область, муниципальное образование Белгород, Белгород, улица Мичурина, д. 104",
    "СЦ Ростов": "Ростовская область, Новочеркасское шоссе, Аксайский район, дом 111, корпус 2",
    "СЦ Краснодар": "Краснодар, Краснодарский край, Подсолнечная улица, д. 44",
    "Ростов КГТ": "улица Логопарк, 5, Ростовская область, Аксайский район",
    "СЦ Строгино": "г. Москва, ул. 2-я Лыковская, д. 63, стр. 6.",
    "СЦ Дзержинский": "Московская область, Садовая улица, городской округ Дзержинский, дом 6",
    "СЦ Троицкий": "г. Санкт-Петербург, Запорожская ул. , д.12",
    "СЦ Казань": "Республика Татарстан, Почтовая улица, Лаишевский район, дом 1",
    "СЦ Запад": "г. Москва, Бережковская набережная, 20с9",
    "СЦ Самара": "Смарская область, сельское поселение Верхняя Подстепновка, село Преображенка, Индустриальная улица, Волжский район, дом 1Б/1",
    "СЦ Грибки": "Ангарская ул., вл8с12, д. Грибки",
    "СЦ Ставрополь": "г. Ставрополь Старомарьевское шоссе 13/8",
    "СЦ Дмитровское": "г. Москва, Дмитровское шоссе, 157с12",
    "СЦ СПБ Бугры": "Ленинградская область, Всеволожский район, Бугровское городское поселение, КАД, 23-й километр, внутреннее кольцо, 3",
    "СЦ Ленинские горки": "Инновационный проезд, д. 7А",
    "СЦ Муром" : "Владимирская область, округ Муром, Муром, Владимирское шоссе, д9",
    "СЦ Челябинск" : "Челябинская область, городской округ Челябинск, Челябинск, улица Монтажников, д16",
    "СЦ Чебоксары" : "Чувашская республика, городской округ Чебоксары, Чебоксары, Гаражный проезд, д 3/1",
    "СЦ Ижевск" : "Удмуртская Республика, городской округ Ижевск, Ижевск, улица Пойма, д. 105",
    "СЦ Тюмень" : "Тюменская область, городской округ Тюмень, Тюмень, Коммунистическая улица, д 47, стр. 12",
    "СЦ Екатеринбург" : "Свердловская область, муниципальное образование Екатеринбург, Екатеринбург, Серовский тракт, 11-й километр, д. 5, стр. 1",
    "СЦ Набережные Челны" : "Республика Татарстан, городской округ Набережные Челны, Набережные Челны, Машиностроительная улица, д. 39",
    "СЦ Оренбург" : "Оренбургская область, городской округ Оренбург, Оренбург, Беляевская улица, д. 4",
    "СЦ Новосибирск" : "Новосибирская область, Тодмачёвский сельсовет, Производственно-складская зона, Производственно-складская зона, д. 7",
    "СЦ Барнаул" : "Алтайский край, муниципальное образование Барнаул, Барнаул, улица Чернышевского, д 293Б",
    "СЦ Вологда" : "Вологодская область, городской округ Вологда, Вологда, Ананьинский переулок, д. 14",
    "СЦ Смоленск" : "Смоленская область, муниципальное образование Смоленск, Смоленск, Краснинское шоссе, д. 27"
  };

  // Сбор данных о заказах
  const orders = [];
  let totalCargoCount = 0;
  
  document.querySelectorAll(".order-row").forEach((row, index) => {
    const orderNumber = row.querySelector(`#orderNumber${index + 1}`).value;
    const cargoCode = row.querySelector(`#cargoCode${index + 1}`).value;
    const anomalyDescriptionInit = row.querySelector(`#anomalyDescription${index + 1}`);
    const orderTypeInit = row.querySelector(`#selectOrderType${index + 1}`);
    let anomalyDescription = anomalyDescriptionInit ? anomalyDescriptionInit.value : null;
    let orderType = orderTypeInit ? orderTypeInit.value : "—";
    const cargoCount = parseInt(row.querySelector(`#cargoCount${index + 1}`).value);
    const isCargoDisabled = row.querySelector(`#cargoCode${index + 1}`).disabled;
    
    totalCargoCount += cargoCount;
  
    if(currentRappGeneratorType === 1){
      //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
      if (isCargoDisabled) {
        orders.push([
          { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
          { content: orderNumber, colSpan: 2, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
          { content: cargoCount.toString(), styles: { font: "Roboto" } }
        ]);
      }else {
        orders.push([
          { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
          { content: orderNumber, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
          { content: cargoCode, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
          { content: cargoCount.toString(), styles: { font: "Roboto" } }
        ]);
      }
    }else if(currentRappGeneratorType === 4){
      //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
      orders.push([
        { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
        { content: orderNumber, styles: { font: "Roboto", fontSize: 12, fontStyle: "bold" } },
        { content: cargoCode, styles: { font: "Roboto", fontSize: 12, fontStyle: "bold" } },
        { content: anomalyDescription, styles: { font: "Roboto", fontSize: 9, fontStyle: "bold" } },
        { content: cargoCount.toString(), styles: { font: "Roboto" } }
      ]);
    }else if(currentRappGeneratorType === 5){
      //~ ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST
      orders.push([
        { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
        { content: orderNumber, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
        { content: cargoCode, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
        { content: orderType, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
        { content: cargoCount.toString(), styles: { font: "Roboto" } }
      ]);
    }
  });
  // Строка "Итого"
  let totalRow = []
  if(currentRappGeneratorType === 1){
    //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
    totalRow = [
      { 
        content: "Итого:", 
        colSpan: 3,
        styles: { 
          font: "Roboto",
          halign: "left", // Выравнивание по левому краю
          valign: "middle", // Выравнивание по центру вертикально
          lineWidth: 0.25, // Граница для всей строки
          lineColor: [0, 0, 0], // Цвет границы
          fontSize: 12,
          fillColor: false
        }
      },
      { 
        content: totalCargoCount.toString(),
        styles: { 
          font: "Roboto",
          halign: "center", // Выравнивание по центру
          lineWidth: 0.25, // Граница для всей строки
          lineColor: [0, 0, 0] // Цвет границы
        }
      }
    ];
  }else if(currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ ○ ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST
    totalRow = [
      { 
        content: "Итого:", 
        colSpan: 4,
        styles: { 
          font: "Roboto",
          halign: "left", // Выравнивание по левому краю
          valign: "middle", // Выравнивание по центру вертикально
          lineWidth: 0.25, // Граница для всей строки
          lineColor: [0, 0, 0], // Цвет границы
          fontSize: 12,
          fillColor: false
        }
      },
      { 
        content: totalCargoCount.toString(),
        styles: { 
          font: "Roboto",
          halign: "center", // Выравнивание по центру
          lineWidth: 0.25, // Граница для всей строки
          lineColor: [0, 0, 0] // Цвет границы
        }
      }
    ];
  }

  // Стили таблицы
  let tableStyles = {};
  if(currentRappGeneratorType === 1){
    //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
    tableStyles = {
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontSize: 10,
        font: "Roboto",
        fontSize: 12,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        cellPadding: 2,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        font: "Roboto"
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Узкий столбец для № п/п
        1: { cellWidth: 82 },
        2: { cellWidth: 82 },
        3: { cellWidth: 25 }
      }
    }
  }else if(currentRappGeneratorType === 4){
    //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
    tableStyles = {
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontSize: 10,
        font: "Roboto",
        fontSize: 12,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        cellPadding: 2,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        font: "Roboto"
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Узкий столбец для № п/п
        1: { cellWidth: 55 },
        2: { cellWidth: 46 },
        3: { cellWidth: 65 },
        4: { cellWidth: 25 }
      }
    }
  }else if(currentRappGeneratorType === 5){
    //~ ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST
    tableStyles = {
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        fontSize: 10,
        font: "Roboto",
        fontSize: 12,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        halign: "center",
        valign: "middle",
      },
      bodyStyles: {
        halign: "center",
        valign: "middle",
        cellPadding: 2,
        lineWidth: 0.25,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        font: "Roboto"
      },
      columnStyles: {
        0: { cellWidth: 10 }, // Узкий столбец для № п/п
        1: { cellWidth: 65 },
        2: { cellWidth: 65 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 }
      }
    }
  }

  // Формирование документа
  doc.setFontSize(14);
  doc.text(`Акт приема-передачи №${actNumber.value} от ${date}`, 105, 40, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Отправитель: ${sender}`, 5, 65);
  doc.text("Адрес Отправителя: Воронежская область, Айдаровское сельское поселение, 2-я Промышленная зона, д. 27", 5, 70, { maxWidth: 190 });
  doc.text(`Получатель: ${recipient}`, 5, 90);
  doc.text(`Адрес получателя: ${recipientAddresses[recipient]}`, 5, 95, { maxWidth: 190 });
  doc.text("Заказчик: ООО «Яндекс»", 5, 110);
  doc.setFontSize(10);
  doc.text("Настоящий акт составлен о том, что в дату подписания настоящего Акта Получателем Отправитель передал, а Получатель принял следующие нижеуказанные Отправления (номера отправлений в соответствии с данными ПО СЦ)/грузоместа с визуальной проверкой целостности транспортной (если нет, то фирменной) упаковки, без проверки и пересчёта Отправлений:", 5, 115, { maxWidth: 190, fontSize: 10 });
  doc.setTextColor("#000");

  // Генерация таблицы
  if(currentRappGeneratorType === 1){
    //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
    doc.autoTable({
      startY: 135,
      head: [["№ п/п", "Номер отправления в системе заказчика", "Код грузоместа", "Кол-во грузомест"]],
      body: [...orders, totalRow],
      margin: { left: 5 },
      ...tableStyles,
      didParseCell: function(data) {
        if (data.row.index === orders.length) {
          // Применяем границы для строки "Итого"
          data.cell.styles.lineWidth = 0.25;
          data.cell.styles.lineColor = [0, 0, 0];
        }
      }
    });
  }else if(currentRappGeneratorType === 4){
    //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
    doc.autoTable({
      startY: 135,
      head: [["№ п/п", "Номер аномалии", "Тикет", "Описание", "Кол-во грузомест"]],
      body: [...orders, totalRow],
      margin: { left: 5 },
      ...tableStyles,
      didParseCell: function(data) {
        if (data.row.index === orders.length) {
          // Применяем границы для строки "Итого"
          data.cell.styles.lineWidth = 0.25;
          data.cell.styles.lineColor = [0, 0, 0];
        }
      }
    });
  }else if(currentRappGeneratorType === 5){
    //~ ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST
    doc.autoTable({
      startY: 135,
      head: [["№ п/п", "Номер отправления в системе заказчика", "Код грузоместа", "Тип грузоместа", "Кол-во грузомест"]],
      body: [...orders, totalRow],
      margin: { left: 5 },
      ...tableStyles,
      didParseCell: function(data) {
        if (data.row.index === orders.length) {
          // Применяем границы для строки "Итого"
          data.cell.styles.lineWidth = 0.25;
          data.cell.styles.lineColor = [0, 0, 0];
        }
      }
    });
  }

  // Подписи
  const finalY = doc.lastAutoTable.finalY + 5;
  doc.text("Передал Отправитель", 5, finalY);
  doc.text("_________________/_________________", 5, finalY + 14);
  doc.text("Принял Получатель", 135, finalY);
  doc.text("_________________/_________________", 135, finalY + 14);

  // Добавление нумерации страниц
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("Roboto");
    doc.text(
      `${i}/${pageCount}`, 
      doc.internal.pageSize.width - 5, 
      doc.internal.pageSize.height - 5, 
      { align: "right" }
    );
  }

  // Обновление превью
  
  const pdfBlob = doc.output("blob");

  // Создаём ссылку на Blob и выводим в консоль
  const blobUrl = URL.createObjectURL(pdfBlob);
  
  const pdfPrintLink = document.querySelector(".pdfPrint");
  if (pdfPrintLink) {
      pdfPrintLink.href = blobUrl;
      pdfPrintLink.target = "_blank";
  } else {
      console.error("Элемент <a id='pdfPrint'> не найден!");
  }

  
  
// Читаем Blob и передаём в PDF.js
const reader = new FileReader();
reader.onload = function () {
    renderPDF(new Uint8Array(reader.result)); // Теперь вызывается только один раз
};
reader.readAsArrayBuffer(pdfBlob);

}

//! START

let isRendering = false;
const reader = new FileReader();
reader.onload = function () {
    if (!isRendering) {
        isRendering = true;
        renderPDF(new Uint8Array(reader.result))
            .finally(() => {
                isRendering = false;
            });
    }
};
reader.readAsArrayBuffer(pdfBlob);

let generateRenderTime = 0;

async function renderPDF(pdfData) {
  containerCanvas_highlightColor = "#b3ff00"
  const pdfjsLib = window['pdfjsLib'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js';

  
  let statusFinishIcon = document.querySelector(".statusFinishIcon")
  if(statusFinishIcon){
    statusFinishIcon.style.setProperty("--statusDanceColor", "179, 255, 0");
  }

  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.innerHTML = `
          <div class="previewScaleControl">
          <div class="previewScaleControlContainer">
            <button class="previewScale-btn previewScale-minus-btn">
              <i class="fa-solid fa-minus"></i>
            </button>
            <p class="scalePersent">100%</p>
            <button class="previewScale-btn previewScale-plus-btn">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
  `;

  const renderedPages = new Set(); // Храним уже отрендеренные страницы

  // Создаем контейнер для загрузочного экрана
  const loaderContainer = document.createElement("div");
  loaderContainer.classList.add("loaderContainer");

  // Создаем текст "Рендер документа..."
  const loaderContainerText = document.createElement("div");
  loaderContainerText.classList.add("loaderContainerText", "loaderContainerTextRender");
  loaderContainerText.innerText = "Рендер документа";
  loaderContainer.appendChild(loaderContainerText);

  let dots = 0;
  const loadingInterval = setInterval(() => {
    loaderContainerText.innerText = "Рендер документа" + ".".repeat(dots);
    dots = (dots + 1) % 4;
  }, 150);

  // Создаем круг загрузки
  const loadingCircle = document.createElement("div");
  loadingCircle.classList.add("loaderContainerCircle", "loaderContainerCircleRender");
  const loaderContainerIcon = document.createElement("i");
  loaderContainerIcon.classList.add("loaderContainerIcon", "loaderContainerIconRender", "fa-solid", "fa-pen-ruler", "fa-beat-fade");

  loaderContainer.appendChild(loadingCircle);
  loaderContainer.appendChild(loaderContainerIcon);
  canvasContainer.appendChild(loaderContainer);

  // Скрываем все canvas в контейнере
  Array.from(canvasContainer.getElementsByTagName("canvas")).forEach(c => c.style.display = "none");
  canvasContainer.style.overflowY = "hidden";

  // Время начала отсчета
  const startTime = Date.now();

  for (let i = 1; i <= pdf.numPages; i++) {
    if (renderedPages.has(i)) continue;
    renderedPages.add(i);

    const page = await pdf.getPage(i);
    const scale = 1;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.display = "none"; // Прячем перед рендерингом

    canvasContainer.appendChild(canvas);

    await page.render({ canvasContext: context, viewport }).promise;

    canvas.style.display = "flex"; // Показываем после рендеринга
  }

  setTimeout(() => {
    clearInterval(loadingInterval);
    if(loaderContainer){
      canvasContainer.removeChild(loaderContainer);
    }

    containerCanvas_highlightColor = '#5E5E5E';
    canvasContainer.style.overflowY = "auto";
    // Показываем все canvas обратно
    Array.from(canvasContainer.getElementsByTagName("canvas")).forEach(c => c.style.display = "flex");

    
    const hourglassHalf = document.querySelector('.textAreaDashboard > i.fa-hourglass-half')
    if(hourglassHalf){
      hourglassHalf.remove()
    }
    
    const dashboardInfoText = document.querySelector('p.dashboardInfoText');
    if (dashboardInfoText) {
      dashboardInfoText.classList.remove("generating")
    }

    // Время завершения
    const endTime = Date.now();
    const renderDuration = endTime - startTime; // Время в миллисекундах
    document.querySelector("span#generationTime").innerText = `• ${renderDuration}мс`
    if(statusFinishIcon){
      statusFinishIcon.remove()
    }
    const textAreaDashboard = document.querySelector(".textAreaDashboard");
    if (textAreaDashboard) {
      const isIconShowed = document.querySelector("i.fa-check")
      if(isIconShowed){
        isIconShowed.remove()
        const statusDone = document.createElement("i");
        statusDone.classList.add("fa-solid","fa-check")
        textAreaDashboard.insertBefore(statusDone, textAreaDashboard.firstChild);
        let pdfPrint = document.querySelector("a.pdfPrint");
        if (pdfPrint && pdfPrint.href) {
          localBlob = pdfPrint.href.split("/").pop();
          document.querySelector('.dashboardInfoText').innerText = localBlob
        }    
      }else{
        const statusDone = document.createElement("i");
        statusDone.classList.add("fa-solid","fa-check")
        textAreaDashboard.insertBefore(statusDone, textAreaDashboard.firstChild);
        let pdfPrint = document.querySelector("a.pdfPrint");
        if (pdfPrint && pdfPrint.href) {
          localBlob = pdfPrint.href.split("/").pop();
          document.querySelector('.dashboardInfoText').innerText = localBlob
        }    
      }
  
    }
  }, 1000);
}

//!END 

// Функция предпросмотра
function generatePreview() {
  generatePDF()
}

// Обработчики изменений для автогенерации PDF
document.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", (event) => {
    if (!document.getElementById("calendar").contains(event.target)) {
      throttledGeneratePreview();
    }
  });
});

document.querySelectorAll(".no-cargo").forEach(button => {
  button.addEventListener("click", throttledGeneratePreview);
});

const targetNode = document.getElementById("dateDisplay");
const observer = new MutationObserver(throttledGeneratePreview);
observer.observe(targetNode, { childList: true, characterData: true, subtree: true });

getDateToday()
generatePreview()