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
  let menuToggleHeight = menuToggle.getBoundingClientRect().height + 20;
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


//~ CANVAS
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
//~ CANVAS END

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

const previewScaleBtn = document.querySelectorAll(".previewScale-btn");
previewScaleBtn.forEach(button => {
  button.addEventListener("click", (event) => {
    const canvases = document.querySelectorAll(".canvasContainer canvas");
    let currentWidth = parseFloat(getComputedStyle(canvases[0]).width);
    let newWidth;

    if (button.classList.contains('previewScale-minus-btn')) {
      newWidth = currentWidth * 0.94; // Уменьшение
    } else if (button.classList.contains('previewScale-plus-btn')) {
      newWidth = currentWidth * 1.06; // Увеличение
    }

    newWidth = Math.max(250, Math.min(newWidth, 850)); // Ограничения

    canvases.forEach(canvas => {
      canvas.style.width = `${newWidth}px`;
    });

    let scalePercent = Math.round((newWidth / 595) * 100);
    if (scalePercent === 96 || scalePercent === 104) {
      scalePercent = 100;
    }
    document.querySelector(".scalePersent").textContent = `${scalePercent}%`;
  });
});

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


document.querySelector("textarea.allOrders").addEventListener("input", function (event) {
  
  formatingAnimation()

  let setcionNumber = 1;

  const textarea = document.querySelector('.allOrders');
  const lineNumbersDiv = document.getElementById('line-numbers');

  const lineNumber = textarea.value.split('\n');
  let lineNumbers = '';
  let number = 1;

  lineNumber.forEach((line) => {
    if (line.trim() !== '') {
      lineNumbers += `${number}\n`;
      number++;
    } else {
      lineNumbers += `<span style="color: #8d8d8d;">×</span>\n`;
    }
  });

  lineNumbersDiv.innerHTML = lineNumbers.replace(/\n/g, '<br>');

  // Синхронизация скролла
  textarea.addEventListener('scroll', () => {
    lineNumbersDiv.scrollTop = textarea.scrollTop;
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
    let oneRow = false;

    if (parts.length > 0) {
      const firstPart = parts[0];

      if (parts.length > 1 && parts[1].startsWith('LO-')) {
        cargoCode = parts[0];
        orderNumber = parts[1];
        oneRow = false;
      } 
      else if (firstPart.startsWith('LO-')) {
        orderNumber = firstPart;
        cargoCode = parts.slice(1).join(' ');
        oneRow = false;
      }
      else if (parts.length > 1 && parts[0].startsWith('F025')) {
        cargoCode = parts[0];
        orderNumber = parts.slice(1).join(' ');
        oneRow = false;
      }
      else if (parts.length > 1 && parts[0].startsWith('0')) {
        cargoCode = parts[0];
        orderNumber = parts.slice(1).join(' ');
        oneRow = false;
      }
      else if (firstPart.startsWith('YP')) {
        cargoCode = firstPart;
        orderNumber = parts.slice(1).join(' ');
        oneRow = false;
      }
      else if (firstPart.startsWith('F1254') || firstPart.startsWith('FA254') || firstPart.startsWith('VOZ') || firstPart.startsWith('PVZ') || firstPart.startsWith('FBS') || firstPart.startsWith('FBY')) {
        orderNumber = firstPart;
        cargoCode = '';
        oneRow = true;
      }
      else if (/^\d{9,}-\d+$/.test(firstPart)) {
        cargoCode = firstPart;
        orderNumber = firstPart.split('-')[0];
        oneRow = false;
      } else {
        orderNumber = parts[0] || '';
        cargoCode = parts.slice(1).join(' ') || '';
        oneRow = false;
      }
    }

    const newOrderRow = document.createElement("div");
    newOrderRow.classList.add("order-row");

    newOrderRow.innerHTML = `
    <div class="orderRowNumber">${setcionNumber++}</div>

    <div class="orderData-container">
      <input type="text" class="orderData-input" id="orderNumber${index + 1}" value="${orderNumber}" placeholder="Введите номер отправления" required autocomplete="off">
      <label for="orderNumber${index + 1}" class="orderData-label">Номер отправления:</label>
    </div>

    <button type="button" class="switchCargo pegasusTooltip" title="Поменять местами">
      <i class="fa-solid fa-arrows-repeat"></i>
    <div class="orderData-container">
      <input type="text" class="orderData-input cargoGroup" id="cargoCode${index + 1}" value="${cargoCode}" placeholder="Введите код грузоместа" ${oneRow === true ? 'disabled' : ''} autocomplete="off">
      <label for="cargoCode${index + 1}" class="orderData-label">Код грузоместа:</label>
      <button type="button" class="no-cargo">
        <i class="fa-solid fa-eye"></i>
      </button>
    </div>
    <div class="orderData-container">
      <input type="number" class="orderData-input orderData-inputCount" id="cargoCount${index + 1}" placeholder="Введите количество" value="1" autocomplete="off" min="1">
      <label for="cargoCount${index + 1}" class="orderData-label">Кол-во:</label>
    </div>

    `;

    ordersContainer.appendChild(newOrderRow);

    newOrderRow.querySelector(".no-cargo").addEventListener("click", function () {
      this.classList.remove('buttonAutoDisabled')
      const row = this.closest(".order-row");
      const cargoInput = row.querySelector('input[type="text"]:nth-of-type(2)');
      cargoInput.disabled = !cargoInput.disabled;
      throttledGeneratePreview()
    });

    newOrderRow.querySelectorAll("input").forEach(input => {
      input.addEventListener("input", throttledGeneratePreview());
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
});

document.querySelector("textarea.allOrders").addEventListener("input", function (event) {

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
        let oneRow = false;

        if (parts.length > 0) {
            const firstPart = parts[0];

            if (parts.length > 1 && parts[1].startsWith('LO-')) {
                cargoCode = parts[0];
                orderNumber = parts[1];
                oneRow = false;
            }
            else if (firstPart.startsWith('LO-')) {
                orderNumber = firstPart;
                cargoCode = parts.slice(1).join(' ');
                oneRow = false;
            }
            else if (parts.length > 1 && parts[0].startsWith('F025')) {
                cargoCode = parts[0];
                orderNumber = parts.slice(1).join(' ');
                oneRow = false;
            }
            else if (parts.length > 1 && parts[0].startsWith('0')) {
                cargoCode = parts[0];
                orderNumber = parts.slice(1).join(' ');
                oneRow = false;
            }
            else if (parts.length > 1 && parts[0].startsWith('72')) {
                cargoCode = parts[0];
                orderNumber = parts.slice(1).join(' ');
                oneRow = false;
            }
            else if (firstPart.startsWith('YP')) {
                cargoCode = firstPart;
                orderNumber = parts.slice(1).join(' ');
                oneRow = false;
            }
            else if (firstPart.startsWith('F1254') || firstPart.startsWith('FA254') || firstPart.startsWith('VOZ') || firstPart.startsWith('PVZ') || firstPart.startsWith('FBS') || firstPart.startsWith('FBY')) {
                orderNumber = firstPart;
                cargoCode = '';
                oneRow = true;
            }
            else if (/^\d{9,}-\d+$/.test(firstPart)) {
                cargoCode = firstPart;
                orderNumber = firstPart.split('-')[0];
                oneRow = false;
            } else {
                orderNumber = parts[0] || '';
                cargoCode = parts.slice(1).join(' ') || '';
                oneRow = false;
            }
        }

        const newOrderRow = document.createElement("div");
        newOrderRow.classList.add("order-row");

        newOrderRow.innerHTML = `
        <div class="orderRowNumber">${setcionNumber++}</div>

        <div class="orderData-container">
          <input type="text" class="orderData-input" id="orderNumber${index + 1}" value="${orderNumber}" placeholder="Введите номер отправления" autocomplete="off" required>
          <label for="orderNumber${index + 1}" class="orderData-label">Номер отправления:</label>
        </div>
        <button type="button" class="switchCargo pegasusTooltip" title="Поменять местами">
          <i class="fa-solid fa-arrows-repeat"></i>
        </button>

        <div class="orderData-container">
          <input type="text" class="orderData-input cargoGroup" id="cargoCode${index + 1}" value="${cargoCode}" placeholder="Введите код грузоместа" ${oneRow === true ? 'disabled' : ''} autocomplete="off">
          <label for="cargoCode${index + 1}" class="orderData-label">Код грузоместа:</label>
          
            ${oneRow === true ? '<button type="button" class="no-cargo buttonAutoDisabled"><i class="fa-solid fa-eye"></i></button>' : '<button type="button" class="no-cargo"><i class="fa-solid fa-eye-slash"></i></button>'}
        </div>

        <div class="orderData-container">
          <input type="number" class="orderData-input orderData-inputCount" id="cargoCount${index + 1}" placeholder="Введите количество" value="1" autocomplete="off" min="1">
          <label for="cargoCount${index + 1}" class="orderData-label">Кол-во:</label>
        </div>
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

});

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
  const actNumber = document.getElementById("actNumber").value;
  const date = document.getElementById("dateDisplay").innerText;

  // Адреса получателей
  const recipientAddresses = {
    "СЦ Домодедово ЕВСЦ": "Микрорайон Белые Столбы, д. владение Склады 104, стр. 6/1",
    "СЦ Яндекс Маркет Софьино ФФЦ": "Московская область, территория Логистический технопарк Софьино, Раменский городской округ, дом к1, строение 3/1",
    "СЦ Яндекс Маркет Софьино Суперсклад": "Московская область, территория Логистический технопарк Софьино, Раменский городской округ, дом 2/1",
    "СЦ Яндекс Маркет Софьино КГТ": "Московская область, Раменский городской округ, территория Логистический технопарк Софьино, с4",
    "СЦ Тарный (Тарный Дропофф)": "г. Москва, Промышленная, дом 12A",
    "СЦ Ростов": "Ростовская область, Новочеркасское шоссе, Аксайский район, дом 111, корпус 2",
    "Ростов КГТ": "улица Логопарк, 5, Ростовская область, Аксайский район",
    "СЦ Строгино": "г. Москва, ул. 2-я Лыковская, д. 63, стр. 6.",
    "СЦ Дзержинский": "Московская область, Садовая улица, городской округ Дзержинский, дом 6",
    "СЦ Троицкий": "г. Санкт-Петербург, Запорожская ул. , д.12",
    "СЦ Казань": "Республика Татарстан, Почтовая улица, Лаишевский район, дом 1",
    "СЦ Самара": "Самарская область, Индустриальная улица, Волжский район, дом 1Б/1",
    "СЦ Грибки": "Ангарская ул., вл8с12, д. Грибки",
    "СЦ Ставрополь": "г. Ставрополь Старомарьевское шоссе 13/8",
    "СЦ Дмитровское": "г. Москва, Дмитровское шоссе, 157с12"
  };

  // Сбор данных о заказах
  const orders = [];
  let totalCargoCount = 0;
  
  document.querySelectorAll(".order-row").forEach((row, index) => {
    const orderNumber = row.querySelector(`#orderNumber${index + 1}`).value;
    const cargoCode = row.querySelector(`#cargoCode${index + 1}`).value;
    const cargoCount = parseInt(row.querySelector(`#cargoCount${index + 1}`).value);
    const isCargoDisabled = row.querySelector(`#cargoCode${index + 1}`).disabled;
    
    totalCargoCount += cargoCount;
  
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
  });
  // Строка "Итого"
  const totalRow = [
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

  // Стили таблицы
  const tableStyles = {
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
  };

  // Формирование документа
  doc.setFontSize(14);
  doc.text(`Акт приема-передачи №${actNumber} от ${date}`, 105, 40, { align: 'center' });

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
