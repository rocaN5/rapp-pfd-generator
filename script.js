//A- Global variables

let currentRappGeneratorType = 1;
let defaultLabel = false

const onLoad = document.querySelectorAll('.onLoad')
const onLoadItem = document.querySelectorAll('.onLoadItem')
const onLoadMenu = document.querySelectorAll(".onLoadMenu")
const onLoadText = document.querySelectorAll(".onLoadText")
const onLoadItemAnimation = document.querySelectorAll('.onLoadItemAnimation')
const onLoadItemDevider = document.querySelectorAll('.onLoadItemDevider')

const currentGeneratorType_title = document.getElementById("currentGeneratorType-title");
const currentGeneratorType_selection = document.querySelectorAll("input.currentGeneratorType-selection");

//A- Global variables END

//~ LOAD
window.onload = () => {
  showMenu()
  setTimeout(() => {
    hideMenu()
    const loadingWrapper = document.querySelector(".loadingWrapper")
    const loadingBlock = document.querySelector(".loadingBlock")
    const loadingBlockBlur = document.querySelector(".loadingBlock-blur")
    loadingBlock.style.filter = "blur(200px)"
    loadingBlockBlur.style.filter = "blur(200px)"
    setTimeout(() => {
      loadingWrapper.remove()
      setTimeout(() => {
        freshLoading()
        makeNotification("notification:welcomeOnWeb", "type:welcome");
      }, 50);
    }, 50);
  }, 50);
};

function freshLoading(){
  onLoadItem.forEach(loadingItem =>{
    loadingItem.classList.remove("onLoadItem")
  })
  onLoadItemDevider.forEach(loadingItem =>{
    loadingItem.classList.remove("onLoadItemDevider")
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
  setTimeout(() => {
    onLoadItemAnimation.forEach(loadingItem => {
    loadingItem.classList.remove("onLoadItemAnimation")
    });
  }, 1500);
}
//~ LOAD END 

//~ Notification

function makeNotification(callReason, typeReason) {
  const notificationDescriptions = {
    "notification:welcomeOnWeb:type:welcome": "Страница успешно загружена, хорошего дня !",
    "notification:insertHESHkey:type:true": "Ключ был успешно применён",
    "notification:insertHESHkey:type:error": "Ошибка чтения, ключ содержит ошибку",
    "notification:getHESHkey:type:bell": "Ключ был успешно скопирован",
    "notification:getHESHkey:type:error": "Ошибка копирования ключа, проверьте доступ страницы к буфферу обмена",
    "notification:currentGeneratorType:type:default": "Изменение типа генерации РАПП",
    "notification:currentGeneratorType:type:error": "Ошибка при изменении типа генерации РАПП",
    "notification:callDeveloper:type:support": "Ваше сообщение было отправлено разработчику",
    "notification:callDeveloper:type:error": "Ошибка при отправке сообщения",
    "notification:changeOrderType:type:select": "Тип заказов успешно изменён",
    "notification:colorSwitchError:type:error": "Ошибка изменении подсветки ",
    "notification:brainSwitchError:type:error": "Ошибка отключения умного форматирования",
    "notification:extraCommentColumnEror:type:error": "Ошибка добавления дополнительного столбца \"Комментарий\""
  };

  let notificationIcon = "";
  const notificationKey = `${callReason}:${typeReason}`;
  const notificationText = notificationDescriptions[notificationKey] || "Неизвестное уведомление";
  const notificationWrapper = document.querySelector(".notification-wrapper");
  const createNotification = document.createElement("div");
  createNotification.classList.add("notification-item");

  if (typeReason === "type:true") {
    notificationIcon = `<i class="fa-regular fa-circle-check fa-bounce"></i>`;
    createNotification.setAttribute("notification-type","true")
  } else if (typeReason === "type:bell") {
    notificationIcon = `<i class="fa-regular fa-bell fa-shake"></i>`;
    createNotification.setAttribute("notification-type","bell")
  } else if (typeReason === "type:error") {
    notificationIcon = `<i class="fa-regular fa-shield-xmark fa-beat-fade"></i>`;
    createNotification.setAttribute("notification-type","error")
  } else if (typeReason === "type:default") {
    notificationIcon = `<i class="fa-solid fa-file-circle-info"></i>`;
    createNotification.setAttribute("notification-type","default")
  } else if (typeReason === "type:support") {
    notificationIcon = `<i class="fa-solid fa-headset fa-shake"></i>`;
    createNotification.setAttribute("notification-type","support")
  } else if (typeReason === "type:welcome") {
    notificationIcon = `<i class="fa-solid fa-hand-wave fa-shake"></i>`;
    createNotification.setAttribute("notification-type","welcome")
  } else if (typeReason === "type:select") {
    notificationIcon = `<i class="fa-solid fa-arrows-spin"></i>`;
    createNotification.setAttribute("notification-type","select")
  } else {
    return "mega-error";
  }

  createNotification.innerHTML = `
    <div class="notification-item-color-animation"></div>
    <div class="notification-item-info">
      <div class="notification-item-info-icon">
        ${notificationIcon}
      </div>
      <div class="notification-item-info-description">
        <p>${notificationText}</p>
      </div>
      <div class="notification-item-info-close">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
  `;

  createNotification.style.transform = "translateY(50%)"
  createNotification.style.opacity = "0"
  if (notificationWrapper.children.length >= 6) {
    notificationWrapper.removeChild(notificationWrapper.firstElementChild);
  }
  notificationWrapper.appendChild(createNotification);

  
  setTimeout(() => {
    createNotification.style.transform = "translateY(0)"
    createNotification.style.opacity = "1"
  }, 10)

  const notificationClose = document.querySelectorAll(".notification-item-info-close");

  notificationClose.forEach(closeBtn => {
    closeBtn.addEventListener("click", (e) => {
      e.currentTarget.closest(".notification-item")?.remove();
    });
  });

  setTimeout(() => {
    createNotification.style.transform = "translateY(-50%)"
    createNotification.style.opacity = "0"
    setTimeout(() => {
      if(createNotification){
        createNotification.remove()
      }
    }, 200);
  }, 3000);
}

//~ Notification END

//~ Вкл/Выкл Подсветка текст + brains

//~ Вкл/Выкл Подсветка текст + brains

const toggleStates = {
  backlight: true,
  smartFormating: true,
  extraCommentColumn: false
}

const toggleConfig = [
  {
    id: "backlightSwitch-btn",
    key: "backlight",
    error: "notification:colorSwitchError",
    onToggle: (state) => {
      document.querySelector(".allOrders").setAttribute("isColored", state)
      textAreaOverLay__updateCanvas()
    }
  },
  {
    id: "textareaSmartFormating-btn",
    key: "smartFormating",
    error: "notification:brainSwitchError",
    onToggle: () => {
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      if (typeof textAreaOverLay__updateCanvas === "function") {
          textAreaOverLay__updateCanvas();
      }
    }
  },
  {
    id: "textareaAddCommentSection-btn",
    key: "extraCommentColumn",
    error: "notification:extraCommentColumnEror",
    onToggle: () => {
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      if (typeof textAreaOverLay__updateCanvas === "function") {
          textAreaOverLay__updateCanvas();
      }
    }
  }
]

toggleConfig.forEach(({ id, key, error, onToggle }) => {
  const button = document.getElementById(id)
  if (!button) return

  const icon = button.querySelector(".controlsButton-active")

  button.addEventListener("click", () => {
    if (typeof toggleStates[key] !== "boolean") {
      makeNotification(error, "type:error")
      return
    }

    toggleStates[key] = !toggleStates[key]
    const state = toggleStates[key]

    button.setAttribute("isActive", state)
    if (icon) {
      icon.classList.toggle("fa-circle-check", state)
      icon.classList.toggle("fa-circle-xmark", !state)
    }

    onToggle(state)
  })
})


//~ Вкл/Выкл Подсветка текст + brains END

//~ HESH KEY
// Сжатие строки с помощью pako (gzip) и кодирование в Base64-URL
function compressAndEncode(text) {
  const compressed = pako.deflate(text); // Получаем Uint8Array
  return btoa(String.fromCharCode(...compressed)) // Преобразуем в Base64
      .replace(/\+/g, '-') // Меняем '+' на '-'
      .replace(/\//g, '_') // Меняем '/' на '_'
      .replace(/=+$/, ''); // Убираем '='
}

// Декодирование и разжатие
function decodeAndDecompress(encoded) {
  encoded = encoded.replace(/-/g, '+').replace(/_/g, '/'); // Возвращаем в обычный Base64
  const byteArray = Uint8Array.from(atob(encoded), c => c.charCodeAt(0)); // Преобразуем обратно в Uint8Array
  return pako.inflate(byteArray, { to: 'string' }); // Декодируем в строку
}

// Функция выбора радиокнопки перед вставкой текста
function selectMatchingRadioButton(symbol) {
  const typeMapping = { 'm': 1, 'c': 2, 's': 3, 'a': 4, 'z': 5 };
  const selectedType = typeMapping[symbol] || 1; // По умолчанию 1 (если символ не найден)

  const radioButtons = document.querySelectorAll("input.currentGeneratorType-selection");

  radioButtons.forEach(input => {
      if (input.id === `rapp-${selectedType}`) {
          input.checked = true;
          input.dispatchEvent(new Event("change", { bubbles: true })); // Вызывает связанный обработчик
      } else {
          input.checked = false;
      }
  });
}

//~ Генерация и копирование хеша

document.getElementById('textareaGetKey-btn').addEventListener('click', function () {
  const textarea = document.querySelector('textarea.allOrders');
  const text = textarea.value.trim();
  const rappType = currentRappGeneratorType || 1;
  const date = document.getElementById('dateDisplay')?.innerText.trim() || ''; // Получаем дату
  const recipient = document.getElementById('recipient')?.value.trim() || ''; // Получаем получателя

  const typeSymbols = { 1: 'm', 2: 'c', 3: 's', 4: 'a', 5: 'z' };
  const symbol = typeSymbols[rappType] || 'm';

  // Формируем полные данные
  const fullText = JSON.stringify({ text, date, recipient });

  const compressedHash = compressAndEncode('iRock' + fullText);
  const finalHash = `iRDG-${symbol}-${compressedHash}`;

  // try{
  //   console.log('Хеш-код скопирован в буфер обмена:', finalHash);
  //   makeNotification("notification:getHESHkey", "type:bell")
  // }catch (err){
  //   console.error('Ошибка копирования:', err);
  //   makeNotification("notification:getHESHkey", "type:error")
  // }
  // navigator.clipboard.writeText(finalHash)

  const copyHashToClipboard = async (finalHash) => {
    try {
        await navigator.clipboard.writeText(finalHash);
        makeNotification("notification:getHESHkey", "type:bell");
    } catch (error) {
        makeNotification("notification:getHESHkey", "type:error");
    }
  };

  copyHashToClipboard(finalHash);
});

// Вставка текста из буфера с выбором радиокнопки и заполнением даты/получателя
document.getElementById('textareaInsertKey-btn').addEventListener('click', async function () {
  try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText.startsWith('iRDG-')) {
          const parts = clipboardText.split('-');
          if (parts.length >= 3) {
              const symbol = parts[1]; // Символ типа (m, c, s, a, z)
              const hash = parts.slice(2).join('-');
              const decodedData = decodeAndDecompress(hash).replace(/^iRock/, '');
              const { text, date, recipient } = JSON.parse(decodedData); // Декодируем JSON-данные

              // Выбираем нужную радиокнопку перед вставкой текста
              selectMatchingRadioButton(symbol);

              // Заполняем textarea
              const textarea = document.querySelector('textarea.allOrders');
              textarea.value = text;
              textarea.dispatchEvent(new Event('input', { bubbles: true }));

              // Заполняем дату
              if (document.getElementById('dateDisplay')) {
                  document.getElementById('dateDisplay').innerText = date;
              }

              // Заполняем получателя
              if (document.getElementById('recipient')) {
                  document.getElementById('recipient').value = recipient;
                  document.getElementById('recipient').dispatchEvent(new Event('input', { bubbles: true }));
              }
          }
          makeNotification("notification:insertHESHkey", "type:true")
      }else{
      makeNotification("notification:insertHESHkey", "type:error")
      }
  } catch (err) {
      makeNotification("notification:insertHESHkey", "type:error")
  }
});

// Обработчик изменения радиокнопки (из вашего кода)
currentGeneratorType_selection.forEach(input => {
  input.addEventListener("change", (event) => {
      direction__input.value = "Не выбран";
      let title = "";
      getDataAndMakeOrderRow(event);

      if (input.id === "rapp-1") {
          title = "Магистрали";
          currentRappGeneratorType = 1;
          changeOrderType_disabled()
          extraComments_enabled()
      } else if (input.id === "rapp-2") {
          title = "Курьеры / СРК";
          currentRappGeneratorType = 2;
          changeOrderType_disabled()
          extraComments_enabled()
      } else if (input.id === "rapp-3") {
          title = "Мерчи";
          currentRappGeneratorType = 3;
          changeOrderType_disabled()
          extraComments_enabled()
      } else if (input.id === "rapp-4") {
          title = "Аномалии";
          currentRappGeneratorType = 4;
          changeOrderType_disabled()
          extraComments_disabled()
      } else if (input.id === "rapp-5") {
          title = "Засылы / Дубли / Lost / Невыкуп";
          currentRappGeneratorType = 5;
          changeOrderType_enabled()
          extraComments_disabled()
      } else {
          title = "Что-то новенькое 😐";
      }

      currentGeneratorType_title.innerText = title;

      // Создаем событие input для textarea
      const textarea = document.querySelector('.allOrders');
      textarea.dispatchEvent(new Event("input", { bubbles: true }));

      // Вызов функции предпросмотра
      throttledGeneratePreview();
      setTimeout(() => {
          hideMenu();
      }, 300);
      setTimeout(() => {
        direction__dropdownList.classList.remove("show");
      }, 10);

      //~ changeOrderType option
      function changeOrderType_enabled(){
        const textareaChangeOrderType = document.getElementById("textareaChangeOrderType")
        const availabilityIcon = document.querySelector("#textareaChangeOrderType > .availabilityIcon")
        textareaChangeOrderType.removeAttribute("disabled")
        availabilityIcon.classList.remove("fa-circle-xmark")
        availabilityIcon.classList.add("fa-circle-check")
      }
      function changeOrderType_disabled(){
        const textareaChangeOrderType = document.getElementById("textareaChangeOrderType")
        const availabilityIcon = document.querySelector("#textareaChangeOrderType > .availabilityIcon")
        textareaChangeOrderType.setAttribute("disabled", true)
        availabilityIcon.classList.add("fa-circle-xmark")
        availabilityIcon.classList.remove("fa-circle-check")
      }

      //~ addExtraComment option
      function extraComments_enabled(){
        const textareaAddCommentSection_btn = document.getElementById("textareaAddCommentSection-btn")
        const availabilityIcon = document.querySelector("#textareaAddCommentSection-btn > .availabilityIcon")
        textareaAddCommentSection_btn.removeAttribute("disabled")
        availabilityIcon.classList.remove("fa-circle-xmark")
        availabilityIcon.classList.add("fa-circle-check")
      }

      function extraComments_disabled(){
        const textareaAddCommentSection_btn = document.getElementById("textareaAddCommentSection-btn")
        const availabilityIcon = document.querySelector("#textareaAddCommentSection-btn > .availabilityIcon")
        availabilityIcon.classList.add("fa-circle-xmark")
        availabilityIcon.classList.remove("fa-circle-check")
        textareaAddCommentSection_btn.setAttribute("disabled", true)
        textareaAddCommentSection_btn.setAttribute("isActive", false)
        toggleStates.extraCommentColumn = false
      }
  });
});

//~ HESH KEY END

//~ call "Change orderTpe"

const textareaChangeOrderType = document.getElementById("textareaChangeOrderType")
const changeOrderType_input = document.getElementById("changeOrderType-input");
const textareaChangeOrderType_menu = document.querySelector(".textareaChangeOrderType-menu")

textareaChangeOrderType.addEventListener('click', callMeChangeOrderType)
document.addEventListener("click", (event) => {
  if (!textareaChangeOrderType_menu.contains(event.target) && event.target !== textareaChangeOrderType) {
    changeOrderType_clickOFF()
  }
});
changeOrderType_input.addEventListener("click", ()=>{
  makeNotification("notification:changeOrderType", "type:select")
  changeOrderType_selected()
})

function callMeChangeOrderType(){
  textareaChangeOrderType_menu.style.display = "flex"
  textareaChangeOrderType.setAttribute("inert", true)
  setTimeout(() => {
    textareaChangeOrderType_menu.setAttribute("isCalled", true)
  }, 100);
}

function changeOrderType_selected(){
  textareaChangeOrderType_menu.setAttribute("isSelected", true)
  hideFromMeChangeOrderType()
}

function changeOrderType_clickOFF(){
  textareaChangeOrderType_menu.setAttribute("isSelected", false)
  hideFromMeChangeOrderType()
}

function hideFromMeChangeOrderType(){
  setTimeout(() => {
    textareaChangeOrderType_menu.removeAttribute("isCalled")
    textareaChangeOrderType_menu.removeAttribute("isSelected")
    textareaChangeOrderType.removeAttribute("inert")
    setTimeout(() => {
          textareaChangeOrderType_menu.style.display = "none"
    }, 200);
  }, 200);
}

//~ call "Change orderTpe" END

//~ Change orderTpe

const orderTypes = ["Засыл", "Дубль", "LOST", "Невыкуп"];
const changeOrderType_prevButton = document.getElementById("changeOrderType-prev");
const changeOrderType_nextButton = document.getElementById("changeOrderType-next");

let currentIndex = orderTypes.indexOf(changeOrderType_input.value);

changeOrderType_prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + orderTypes.length) % orderTypes.length;
    changeOrderType_input.value = orderTypes[currentIndex];
});

changeOrderType_nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % orderTypes.length;
    changeOrderType_input.value = orderTypes[currentIndex];
});

//~ Change orderTpe END

//~ Move me to top button

const moveMeToTop = document.createElement("button");
const topAnchor = document.querySelector("#topAnchor");
const pdfForm = document.querySelector("#pdf-form");
moveMeToTop.className = "moveMeToTop";
moveMeToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
pdfForm.appendChild(moveMeToTop);


function checkScroll() {
    if (pdfForm.scrollTop > 700) {
        moveMeToTop.style.opacity = "1";
        moveMeToTop.style.pointerEvents = "auto";
        moveMeToTop.removeAttribute("inert");
    } else {
        moveMeToTop.style.opacity = "0";
        moveMeToTop.style.pointerEvents = "none";
    }
}

pdfForm.addEventListener("scroll", checkScroll);

moveMeToTop.addEventListener("click", function () {
    if (topAnchor) {
        pdfForm.scrollTo({ top: 0, behavior: "smooth" });
    }
    setTimeout(() => {
        moveMeToTop.style.opacity = "0.4";
        moveMeToTop.setAttribute("inert", "");
        moveMeToTop.style.pointerEvents = "none";
    }, 500);
});

moveMeToTop.addEventListener("mouseenter", function () {
    const icon = moveMeToTop.querySelector("i");
    icon.classList.add("fa-bounce");
});

moveMeToTop.addEventListener("mouseleave", function () {
    const icon = moveMeToTop.querySelector("i");
    icon.classList.remove("fa-bounce");
});

//~ Move me to top button END

//~ RightClick menu popup

const textarea = document.querySelector("textarea.allOrders");

textarea.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    
    // Удаляем все ранее созданные меню
    document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());

    // Создаем новое меню
    const menu = document.createElement("div");
    menu.classList.add("textArea__contextMenu");
    menu.style.position = "absolute";
    menu.style.display = "flex";
    
    // Получаем контейнер, куда добавляем меню
    const container = document.querySelector(".textAreaContainer");
    const containerRect = container.getBoundingClientRect();
    const pdfForm = document.querySelector("#pdf-form");
    const pdfFormRect = pdfForm.getBoundingClientRect();
    
    const x = event.clientX - containerRect.left;
    let y = event.clientY - containerRect.top;

    // Проверяем, выходит ли меню за пределы #pdf-form
    const menuHeight = 260; // Примерная высота меню, можно изменить
    if (event.clientY + menuHeight > pdfFormRect.bottom) {
        y = pdfFormRect.bottom - containerRect.top - menuHeight + 80
    } else {
        y += 90; // Обычное размещение
    }

    menu.style.left = `${x + 20}px`;
    menu.style.top = `${y}px`;
    
    menu.style.opacity = "0";
    menu.style.transform = "scale(0)";
    menu.style.transition = "opacity 0.2s ease-out, transform 0.2s ease-out";
    
    menu.innerHTML = `
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-paste">
        <i class="fa-solid fa-paste"></i>
        <p>Вставить</p>
      </div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-copy">
          <i class="fa-solid fa-clone"></i>
          <p>Копировать</p>
      </div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-cut">
          <i class="fa-solid fa-scissors"></i>
          <p>Вырезать</p>
      </div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-delete">
          <i class="fa-solid fa-eraser"></i>
          <p>Удалить</p>
      </div>
      <div class="contextMenu-item-devider contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay"></div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-undo">
        <i class="fa-solid fa-rotate-left"></i>
        <p>Назад</p>
      </div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-redo">
        <i class="fa-solid fa-rotate-right"></i>
        <p>Вперед</p>
      </div>
      <div class="contextMenu-item-devider contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay"></div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-showspot">
          <i class="fa-solid fa-eye"></i>
          <p>Показать</p>
      </div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-search">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Найти в ПИ</p>
      </div>
      <div class="contextMenu-item contextMenu-item-onCreate contextMenu-item-onCreate-animationDelay" id="contextMenu-increment">
          <i class="fa-solid fa-magnifying-glass-arrows-rotate"></i>
          <p>Инкрементировать</p>
      </div>
    `;

    setTimeout(() => {
      const contextMenu_item_onCreate = document.querySelectorAll(".contextMenu-item-onCreate");
      contextMenu_item_onCreate.forEach(item => {
          item.classList.remove("contextMenu-item-onCreate");
      });
    }, 50);

    setTimeout(() => {
      const contextMenu_item_onCreate_animationDelay = document.querySelectorAll(".contextMenu-item-onCreate-animationDelay");
      contextMenu_item_onCreate_animationDelay.forEach(item => {
          item.classList.remove("contextMenu-item-onCreate-animationDelay");
      });
    }, 250);
  
    function triggerHumanInput() {
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      if (typeof textAreaOverLay__updateCanvas === "function") {
          textAreaOverLay__updateCanvas();
      }
    }

  const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    
    // Получаем элементы для операций
    const pasteItem = menu.querySelector("#contextMenu-paste");
    const copyItem = menu.querySelector("#contextMenu-copy");
    const cutItem = menu.querySelector("#contextMenu-cut");
    const deleteItem = menu.querySelector("#contextMenu-delete");
    const showSpotItem = menu.querySelector("#contextMenu-showspot");
    const contextMenu_Undo = menu.querySelector("#contextMenu-undo");
    const contextMenu_Redo = menu.querySelector("#contextMenu-redo");
    
    // Функция для эмуляции действия человека
    function triggerHumanInput() {
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        if (typeof textAreaOverLay__updateCanvas === "function") {
            textAreaOverLay__updateCanvas();
        }
    }
    
    // Вставка из буфера обмена
    pasteItem.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
            const text = await navigator.clipboard.readText();
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;
            textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
            triggerHumanInput();
        } catch (err) {
            console.error("Ошибка вставки: ", err);
        }
        document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    });

    // Undoooooooooooooo
    contextMenu_Undo.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        if (historyIndex > 0) {
          historyIndex--;
          allOrders.value = history[historyIndex];
          allOrders.dispatchEvent(new Event("input", { bubbles: true }));
          throttledGeneratePreview();
          textAreaOverLay__updateCanvas()
        }
      } catch (err) {
          console.error("Ошибка undo: ", err);
      }
      document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    });

    // Redooooooooooooooooooooo
    contextMenu_Redo.addEventListener("click", async (e) => {
      e.stopPropagation();
      try {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          allOrders.value = history[historyIndex];
          allOrders.dispatchEvent(new Event("input", { bubbles: true }));
          throttledGeneratePreview();
          textAreaOverLay__updateCanvas()
        }
      } catch (err) {
          console.error("Ошибка redo: ", err);
      }
      document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    });
    
    // Если нет выделенного текста, деактивируем copy, cut и delete
    if (!selectedText) {
        [copyItem, cutItem].forEach(item => {
            item.style.filter = "brightness(0.5)";
            item.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        });
    } else {
        copyItem.addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(selectedText).catch(err => console.error("Ошибка копирования: ", err));
            triggerHumanInput();
            document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
        });
        cutItem.addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(selectedText).catch(err => console.error("Ошибка вырезания: ", err));
            let start = textarea.selectionStart;
            let end = textarea.selectionEnd;
            textarea.value = textarea.value.slice(0, start) + textarea.value.slice(end);
            triggerHumanInput();
            document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
        });
    }
    
    // Функция "Удалить": если есть выделение, удаляем выделенное, иначе удаляем всю строку.
    deleteItem.addEventListener("click", (e) => {
        e.stopPropagation();
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        if (start === end) {
            // Нет выделения – удаляем всю строку, в которой находится курсор
            const before = textarea.value.substring(0, start);
            const after = textarea.value.substring(start);
            const lineStart = before.lastIndexOf("\n") + 1; // если не найден, вернется 0
            const nextNewLine = after.indexOf("\n");
            const lineEnd = nextNewLine === -1 ? textarea.value.length : start + nextNewLine;
            textarea.value = textarea.value.substring(0, lineStart) + textarea.value.substring(lineEnd);
        } else {
            // Если есть выделение – удаляем выделенный текст
            textarea.value = textarea.value.slice(0, start) + textarea.value.slice(end);
        }
        triggerHumanInput();
        document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    });
    
    // Обработчик для "Показать"
    showSpotItem.addEventListener("click", (e) => {
        e.stopPropagation();
        const cursor = textarea.selectionStart;
        const allLines = textarea.value.split("\n");
        let cumulative = 0;
        let nonEmptyCount = 0;
        let currentLineContent = "";
        
        for (let i = 0; i < allLines.length; i++) {
            const line = allLines[i];
            if (cursor <= cumulative + line.length) {
                currentLineContent = line;
                if (line.trim() !== "") {
                    nonEmptyCount++; // учитываем текущую строку, если она не пустая
                }
                break;
            }
            if (line.trim() !== "") {
                nonEmptyCount++;
            }
            cumulative += line.length + 1; // +1 для символа новой строки
        }
        
        if (currentLineContent.trim() === "") {
            showSpotItem.style.filter = "brightness(0.5)";
        } else {
            const targetId = "orderRow-id-" + nonEmptyCount;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
                targetEl.classList.add("order-row-showMePlace");
                setTimeout(() => {
                    targetEl.classList.remove("order-row-showMePlace");
                }, 3000);
            }
        }
        document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    });

    // Предотвращаем закрытие меню при клике внутри него
    menu.addEventListener("click", function(e) {
        e.stopPropagation();
    });
    
    container.appendChild(menu);
    
    // Запускаем анимацию появления
    setTimeout(() => {
        menu.style.opacity = "1";
        menu.style.transform = "scale(1)";
    }, 10);
});

// Удаляем меню при клике вне него
document.addEventListener("click", function (event) {
    if (!event.target.closest(".textArea__contextMenu")) {
        document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    }
});

// Если ПКМ происходит вне textarea и меню – удаляем все меню
document.addEventListener("contextmenu", function (event) {
    if (!event.target.closest("textarea.allOrders") && !event.target.closest(".textArea__contextMenu")) {
        document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
    }
});

const pdfFormScroll = document.querySelector("#pdf-form")
pdfFormScroll.addEventListener("scroll", function () {
    document.querySelectorAll(".textArea__contextMenu").forEach(menu => menu.remove());
});


//~ RightClick menu popup END

//~ CANVAS textarea overlay

const textAreaOverLay__textarea = document.querySelector('textarea.allOrders');
const textAreaOverLay__canvas = document.createElement('canvas');
const textAreaOverLay__ctx = textAreaOverLay__canvas.getContext('2d');

textAreaOverLay__canvas.style.position = 'absolute';
textAreaOverLay__canvas.style.pointerEvents = 'none';
textAreaOverLay__canvas.style.top = textAreaOverLay__textarea.offsetTop + 'px';
textAreaOverLay__canvas.style.left = textAreaOverLay__textarea.offsetLeft + 'px';

function textAreaOverLay__updateCanvas() {
  if(toggleStates.backlight === true){

    textAreaOverLay__canvas.width = textAreaOverLay__textarea.clientWidth;
    textAreaOverLay__canvas.height = textAreaOverLay__textarea.clientHeight;
    textAreaOverLay__ctx.clearRect(0, 0, textAreaOverLay__canvas.width, textAreaOverLay__canvas.height);
    
    let text = textAreaOverLay__textarea.value.replace(/[()"'`]/g, ''); // Убираем кавычки и скобки
    const lines = text.split('\n');
    const fontSize = parseInt(window.getComputedStyle(textAreaOverLay__textarea).fontSize);
    const lineHeight = fontSize * 1.2;
    const scrollTop = textAreaOverLay__textarea.scrollTop;
    const scrollLeft = textAreaOverLay__textarea.scrollLeft; // Добавляем горизонтальный скролл
    const startY = 14 - scrollTop;
    textAreaOverLay__ctx.font = `${fontSize}px ${window.getComputedStyle(textAreaOverLay__textarea).fontFamily}`;
    textAreaOverLay__ctx.textBaseline = 'top';
  
    let y = startY;
    for (const line of lines) {
        if (y + lineHeight > 0 && y < textAreaOverLay__canvas.height) { // Отображать только видимые строки
            const words = line.split(' ');
            let x = 10 - scrollLeft; // Учитываем горизонтальный скролл
            let firstWordColor = '#00ff68';
            let secondWordColor = '#ccff00';
            let otherWordsColor = '#ffffff';
  
            if(toggleStates.smartFormating === true){
              if (/^(F0254|0|72|YP)/.test(line)) {
                  firstWordColor = '#ccff00';
                  secondWordColor = '#fff';
                  otherWordsColor = '#fff';
              } else if (/^(F1254)/.test(line)) {
                  firstWordColor = '#00dcff';
                  secondWordColor = '#fff';
                  otherWordsColor = '#fff';
              } else if (/^(F2254)/.test(line)) {
                  firstWordColor = '#00ff22';
                  secondWordColor = '#fff';
                  otherWordsColor = '#fff';
              } else if (/^(F3000000000)/.test(line)) {
                  firstWordColor = '#fc0';
                  secondWordColor = '#fff';
                  otherWordsColor = '#fff';
              } else if (/^(FA254)/.test(line)) {
                  firstWordColor = '#ff005c';
                  secondWordColor = '#ff00ae';
                  otherWordsColor = '#fff';
              }
            }else{
              firstWordColor = '#00ff68';
              secondWordColor = '#00ff68';
              otherWordsColor = '#00ff68';
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
  }else{
    textAreaOverLay__ctx.clearRect(0, 0, textAreaOverLay__canvas.width, textAreaOverLay__canvas.height);
  }
}
textAreaOverLay__textarea.parentNode.insertBefore(textAreaOverLay__canvas, textAreaOverLay__textarea.nextSibling);
textAreaOverLay__textarea.addEventListener('input', textAreaOverLay__updateCanvas);
textAreaOverLay__textarea.addEventListener('scroll', textAreaOverLay__updateCanvas);
textAreaOverLay__updateCanvas();

//~ CANVAS textarea overlay END

//~ FIX excel paste

textAreaOverLay__textarea.addEventListener("paste", (event) => {
  event.preventDefault();
  let text = (event.clipboardData || window.clipboardData).getData("text");
  text = text.replace(/https:\/\/st\.yandex-team\.ru\//g, "");
  text = text.replace(/\t+/g, " ");
  text = text.replace(/\n(?=[^\t])/g, " ").replace(/ +/g, " ").replace(/^ +/gm, "").trim();
  document.execCommand("insertText", false, text);
});

//~ FIX excel paste END

//~ CHANGE generator type

currentGeneratorType_selection.forEach(input => {
  input.addEventListener("change", (event) => {
    try{
      direction__input.value = "Не выбран"
      let title = "";
      getDataAndMakeOrderRow(event);
      if (input.id === "rapp-1") {
        title = "Магистрали";
        currentRappGeneratorType = 1;
      } else if (input.id === "rapp-2") {
        title = "Курьеры / СРК";
        currentRappGeneratorType = 2;
      } else if (input.id === "rapp-3") {
        title = "Мерчи";
        currentRappGeneratorType = 3;
      } else if (input.id === "rapp-4") {
        title = "Аномалии";
        currentRappGeneratorType = 4;
      } else if (input.id === "rapp-5") {
        title = "Засылы / Дубли / Lost / Невыкуп";
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
        makeNotification("notification:currentGeneratorType", "type:default")
      }, 300);
    }catch{
      makeNotification("notification:currentGeneratorType", "type:error")
    }
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
  calendar.classList.add("calendarOnLoad")
  labelGeneratorModal.classList.remove("active")
  labelGeneratorWindow.classList.add("labelOnLoad")
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

const courier__options = [
    "СРК",
    "Авраменко Иван", "Агеев Иван", "Ахычев Магомед",
    "Байдюк Виктор", "Барсуков Евгений", "Белоусов Владимир",
    "Бердников Николай", "Брюзгинов Сергей", "Бухтояров Руслан",
    "Вахрамеев Дмитрий", "Витоль Евгений", "Гаценко Денис",
    "Гейер Владимир", "Головин Дмитрий", "Голубятников Юрий",
    "Горбачев Дмитрий", "Гордуладзе Вахтанг", "Григорьев Кирилл",
    "Демик Антон", "Денисович Александр", "Дунаев Алексей",
    "Елфимов Александр", "Елфимов Евгений", "Елфимов Сергей",
    "Занин Руслан", "Захаров Роман", "Землянухин Алексей",
    "Коровин Николай", "Косенко Дмитрий", "Красильников Евгений",
    "Кратюк Игорь", "Круцких Алексей", "Кудинов Максим",
    "Кудрин Юрий", "Кузнецов Иван", "Кукушкин Сергей",
    "Кумарев Дмитрий", "Курцев Андрей", "Ливенцев Антон",
    "Лобанков Антон", "Логачев Алексей", "Ломов Александр",
    "Мазалов Данил", "Маквини Меджах", "Мануковский Павел",
    "Матвеев Сергей", "Матыцин Вячеслав", "Меньших Александр",
    "Митюряев Владимир", "Наибов Станислав", "Неретин Иван",
    "Неумывакин Андрея", "Нугманов Альберт", "Овсиенко Владимир",
    "Паршин Павел", "Пожидаев Дмитрий", "Придачин Константин",
    "Рогов Максим", "Рыжков Никита", "Рябов Сергей",
    "Савенко Дмитрий", "Савин Денис", "Свиридов Алексей",
    "Сериков Алексей", "Студеникин Дмитрий", "Суфиев Вафо",
    "Сысоев Алексей", "Тарских Владимир", "Терских Кирилл",
    "Торубаров Новый Михаил", "Третьяков Юрий", "Тюрин Данил",
    "Фазаилов Мухаммад", "Фардуков Санжар", "Филатов Владислав",
    "Ходяков Роман", "Шеин Вячеслав", "Шкодкин Данила",
    "Шпилькин Никита", "Щербаков Вадим"
]

const sellers__options = [
  'TRON 2', 'Компания Интерлогистика', 'Маршрут (Московская область, Котельники)', 'ПЕППА',
  '600518494 Lamoda', 'a2shops', 'acStore FBS 2 ', 'Apple Bar 3',
  'ARHIS PRO - ФФ Воронеж', 'AutoAKs36', 'AV-маркет', 'Best favors',
  'Cavallo Mag', 'DOLGANOFF SHOP', 'EAT 3', 'EAT 4',
  'FBS ВИРБАКавто Воронеж', 'gas-equipments', 'Glavmag', 'HYDROBANO',
  'HYGGE LODGE', 'IRCHI', 'Jokey', 'Krug elektronic Белгород',
  'kypioptom', 'LARINLOFT', 'LoftLiner FBS', 'Loftvrn36',
  'MarBer', 'MarBer new', 'Mebelson Воронеж', 'Montana Wear',
  'MOONLEES', 'MOONLEES FBS', 'MORKOVKA_OM', 'MyMilavitsa',
  "NIPPEL' 2", 'NVK.Shop', 'plastilin 2', "Pro' Mart FBS",
  'ProКров', 'Re_Sale', 'SantehSmart маркет', 'sheVshow',
  'Solamento', 'Sonito FBS', 'SVR', 'Sweet Home 36',
  'thermo parts', 'Voyager без буста ', 'WOOD36', 'ZaStolom FBS',
  'ZooPitomets', 'АВВ электро 2', 'АВС - ЭЛЕКТРО', 'Акционерное общество Почта России',
  'Алёна Медведкина Сергеевна', 'Алиса Воронеж', 'АЛЬМАМЕД', 'АЛЬЯНС',
  'АПРО', 'Ассорти идей FBS', 'АСТО-СЕРВИС', 'Астромарт Воронеж',
  'Бакаева Мария Леонидовна', 'Баранова Вера Анатольевна', 'Беляев Виктор Архипович', 'Береснева Марина Сергеевна',
  'Беспалова Анастасия Антоновна', 'Бобров Эдгар Радиевич', 'БУ шины из Европы Воронеж', 'Бугаев Константин Владимирович',
  'Бугаев Сергей Викторович', 'Бутово', 'Быковский Евгений Николаевич', 'БытМегаМаркет',
  'Валерий Скабелин Александрович', 'Василенко Екатерина Леонидовна', 'Везем с ФРЦ на СЦ в увеличенный лимит 5 дней ', 'Велесопт',
  'Велопарк36 Крупногабаритный', 'Вербицкий Сергей Викторович', 'Вж', 'Владимиров Алексей Родионович',
  'Волгоградская 32 а', 'Волкова Ольга Вячеславовна', 'Ворнеж', 'Воронеж',
  'Воронеж ', 'Воронеж 7 дней', 'Воронеж craft36', 'Воронеж FBS',
  'Воронеж Возвраты', 'Воронеж на СЦ с СС не КГТ (1 день), забирает ВНЕШНИЙ КУРЬЕР', 'Воронеж на СЦ с ФРЦ напрямую', 'ВоронежКЭ',
  'ВоронежПетр', 'Воронежская база автозапчастей 2', 'ВОРОНЕЖЧАЙ', 'Восток',
  'ВсёПРОСТО', 'Гаркин Александр Николаевич', 'Гаркина Марина Игоревна', 'Горожанкин Юрий Дмитриевич',
  'Группа компаний Союз шина', 'Гусев Владимир Семенович', 'ДЕТАЛЬНЫЙ', 'Долгих Руслан Игоревич',
  'Долженко Александр Евгеньевич', 'Дубовицкий Алексей Александрович', 'ЕВРОПАК', 'Завод',
  'Золотых Евдокия Ивановна', 'ЗООПЛАНЕТА', 'ЗООРЕГИОН36', 'Зуев Сергей Михайлович',
  'Иванов Дмитрий александрович', 'Идеальный микроклимат 2', 'ИП OZON', 'ИП Абакумов Андрей Ярославович',
  'ИП Абдурахмонова Мадинахон Абдумукадамовна', 'ИП Аветисян Тамаз Димитриевич', 'ИП Азимов Р.З', 'ИП Акулов Алексей Александрович',
  'ИП Акулова Юлия Николаевна', 'ИП Аль Зуби Мохаммад', 'ИП АЛЬХАССУН АХМЕД ХАСАН', 'ИП Ананян Рубен Камоевич',
  'ИП Антонов Юрий Михайлович', 'ИП АНТОЩЕНКО НИКОЛАЙ МИХАЙЛОВИЧ', 'ИП Апевалов Александр Сергеевич', 'ИП Аристов Андрей Иванович',
  'ИП Астапов Дмитрий Валерьевич', 'ИП Бабенко Анастасия Павловна', 'ИП Багринцев Олег Викторович', 'ИП Байкалов Владимир Евгеньевич',
  'ИП Бакаева Мария Леонидовна', 'ИП Балакин Андрей Васильевич', 'ИП Балашова Антонина Владимировна', 'ИП Баранов Константин Юрьевич',
  'ИП Баранов Михаил Владимирович', 'ИП Баранова Елена Николаевна', 'ИП Баранова Мария Ивановна', 'ИП Баркалова Елена Валентиновна',
  'ИП Барсуков Эдуард Юрьевич', 'ИП Батуева Владилена Валерьевна', 'ИП Бахметьев Павел Алексеевич', 'ИП Безсмертная Ирина Валерьевна',
  'ИП Беликов Сергей Александрович', 'ИП Беловоленко Роман Александрович', 'ИП Белокопытов Андрей Михайлович', 'ИП Белолапотков С.С.',
  'ИП Беляев Александр Олегович', 'ИП Беляев Виктор Архипович', 'ИП Беляев Владимир Владимирович', 'ИП Белякин Евгений Александрович',
  'ИП Беппиева Нина Григорьевна', 'ИП Бережанская Наталия Владимировна', 'ИП Березкин Александр Викторович', 'ИП Березняк Сергей Александрович',
  'ИП Береснев Артём Ильич', 'ИП Береснева Марина Сергеевна', 'ИП Беспалова Анастасия Антоновна', 'ИП Бирюкова Ольга Александровна',
  'ИП Бобров Эдгар Радиевич', 'ИП Богатырёв Алексей Сергеевич', 'ИП Боев Юрий Владимирович', 'ИП Бойкова Анна Сергеевна',
  'ИП Бокарев Евгений Игоревич', 'ИП Боков Андрей', 'ИП Болдырев Илья Александрович', 'ИП Болдырева Ирина Игоревна',
  'ИП Болошова Элла Анатольевна', 'ИП Большакова Анна Ивановна', 'ИП Бондарев Илья Петрович', 'ИП Бородин Валерий Николаевич',
  'ИП Бочков Александр Александрович', 'ИП Бояркина Евгения Владимировна', 'ИП Бражина Дмитрий Александрович', 'ИП Бугаев Константин Владимирович',
  'ИП Бугаков Антон Сергеевич', 'ИП Бударин Дмитрий Анатольевич', 'ИП Бурцева Анастасия Дмитриевна', 'ИП Буряков Михаил Александрович',
  'ИП Бусыгин Максим Игоревич', 'ИП Бухтоярова Юлия Михайловна', 'ИП Бушков Александр Юрьевич', 'ИП Быков Вадим Анатольевич',
  'ИП Быковский Евгений Николаевич', 'ИП Василенко Артем Викторович', 'ИП Вачнадзе Дмитрий Георгиевич', 'ИП Вербицкий Сергей Викторович',
  'ИП Вершинин Александр Николаевич', 'ИП Вигерина Екатерина Александровна', 'ИП Власенко Леонид Николаевич', 'ИП Власов Юрий Сергеевич',
  'ИП Власова Светлана Геннадьевна', 'ИП Волокитин Дмитрий Александрович', 'ИП Воробьев Владимир Сергеевич', 'ИП Воробьев Сергей Николаевич',
  'ИП Воронов Алексей Алексеевич', 'ИП Всеволожская Наталья Тимофеевна', 'ИП Вьюнова Яна Алексеевна', 'ИП Гаврилочев Юрий Анатольевич',
  'ИП Галкин Роман Юрьевич', 'ИП Гаркин Александр Николаевич', 'ИП Гаркина Марина Игоревна', 'ИП Гвоздев Сергей Валерьевич',
  'ИП Германюк Ирина Александровна', 'ИП Гладких Эдуард Викторович', 'ИП Глущенко Владислав Анатольевич', 'ИП Голиков Александр Романович',
  'ИП Голиков Сергей Валентинович', 'ИП Головин Александр Николаевич', 'ИП Голубев', 'ИП Голубев Михаил Андреевич',
  'ИП Голубева Светлана Николаевна', 'ИП Гонсовская Елена Владимировна', 'ИП Гончаров Николай Александрович', 'ИП Гончарова Оксана Александровна',
  'ИП Горбатков Сергей', 'ИП Горбаткова Елена Сергеевна', 'ИП Гордон Татьяна Юрьевна', 'ИП Горожанкин Юрий Дмитриевич',
  'ИП Горяинов Илья Викторович', 'ИП Горяинова Юлия Владимировна', 'ИП Грабко Денис Васильевич', 'ИП Гречко Дмитрий',
  'ИП Григораш Константин Александрович', 'ИП Григорова Надежда Васильевна', 'ИП Григорьев Вадим Иванович', 'ИП Григорьев Илья Андреевич',
  'ИП Громыко Сергей Павлович', 'ИП Гудеев Николай Павлович', 'ИП Гуленин Евгений Васильевич', 'ИП Гуров Сергей Михайлович',
  'ИП Гусев Владимир Семенович', 'ИП Гуцева Наталья Евгеньевна', 'ИП Давыдов Александр Валерьевич', 'ИП Данилов Антон Владимирович',
  'ИП ДЕМИЧЕВ АЛЕКСАНДР ЮРЬЕВИЧ', 'ИП Денисов Евгений Владимирович', 'ИП Денисов Роман Васильевич', 'ИП Димитренко Сергей Викторович',
  'ИП Дмитриев Алексей Анатольевич', 'ИП Дмитриева Татьяна Ефимовна', 'ИП Доедалин Роман Юрьевич', 'ИП Долганов Игорь Валериевич',
  'ИП Долгий Сергей Сергеевич', 'ИП Долгих Руслан Игоревич', 'ИП Долженко Александр Евгеньевич', 'ИП Донской Геннадий Сергеевич',
  'ИП Доронина Екатерина Айдеровна', 'ИП Дорохин Сергей Иванович', 'ИП Дорохов Лев Анатольевич', 'ИП Дрожжинов Михаил Анатольевич',
  'ИП Дубачев Алексей Владимирович', 'ИП Дубинцев Сергей Сергеевич', 'ИП Дубков Александр Евгеньевич', 'ИП Дубовицкий Алексей Александрович',
  'ИП Дубовсков Сергей Юрьевич', 'ИП Дудась Антон Сергеевич', 'ИП Дудиков Анатолий Павлович', 'ИП Душная Светлана Валерьевна',
  'ИП Егиазарян Рубен Гегамович', 'ИП Епифанов Сергей Георгиевич', 'ИП Еранова Айна Нурджановна', 'ИП Ерилова Анастасия Сергеевна',
  'ИП Жаркова Елена Абрамовна', 'ИП Жданов Андрей Юрьевич', 'ИП Жильцов Сергей Владимирович', 'ИП Житлов Вадим Вячеславович',
  'ИП Закирова Амелия Витальевна', 'ИП Захаров Борис Дмитриевич', 'ИП Зверев Даниил Эдуардович', 'ИП Землянухин Денис Николаевич',
  'ИП Земцов Сергей Викторович', 'ИП Зиадех Цесар', 'ИП Зиновик Наталья Алексеевна', 'ИП Золотарёв Александр Алексеевич',
  'ИП Золотарев Алексей Иванович', 'ИП Золотова Ирина Юрьевна', 'ИП Золотых Евдокия Ивановна', 'ИП Зуйкова Светлана Сергеевна',
  'ИП Зыков А.А.', 'ИП Зыков Вадим Александрович', 'ИП Иванов Максим Андреевич', 'ИП Иваногло Юлия Сергеевна',
  'ИП Игитова Сайёра Рузибаевна', 'ИП Игнатьев Юрий Геннадьевич', 'ИП Ильина Ольга Леонидовна', 'ИП Ильченко Александр Владимирович',
  'ИП Ильюшин Станислав Станиславович', 'ИП Индыков Андрей Владимирович', 'ИП Ип Комарова Марина Леонидовна', 'ИП Ип Панков Роман Романович',
  'ИП Исанов Василий Олегович', 'ИП Искандаров Геннадий Николаевич', 'ИП Истомин Сергей Александрович', 'ИП Кагальницкий Александр Игоревич',
  'ИП Каджаров Михаил Пирмухамедович', 'ИП Канищев Сергей Викторович', 'ИП Карапетян Ваче Алешаевич', 'ИП Карлова Татьяна Владимировна ИП',
  'ИП Картавцев Андрей Владимирович', 'ИП Карташов Артём Игоревич', 'ИП Каширина Ирина Алексеевна', 'ИП Квашнин Константин Сергеевич',
  'ИП Киризлеев Михаил Николаевич', 'ИП Кириллов Андрей Александрович', 'ИП Кириллова Дарья Владимировна', 'ИП Кирьянова Оксана Владимировна',
  'ИП Кирюшин Павел Алексеевич', 'ИП Киселева Ирина Владимировна', 'ИП Китаев Сергей Алексеевич', 'ИП Клевцова Елена Александровна',
  'ИП Клейменов Дмитрий Семенович', 'ИП Клейменова Мария Вячеславовна', 'ИП Ключников Николай Алексеевич', 'ИП Князева Надежда Сергеевна',
  'ИП Кобцев Иван Юрьевич', 'ИП Ковалева Татьяна Ивановна', 'ИП Колесников Александр Александрович', 'ИП Колесова Анастасия Алексеевна',
  'ИП Колодников Иван Вячеславович', 'ИП Коломыцев Иван Васильевич', 'ИП Колчин Роман Владимирович', 'ИП Колядина Елена Николаевна',
  'ИП Комаристая Лилия Петровна', 'ИП Коньшин Кирилл Дмитриевич', 'ИП Кораблин Юрий Владимирович', 'ИП Корнев Сергей Владимирович',
  'ИП Корнеева Елизавета Олеговна', 'ИП Корнеенков Никита Игоревич', 'ИП Корнийчук Полина Андреевна', 'ИП Корнюхина Галина Васильевна',
  'ИП Короп Виктор Юрьевич', 'ИП Коростылев Денис Александрович', 'ИП Котлярова Галина Викторовна', 'ИП Котов Антон Николаевич',
  'ИП Котов Олег Евгеньевич', 'ИП Кошлаков Николай Игоревич', 'ИП Кравцов Алексей Сергеевич', 'ИП Красильников Андрей Юрьевич',
  'ИП Красненко Александр Михайлович', 'ИП Краснова Анна Александровна', 'ИП Красноперов Алексей Николаевич', 'ИП Красноперов Максим Владимирович',
  'ИП Крейзер Игорь Вячеславович', 'ИП Кривчиков Иван Сергеевич', 'ИП Крохмаль Сергей Иванович', 'ИП Крючкова Ольга Васильевна',
  'ИП Кудинов Вадим Владимирович', 'ИП Кудинов Родион Юрьевич', 'ИП Кудымов Сергей Анатольевич', 'ИП Кузнецов Александр Васильевич',
  'ИП Кузнецов Максим Леонидович', 'ИП Кузнецов Сергей Вячеславович', 'ИП Кузнецова Ирина Алексеевна', 'ИП Кузнецова Мария Игоревна',
  'ИП Кузьменко Илья Сергеевич', 'ИП Кумицкий Олег Геннадьевич', 'ИП Куралесина Ольга Геннадьевна', 'ИП Курчевская Ирина Владимировна',
  'ИП Лаптев Виталий Владимирович', 'ИП Лаптева Светлана Алексеевна', 'ИП Лацыгина Ангелина Анатольевна', 'ИП Лебедев Денис Владимирович',
  'ИП Лебединский Степан Степанович', 'ИП Левина Елена Николаевна', 'ИП Левшакова Алина Александровна', 'ИП Леонова Людмила Владимировна',
  'ИП Лепендин Ярослав Павлович', 'ИП Лепехина Оксана Витальевна', 'ИП Лихачева Яна Валерьевна', 'ИП Лиштан Андрей Анатольевич',
  'ИП Логунова Наталия Станиславовна', 'ИП Ложкин Евгений Анатольевич', 'ИП Лыков Евгений Сергеевич', 'ИП Лысенко Наталья Александровна',
  'ИП Ляскин Алексей Иванович', 'ИП Майский Денис Олегович', 'ИП Маккамбаева Нургул Кубанычбековна', 'ИП Максимов Вячеслав Андреевич',
  'ИП Максимов Дмитрий Константинович', 'ИП Мальцева Юлия Викторовна', 'ИП Манукян Кероп Шавашович', 'ИП Марков Алексей Васильевич',
  'ИП Марченко Игорь Вячеславович', 'ИП Масанева Асет Митоевна', 'ИП Масленникова Маргарита Юрьевна', 'ИП Масловская Ангелина Александровна',
  'ИП Матвеева Валентина Валерьевна', 'ИП Матвеечев Евгений Витальевич', 'ИП Мацнев Денис Сергеевич', 'ИП Машин Алексей Владимирович',
  'ИП Мезавцов Владимир Евгеньевич', 'ИП Мельникова Наталья Владимировна', 'ИП Милашова Анна Валерьевна', 'ИП Михайловский Игорь Николаевич',
  'ИП Моисеев Анатолий Александрович', 'ИП Мокрицкая Наталья Владимировна', 'ИП Моренко Евгений Васильевич', 'ИП Моренков Алексей Николаевич',
  'ИП Москович Виталий Юрьевич', 'ИП Муратов Владислав Андреевич', 'ИП Мурыгин Антон Валерьевич', 'ИП Мчедлишвили Алекси Анзорович',
  'ИП Мягкий Дмитрий Петрович', 'ИП Мягков Михаил Евгеньевич', 'ИП Мягков Олег Вячеславович', 'ИП Мязина Ирина Николаевна',
  'ИП Мясоедова Анита Николаевна', 'ИП Нагорнова Татьяна Михайловна', 'ИП Надточев Николай Валерьевич', 'ИП Назаров Алексей Сергеевич',
  'ИП Небольсин Дмитрий Викторович', 'ИП Недоцук', 'ИП Неключенко Павел Олегович', 'ИП Немченко Сергей Владимирович',
  'ИП Нестеренко Дмитрий Алексеевич', 'ИП Нестерова Ксения Сергеевна', 'ИП Нестерова Ольга Павловна', 'ИП Неупокоев Михаил Михайлович',
  'ИП Нехаев Михаил Юрьевич', 'ИП Нецепляев Евгений Сергеевич', 'ИП Ниедре Андрей Михайлович', 'ИП Николаенков Андрей Михайлович',
  'ИП Никонов Юрий Александрович', 'ИП Никонова Марина Ивановна', 'ИП Никулин Кирилл Валерьевич', 'ИП Никулин Сергей Анатольевич',
  'ИП Нленд Нленд Ii Оксана Алексеевна', 'ИП Нленд Нленд Ii Самуэль', 'ИП Новикова Вера Викторовна', 'ИП Новикова Людмила Петровна',
  'ИП Носов Владимир Борисович', 'ИП Носова Людмила Владимировна', 'ИП Нугманова Ранета Абселямовна', 'ИП Обушенкова Дарья Сергеевна',
  'ИП Октябрьская Анна Владимировна', 'ИП Олейников Андрей Алексеевич', 'ИП Орлова Ольга Владимировна', 'ИП Орлова Яна Геннадьевна',
  'ИП Осинцева Елена Александровна', 'ИП Павлов Алексей Анатольевич', 'ИП Панин Вячеслав Сергеевич', 'ИП Панкова Любовь Николаевна',
  'ИП Панченко Сергей Александрович', 'ИП Папикян Василий Корюнович', 'ИП Пашенцев Максим Сергеевич', 'ИП Первухин Дмитрий Николаевич',
  'ИП Перевозчиков Василий Витальевич', 'ИП Петренко Алексей Михайлович', 'ИП Петренко Марина Михайловна', 'ИП Петренко Никита Вячеславович',
  'ИП Петришин Александр Анатольевич', 'ИП Петросян Грант Грачьяевич', 'ИП Писарева Анастасия Игоревна', 'ИП Плотников Павел Сергеевич',
  'ИП Плотников Юрий Борисович', 'ИП Плотницкий Станислав Игоревич', 'ИП Подвигин Альберт Алексеевич', 'ИП Подкопаев Геннадий Николаевич',
  'ИП Подоляко Вячеслав Анатольевич КГТ', 'ИП Подхолзина Ирина Александровна', 'ИП Поладова Фларида Фейзуллаевна', 'ИП Положенцев Павел Владимирович',
  'ИП Положенцев Сергей Александрович', 'ИП Полякова Елена Викторовна', 'ИП Полянская Валентина Иосифовна', 'ИП Понежа Дмитрий Вячеславович',
  'ИП Пономарев Александр Владимирович', 'ИП Попков Владислав Николаевич', 'ИП Попов Иван Александрович', 'ИП Попов Максим Игоревич',
  'ИП Попова Алёна Владимировна', 'ИП Попова Валентина Николаевна', 'ИП Попова Ирина Петровна', 'ИП Потанина Лариса Васильевна',
  'ИП Потапов Александр Константинович', 'ИП Потапов Илья Юльевич', 'ИП Прасолов', 'ИП Приображенская Евгения Владимировна',
  'ИП ПУГОВКИН АЛЕКСАНДР АНАТОЛЬЕВИЧ', 'ИП Пуртова Эмма Алексеевна', 'ИП ПУЧИН ВАДИМ АЛЕКСАНДРОВИЧ', 'ИП Радченко Дмитрий Владиславович',
  'ИП Радченко Евгений Павлович', 'ИП Радчук Евгений Андреевич', 'ИП Ракитянский Роман Викторович', 'ИП Раков Андрей Александрович',
  'ИП Раков Виктор Иванович', 'ИП Регул Наталья Валерьевна', 'ИП Рогатнев Александр Геннадьевич', 'ИП Родионова Мария Яновна',
  'ИП Ролдугин Дмитрий Александрович', 'ИП Романов Владислав Вячеславович', 'ИП Романцева Лилия Павловна', 'ИП Ромашкина Юлия Михайловна',
  'ИП Россинская Валерия Викторовна', 'ИП Рубайко Сергей Степанович', 'ИП Рубцова Ксения Владимировна', 'ИП Рудников Дмитрий Александрович',
  'ИП Ручкин Александр Сергеевич', 'ИП Рыбаков Игорь Викторович', 'ИП Рыжов Артем Николаевич', 'ИП Рыков Александр Александрович',
  'ИП Рыльков Сергей Иванович', 'ИП Рындыч Виктория Станиславовна', 'ИП Рябчиков Сергей Николаевич', 'ИП Рязанцева Анна Петровна',
  'ИП Савельев Андрей Сергеевич', 'ИП Савушкин Роман Валерьевич', 'ИП Садчикова Екатерина Викторовна', 'ИП Сакалов Александр Александрович',
  'ИП Салманов Саид Алик Оглы', 'ИП Сапожкова Наталья Николаевна', 'ИП Сапрунов Никита Сергеевич', 'ИП Сафонов Андрей Николаевич',
  'ИП Сафроний Роман Игоревич', 'ИП Седлова Алла Васильевна', 'ИП Седых Кристина Владимировна', 'ИП Селезнева Альбина Ивановна',
  'ИП Селиванов Александр Александрович', 'ИП Селиванов Владимир Викторович', 'ИП Селиверстов Павел Алексеевич', 'ИП Селиков Павел Альбертович',
  'ИП Семенов Алексей Анатольевич', 'ИП Семенов Игорь Владимирович', 'ИП Семенов С.О.', 'ИП Семенов Сергей Олегович',
  'ИП Семёнова Екатерина Игоревна', 'ИП Семенова Елена Леонидовна', 'ИП Семин Алексей Александрович', 'ИП Семыкина Марина Владимировна',
  'ИП Сергеева Алла Алексеевна', 'ИП Сероштан Елена Юрьевна', 'ИП Серпов Александр Станиславович', 'ИП Синицина Ирина Сергеевна',
  'ИП Скляров Игорь Владимирович', 'ИП Склярова Ольга Николаевна', 'ИП Скоморохов Даниил Николаевич', 'ИП Скороходов Илья Александрович',
  'ИП Слюсаренко Ефим Константинович', 'ИП Смирнова Людмила Валентиновна', 'ИП Смотров Денис Юрьевич', 'ИП Соболев Максим Александрович',
  'ИП Солодилов Иван Эдуардович', 'ИП Сосницких Алексей Анатольевич', 'ИП Сотников Михаил Олегович', 'ИП Стойчев Руслан Стойчевич',
  'ИП Стрижков Андрей Дмитриевич', 'ИП Стрыганов Андрей Александрович', 'ИП Студенников СА', 'ИП Стукалов Дмитрий Игоревич',
  'ИП Ступина Маргарита Евгеньевна', 'ИП Суетин Александр Эрнестович', 'ИП Суходольский Илья Андреевич', 'ИП Сухотерин Анатолий Серафимович',
  'ИП Сухочева Светлана Анатольевна', 'ИП Сычёв Александр Сергеевич', 'ИП Тамбовцев Валерий Владимирович', 'ИП Таранов Сергей Валентинович',
  'ИП Тарарин Павел Викторович', 'ИП Тахари Ахмед', 'ИП Тенищев Сергей Алексеевич', 'ИП Тимохин Дмитрий Иванович',
  'ИП Тимохина Виктория Викторовна', 'ИП Титова Ольга Григорьевна', 'ИП Тихомирова Наталья Сергеевна', 'ИП Ткачев Владимир Валерьевич',
  'ИП Ткаченко Дмитрий Анатольевич', 'ИП Токарев Валерий Александрович', 'ИП ТОПЛОВА ВЕРОНИКА ВЛАДИМИРОВНА', 'ИП Трапезников Владимир Александрович',
  'ИП Тригуб Елена Викторовна', 'ИП Троянова Кристина Сергеевна', 'ИП Туманевич Никита Вячеславович', 'ИП Тунгусков Виталий Викторович',
  'ИП Турищева Мария Витальевна', 'ИП Тюрин Валентин Тимофеевич', 'ИП Уваров Олег Станиславович', 'ИП Уржунцев Александр Александрович',
  'ИП Фатеева Раиса Александровна', 'ИП Федоров Павел Ефимович', 'ИП Федченко Артем Геннадьевич', 'ИП Фомин Иван Игоревич',
  'ИП Фонов Максим Анатольевич', 'ИП Фролов Алексей Алексеевич', 'ИП Фурсов Артем Алексеевич', 'ИП Хайленко Сергей Алексеевич',
  'ИП Хайченко Сергей Владимирович', 'ИП Харланов Александр Александрович', 'ИП Хвалев Сергей Викторович', 'ИП Хлусова Елизавета Михайловна',
  'ИП Хлызов Артем Олегович', 'ИП Ходырева Ксения Александровна', 'ИП Холодов Виталий Алексеевич', 'ИП Хомутов Дмитрий Александрович',
  'ИП Хрущев Кирилл Игоревич', 'ИП Хушбаков Эркинжон Мажидович', 'ИП Цуканова Юлия Дмитриевна', 'ИП Цыбульский Алексей Николаевич',
  'ИП Цыкова Виктория Вячеславовна', 'ИП Цыхманов Александр Алексеевич', 'ИП Часовских Вадим Владимирович', 'ИП Чеботарев Андрей Александрович',
  'ИП Чеботарева Галина Дмитриевна', 'ИП Чекалов Дмитрий Константинович', 'ИП Чекунов Михаил Владимирович', 'ИП Черкашин Владимир Николаевич',
  'ИП Черненко Ирина Петровна', 'ИП Чернов Константин Владимирович', 'ИП Черных Вероника Юрьевна', 'ИП Черных Игорь Геннадьевич',
  'ИП Черных Ирина Юрьевна', 'ИП Чернышов Даниил Александрович', 'ИП Чернюк Максим Александрович', 'ИП Черняев Евгений Александрович',
  'ИП Честных Дмитрий Валериевич', 'ИП Четвериков Анатолий Егорович', 'ИП Чикунов Никита Игоревич', 'ИП Чукаева Яна Алексеевна',
  'ИП Чулков Сергей Владимирович', 'ИП Чулкова Марина Вячеславовна', 'ИП Чупринов Павел Владимирович', 'ИП Чухлебова Ирина Сергеевна',
  'ИП Шадрина Татьяна Юрьевна', 'ИП Шайкин Дмитрий Евгеньевич', 'ИП Шаламова Ольга Вячеславовна', 'ИП Шамин Альберт Викторович',
  'ИП Шаров Андрей Евгеньевич', 'ИП Шатохина Алена Сергеевна', 'ИП Шатров Михаил Александрович', 'ИП Шафигуллин Ренат Раифович',
  'ИП Шевердяев Алексей Александрович', 'ИП Шевцов Филипп Сергеевич', 'ИП Шевцова Светлана Валерьевна', 'ИП Шевченко Дмитрий Дмитриевич',
  'ИП Шевченко Дмитрий Николаевич', 'ИП Шевчук', 'ИП Шевчук Денис Александрович', 'ИП Шелякина Надежда Владимировна',
  'ИП Шепелева Нина Ивановна', 'ИП Шестопалов Роман Евгениевич', 'ИП Шилов Илья Игоревич', 'ИП Ширяев Игорь Сергеевич',
  'ИП Шишкова Мария Анатольевна', 'ИП Школин Иван Николаевич', 'ИП Школьников Михаил Юрьевич', 'ИП Шкуренко Андрей Сергеевич',
  'ИП Шнипов Василий Максимович', 'ИП Штоль Артур Валерьевич', 'ИП Шумская Ирина Владимировна', 'ИП Шумыло Виктория Васильевна',
  'ИП Шурлаев Андрей Алексеевич', 'ИП Щербаков Максим Александрович', 'ИП Щербинин Валерий Валерьевич', 'ИП Юракова Татьяна Ивановна',
  'ИП Юренко Людмила Владимировна', 'ИП Юрканов Евгений Ильич', 'ИП Юров Павел Николаевич', 'ИП Яблоков Кирилл Глебович',
  'ИП Языков Роман Владимирович', 'ИП Якимов Виталий Альбертович', 'ИП Якимова Валентина Андреевна', 'ИП Яковлев Игорь Николаевич',
  'ИП Яковлева Майя Борисовна', 'ИП Ященко Мария Михайловна', 'Истомин Сергей Александрович', 'КАТИОН',
  'Квашнин Константин Сергеевич', 'КиберСервис склад 2', 'Кириллова Дарья Владимировна', 'Киселева Ирина Владимировна',
  'Клейменов Дмитрий Семенович', 'Климовск', 'Ковалева Татьяна Ивановна', 'Ковка Президент',
  'Коломыцев Иван Васильевич', 'Комфорт market', 'Котов Олег Евгеньевич', 'Крохмаль Сергей Иванович',
  'Крупногабарит', 'Кудрина Оксана Владимировна', 'Кузнецов Александр Васильевич', 'Курск',
  'Ленина КБТ', 'Лепендин Ярослав Павлович', 'Ливенцова Ирина Робертовна', 'Лисицкий Александр Владимирович',
  'Лунный Лес 1 день', 'Лунный Лес 2', 'Лунный Лес FBS', 'Лунный Лес белые',
  'Лысенко Наталья Александровна', 'М-Stоre 3', 'Максимов Вячеслав Андреевич', 'Масленникова Маргарита Юрьевна',
  'Мир багажников CargoSpace', 'Монарх-Воронеж Основной', 'Мурыгин Антон Валерьевич', 'Нагорнова Татьяна Михайловна',
  'Нео Лофт', 'Нестеренко Дмитрий Алексеевич', 'НОВЫЙ ИСТОК', 'НОВЫЙ ФОРМАТ VRN',
  'Носов Владимир Борисович', 'Одинцов Марк Константинович', 'ООО А.П.Р.', 'ООО КИД ЭНД ВУД',
  'ООО Металлопрофиль', 'ООО Мил-Агро С', 'ООО Спутник', 'ООО Урбан Мебель',
  'ООО Элита', 'ООО Ямаркет', 'ООО БьютиОпт', 'ООО ВИТАР С',
  'ООО Гипер', 'ООО Жемчужина', 'ООО ОТКРЫТЫЙ ИНЖИНИРИНГ', 'ООО ПЕППА',
  'ООО РМК-Проект', 'ООО СантехСмарт', 'ООО СТРОЙИНДУСТРИЯ ГРУПП', 'ООО ТД Сим-Экспорт',
  'ООО 4К', 'ООО prodC2C', 'ООО АБРА', 'ООО АВС - ЭЛЕКТРО',
  'ООО АВС ЦЕНТР', 'ООО АВТОТЕХРЕМОНТ', 'ООО Автоэлемент', 'ООО АГРО КАПИТАЛЪ ГРУПП',
  'ООО АГРОПРОМСНАБ', 'ООО АГРОХОЛДИНГ РАМОНСКАЯ ИНДЕЙКА', 'ООО АЛЕДА', 'ООО Алефкомп',
  'ООО АЛЬМАМЕД', 'ООО АПРО', 'ООО Аргон', 'ООО АРЕНА',
  'ООО АСТО-СЕРВИС', 'ООО АТЛАНТИДА', 'ООО АТОРГ', 'ООО БАННИК',
  'ООО Бриз', 'ООО БЫТДЕТАЛЬ', 'ООО ВВП', 'ООО ВЗМД',
  'ООО Волга', 'ООО ВОРОНЕЖЧАЙ', 'ООО ВР СРК АСО ПАРК КАНЬОН', 'ООО ВФК ПРОФ',
  'ООО ВЭИК', 'ООО ВЭЙ', 'ООО ГАЗСТРОЙПРОМ', 'ООО ГЕЛТА',
  'ООО ГК АБСОЛЮТ', 'ООО ГК ВЕКТОР', 'ООО ГК НОРДСИТИ', 'ООО ГОРОД ДЕТСТВА',
  'ООО ГУДПОРТ', 'ООО Движ', 'ООО Дельта-ВРН', 'ООО Дельтика',
  'ООО ДЖИКАМ', 'ООО ДОПАВТО', 'ООО ДОРЛОК ЧЕРНОЗЕМЬЕ', 'ООО ЕВРОПАК',
  'ООО Е-МАРКЕТ', 'ООО ЗАБОТА ДОМОВОГО', 'ООО ЗАВОД Л', 'ООО ЗООМИКС.36',
  'ООО ЗООПЛАНЕТА', 'ООО ИЗ СКАЗКИ', 'ООО И-НЕТ', 'ООО ИЦ ПРОМАТЕХ',
  'ООО КАСКАД', 'ООО КАТИОН', 'ООО КВАДРОПРЕСС', 'ООО КВАДРО-СТРОЙ',
  'ООО КВТ АЛЬЯНС', 'ООО КИД ЭНД ВУД', 'ООО КИЛОВАТТЫЧ', 'ООО КОЛЕСА ДАРОМ.РУ',
  'ООО КОМПАНИЯ РЕГИОНСНАБ', 'ООО КОМПАНИЯ ВЕСТ', 'ООО КОМПАНИЯ РАЗВИТИЯ СИНЕРГИЯ', 'ООО Компания Энкор',
  'ООО КОМПЛЕКТ', 'ООО КОНСТРУКТОР', 'ООО КОРОЕД', 'ООО КОРПОРАЦИЯ МЕТАЛЛИНВЕСТ',
  'ООО Кофе+Сервис', 'ООО КРОКУС', 'ООО КУДИЯР', 'ООО ЛАЗЕР-МАСТЕР',
  'ООО ЛВП', 'ООО ЛЕР', 'ООО ЛИДЕРЛАЙН', 'ООО ЛИНК-1',
  'ООО ЛУННЫЙ ЛЕС', 'ООО МАРАФОН', 'ООО МАРАФОН-ВОРОНЕЖ', 'ООО МЕТАЛЛИК ГРУПП',
  'ООО МЕТАЛЛОПРОФИЛЬ', 'ООО МЕТАЛЛОПРОФИЛЬ-РЕГИОН', 'ООО МЕТПРОФФ', 'ООО МИГЛИНК',
  'ООО МИСТЕРИЯ ЗВУКА 2.0', 'ООО МИТРА', 'ООО Мобильный дисконт', 'ООО МОБИТЕХ',
  'ООО МОДНАЯ КАНЦЕЛЯРИЯ', 'ООО МОНАРХ-ВОРОНЕЖ', 'ООО М-ТРАСТ', 'ООО МЯТА',
  'ООО НАДЕЖНЫЕ ОКНА', 'ООО НОВЫЙ ИСТОК', 'ООО НогТюрн', 'ООО ОКЕАНОПТ',
  'ООО ОНЛАЙНМАРКЕТ', 'ООО ПИФАГОР', 'ООО ПОЛИМЕР', 'ООО ПРАЙМ',
  'ООО ПРОБИЗНЕС', 'ООО ПРОМО-СИТИ', 'ООО ПРОМТЕХНИК', 'ООО ПРОРАЙДЕРЗ',
  'ООО ПРОФКОСМО-ВОРОНЕЖ', 'ООО ПРОФ-РОЯЛ', 'ООО РАДДЕР', 'ООО Реакон Плюс',
  'ООО РЕШЕНИЕ ЕСТЬ', 'ООО РИА', 'ООО РУСАРМОР', 'ООО РУССКАЯ ЛИНИЯ',
  'ООО РУССКИЙ ЛЕС', 'ООО РУСТРЕЙД', 'ООО СантехВоронеж', 'ООО САНТЕХСМАРТ',
  'ООО САНТЕХЦЕНТР - 1', 'ООО САТСПЕЙС', 'ООО СВ-Групп', 'ООО СВ-СТИЛЬ',
  'ООО СЕРВИСНО-МОНТАЖНАЯ КОМПАНИЯ АЛЬТАИР', 'ООО СИТИ-ТЕКС', 'ООО СИЭС МЕДИКА ЧЕРНОЗЕМЬЕ', 'ООО СКС+ПЛЮС',
  'ООО СКЭНАР-Терапия', 'ООО СЛЕБГУД', 'ООО СМАРТ ЛИНЗ', 'ООО СМ-ЦЕНТР',
  'ООО СОКРАТ', 'ООО СОТЕРА', 'ООО СПАСИЛЕН', 'ООО СПЕЦИАЛЬНАЯ МОДА',
  'ООО СПЕЦСТРОЙСНАБ', 'ООО ССГ', 'ООО СТАЙЛЕР', 'ООО СТАЛКЕР-КОНСАЛТИНГ',
  'ООО СТАФ', 'ООО Т И Т', 'ООО ТАТЛА', 'ООО ТД ЗЕЛЁНЫЕ ВОРОТА',
  'ООО ТД Ведуга', 'ООО ТД ЛЮМИТАР', 'ООО ТД ЭКО-ПРОДУКТ+', 'ООО ТДК',
  'ООО ТДСЗ', 'ООО ТЕПЛОКРОВЛЯ', 'ООО ТЕРРИТОРИЯ', 'ООО ТЕХКОМ',
  'ООО ТЕХНИКА В ДЕТАЛЯХ', 'ООО ТОРГОВАЯ ГИЛЬДИЯ', 'ООО ТОРГСТОЙКА', 'ООО ТРАНССИЛА',
  'ООО ТРАСТ-БИМ', 'ООО ТРИО', 'ООО ТРИТ', 'ООО ФАСАДЕЛЬ',
  'ООО ФОТОМАГАЗИН', 'ООО ХИТ', 'ООО ХОРДА', 'ООО ЦЕНТР КДМ',
  'ООО ЦЕНТР САНТЕХНИКИ', 'ООО Центрхимснаб', 'ООО Экомили', 'ООО Электротехническая компания',
  'ООО ЭЛЕМЕНТ', 'ООО ЭЛПРОМТОРГ', 'ООО ЮНИТЭК', 'ООО ЯНДЕКС.МАРКЕТ',
  'Основной FBS', 'Основной склад', 'Остатки по старым ценам 2', 'Остин',
  'Панченко Сергей Александрович', 'Плеханов Илья Николаевич', 'Плотницкий Станислав Игоревич', 'Поддоны FBS',
  'Полимер', 'Полякова Елена Викторовна', 'Попова Ирина Петровна', 'Прасолов Дмитрий',
  'Профессиональная косметика PROFLine', 'Радченко Евгений Павлович', 'Раков Андрей Александрович', 'Рамонь',
  'Роднит', 'Рубцов Руслан Викторович', 'Рубцова Ксения Владимировна', 'РУМИ мебель',
  'РУССКИЙ ЛЕС', 'РЦ Воронеж API', 'Рыльков Сергей Иванович', 'Сади трейд',
  'Сантех Про', 'САНТЕХСМАРТ', 'САНТЕХЦЕНТР - 1', 'САТСПЕЙС',
  'СваиТут', 'Семыкина Марина Владимировна', 'Склад Воронеж', 'Склад партнера ИП Дегтярёва Елена Николаевна',
  'Склад партнера ИП Камзина Юлия Дмитриевна', 'Склад партнера ИП Кривченкова Анна Анатольевна', 'Склад партнера ИП Скляров Игорь Владимирович', 'Склад партнера ООО КЕХ еКоммерц',
  'Скляров Игорь Владимирович', 'СЛК ЭТС', 'СОКРАТ', 'Сп',
  'СПЕЦЛЮК', 'СТАФ', 'Студенников Сергей Александрович', 'Стукалов Дмитрий Игоревич',
  'Суздалев упаковка', 'ТЕРРИТОРИЯ', 'Тимохина Виктория Викторовна', 'Токарев Валерий Александрович',
  'Топ Шина 24 Воронеж', 'ТРИТ', 'ТРИТ СТОК', 'Турищева Мария Витальевна',
  'Уютный Dом', 'Фабрика СТС', 'Фарид Мамедов Шамиль оглы', 'Фонов Максим Анатольевич',
  'Цема Виктория Александровна', 'Чернов Константин Владимирович', 'Черных Елена Николаевна', 'Чижик',
  'Чулков Сергей Владимирович', 'ШариКОТ', 'Шевцов Виталий Вячеславович', 'Шевцова Светлана Валерьевна',
  'Шепелева Нина Ивановна', 'Шкуренко Андрей Сергеевич', 'Шнипов Василий Максимович', 'Шурлаев Андрей Алексеевич',
  'Щербаков Максим Александрович', 'Эколайн 36', 'ЭЛЕКТРОТЕХСНАБ', 'ЮНИТЭК',
  'Чулков Сергей Владимирович', 'ШариКОТ', 'Шевцов Виталий Вячеславович', 'Шевцова Светлана Валерьевна',
  'Шепелева Нина Ивановна', 'Шкуренко Андрей Сергеевич', 'Шнипов Василий Максимович', 'Шурлаев Андрей Алексеевич',
  'Щербаков Максим Александрович', 'Эколайн 36', 'ЭЛЕКТРОТЕХСНАБ', 'ЮНИТЭК'
];

const direction__input = document.getElementById("recipient");
const direction__dropdownList = document.getElementById("dropdownList");
let previousValue = "";

function updateDropdownList() {
    let options = currentRappGeneratorType === 3 ? sellers__options : currentRappGeneratorType === 2 ? courier__options : direction__options;
    let search = direction__input.value.toLowerCase();
    
    direction__dropdownList.innerHTML = "";
    const filteredOptions = options.filter(option => option.toLowerCase().includes(search));
    
    if (filteredOptions.length === 0 && currentRappGeneratorType !== 3 && currentRappGeneratorType !== 2) {
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
                previousValue = option;
                direction__dropdownList.classList.remove("show");
                throttledGeneratePreview();
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
            if (direction__input.value === "") {
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

//~ Генератор этикеток

const printLabels = document.querySelector(".printLabels")
const labelGeneratorModal = document.querySelector(".labelGenerator-modal")
const labelGeneratorWindow = document.querySelector(".labelGenerator-window")

printLabels.addEventListener('click', () => {
  takeDataToLabels()
  labelGeneratorModal.classList.toggle('active');
  setTimeout(() => {
    labelGeneratorWindow.classList.remove("labelOnLoad")
  }, 50);
  const containerForModal = document.querySelector(".container")
  containerForModal.setAttribute("inert", true)
  function setupLabelModal() {
    if (!labelGeneratorModal || !labelGeneratorWindow) return;
    
    labelGeneratorModal.addEventListener('click', (event) => {
        if (!labelGeneratorWindow.contains(event.target)) {
            labelGeneratorModal.classList.remove("active")
            labelGeneratorWindow.classList.add("labelOnLoad")
            containerForModal.removeAttribute("inert")
        }
    });
  }
  setupLabelModal()
  generateLabelPDF()
});

//~ Генератор этикеток END

//~ Данные для генератора этикеток

const directionCross_north = "СЦ Грибки";
const directionCross_south = "СЦ Ростов";
const directionCross_unknow = "Нет инфо";

const direction_to_label_names = {
  "СЦ Домодедово ЕВСЦ": "north",
  "СЦ Яндекс Маркет Софьино ФФЦ": "north",
  "СЦ Яндекс Маркет Софьино Суперсклад": "north",
  "СЦ Яндекс Маркет Софьино КГТ": "north",
  "СЦ Тарный (Тарный Дропофф)": "north",
  "СЦ Липецк": "default",
  "СЦ Курск": "default",
  "СЦ Белгород": "default",
  "СЦ Ростов": "default",
  "СЦ Краснодар": "south",
  "Ростов КГТ": "south",
  "СЦ Строгино": "north",
  "СЦ Дзержинский": "north",
  "СЦ Троицкий": "north",
  "СЦ Казань": "north",
  "СЦ Запад": "north",
  "СЦ Самара": "north",
  "СЦ Грибки": "default",
  "СЦ Ставрополь": "south",
  "СЦ Дмитровское": "unknown",
  "СЦ СПБ Бугры": "north",
  "СЦ Ленинские горки": "unknown",
  "СЦ Муром": "unknown",
  "СЦ Челябинск": "unknown",
  "СЦ Чебоксары": "unknown",
  "СЦ Ижевск": "unknown",
  "СЦ Тюмень": "unknown",
  "СЦ Екатеринбург": "north",
  "СЦ Набережные Челны": "unknown",
  "СЦ Оренбург": "unknown",
  "СЦ Новосибирск": "unknown",
  "СЦ Барнаул": "unknown",
  "СЦ Вологда": "unknown",
  "СЦ Смоленск": "unknown",
  "СЦ Софьино ФФЦ": "north",
  "СЦ Софьино Суперсклад": "north",
  "СЦ Софьино КГТ": "north",
  "СЦ Тарный": "north"
};

const recipient_replacements = {
  "СЦ Яндекс Маркет Софьино ФФЦ": "СЦ Софьино ФФЦ",
  "СЦ Яндекс Маркет Софьино Суперсклад": "СЦ Софьино Суперсклад",
  "СЦ Яндекс Маркет Софьино КГТ": "СЦ Софьино КГТ",
  "СЦ Тарный (Тарный Дропофф)": "СЦ Тарный"
};

function takeDataToLabels() {
  const sender = document.getElementById("sender");
  const recipient = document.getElementById("recipient");
  const moveFrom = document.getElementById("moveFrom");
  const moveKross = document.getElementById("moveKross");
  const moveTo = document.getElementById("moveTo");

  if (sender && moveFrom) {
    moveFrom.value = sender.value;
  } else {
    console.error("Один из элементов не найден");
  }

  if (recipient && moveTo && moveKross) {
    let recipientValue = recipient.value;
    
    if (recipient_replacements.hasOwnProperty(recipientValue)) {
      recipientValue = recipient_replacements[recipientValue];
    }
    
    if (direction_to_label_names.hasOwnProperty(recipientValue)) {
      moveTo.value = recipientValue;
      const direction = direction_to_label_names[recipientValue];
      switch (direction) {
        case "north":
          moveKross.value = directionCross_north;
          defaultLabel = false
          break;
        case "south":
          moveKross.value = directionCross_south;
          defaultLabel = false
          break;
        case "unknown":
          moveKross.value = directionCross_unknow;
          defaultLabel = false
          break;
        case "default":
          defaultLabel = true
          break;
      }
    }
  } else {
    console.error("Один из элементов не найден");
  }
}

//~ Данные для генератора этикеток END

//~ Превью label

document.querySelector('.labelGenerator-reGenerate').addEventListener('click', generateLabelPDF);

function generateLabelPDF() {
    const isCross = document.querySelector(".labelGenerator-field:has(input#moveKross)")

    if(defaultLabel === false){
      isCross.setAttribute("isCross", true)
    }else if(defaultLabel === true){
      isCross.setAttribute("isCross", false)
    }

    const { jsPDF } = window.jspdf;
    const docLabeles = new jsPDF({ unit: 'cm', format: [10, 10] });
    docLabeles.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    docLabeles.setFont('Roboto');

    let labelName = currentRappGeneratorType === 1 ? "Заказы" : currentRappGeneratorType === 4 ? "Аномалии" : currentRappGeneratorType === 5 ? "Заказы" : "error"
    let getDate = document.getElementById("dateDisplay").innerText
    if(getDate.startsWith("___.")){
      labelDate = "-unwrited-"
    } else{
      labelDate = getDate
    }

    const moveFrom = document.querySelector('#moveFrom').value;
    const moveKross = document.querySelector('#moveKross').value;
    const moveTo = document.querySelector('#moveTo').value;
    const labelID = document.querySelector('#labelID').value;
    
    const previewBox = document.querySelector('.labelGenerator-previewBox');
    previewBox.innerHTML = '';
    
    for (let i = 0; i < 4; i++) {
        if (i > 0) docLabeles.addPage();
        
        if(defaultLabel === false){
          docLabeles.setFontSize(30);
          docLabeles.text(`${labelName} по РАПП`, 5, 1, { align: 'center', fontStyle: "bold"  });
  
          docLabeles.setLineWidth(0.05);
          docLabeles.rect(0, 1.7, 10, .005);
          
          docLabeles.setFontSize(10);
          docLabeles.text(`Номер РАПП: ${labelID} /// ${labelDate}`, 5, 1.45, { align: 'center', maxWidth: 9 });
          
          docLabeles.setFontSize(32);

          docLabeles.text(moveFrom, 5, 3.0, { align: 'center', maxWidth: 9 });
          
          docLabeles.addImage('img/labelArrow.png', 'PNG', 4.5, 3.5, 1, 1.25);
          
          docLabeles.text(moveKross, 5, 5.75, { align: 'center', maxWidth: 9 });
          
          docLabeles.addImage('img/labelArrow.png', 'PNG', 4.5, 6.2, 1, 1.25);
          
          docLabeles.text(moveTo, 5, 8.25, { align: 'center', maxWidth: 9 });

        }else if(defaultLabel === true){
          docLabeles.setFontSize(30);
          docLabeles.text(`${labelName} по РАПП`, 5, 1, { align: 'center', fontStyle: "bold"  });
  
          docLabeles.setLineWidth(0.05);
          docLabeles.rect(0, 1.7, 10, .005);
          
          docLabeles.setFontSize(10);
          docLabeles.text(`Номер РАПП: ${labelID} /// ${labelDate}`, 5, 1.45, { align: 'center', maxWidth: 9 });

          docLabeles.setFontSize(36);
          docLabeles.text(moveFrom, 5, 4.5, { align: 'center', maxWidth: 9 });
          docLabeles.addImage('img/labelArrow.png', 'PNG', 4.5, 5, 1.25, 1.5);
          docLabeles.text(moveTo, 5, 7.5, { align: 'center', maxWidth: 9 });
        }
    }
    
    // Генерация Blob и рендер в canvas
    const pdfBlob = docLabeles.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);
    
    const printLink = document.querySelector('a.labelGenerator-print');
    printLink.href = blobUrl;
    printLink.target = '_blank';
    
    for (let i = 0; i < 4; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = 300; // 10см
        canvas.height = 300; // 10см
        previewBox.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        pdfjsLib.getDocument(blobUrl).promise.then(pdf => {
            return pdf.getPage(i + 1);
        }).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height);
            const scaledViewport = page.getViewport({ scale });
            
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            
            const renderContext = {
                canvasContext: ctx,
                viewport: scaledViewport
            };
            return page.render(renderContext).promise;
        });
    }
}

//~ Превью label END

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
    setTimeout(() => {
      calendar.classList.remove("calendarOnLoad")
    }, 50);
    renderCalendar(selectedDate);
    const pdfFormModal = document.getElementById("pdf-form")
    const previewModal = document.querySelector(".preview")

    const containerForModal = document.querySelector(".container")
    containerForModal.setAttribute("inert", true)
    function setupCalendarModal() {
      const calendarModalWindow = document.getElementById('calendarModalWindow');
      
      if (!calendarModalWindow || !calendar) return;
      
      calendarModalWindow.addEventListener('click', (event) => {
          if (!calendar.contains(event.target)) {
              calendarModalWindow.classList.remove("active")
              calendar.classList.add("calendarOnLoad")
              containerForModal.removeAttribute("inert")
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
    container.removeAttribute("inert")
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
    container.removeAttribute("inert")
    throttledGeneratePreview()
});

noDayBtn.addEventListener('click', () => {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    dateDisplay.textContent = `___.${month}.${year}`;
    calendarModalWindow.classList.remove('active');
    renderCalendar(selectedDate); // Перерисовываем календарь
    container.removeAttribute("inert")
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
    textAreaOverLay__updateCanvas()
  }
});

redoBtn.addEventListener("click", () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    allOrders.value = history[historyIndex];
    allOrders.dispatchEvent(new Event("input", { bubbles: true }));
    throttledGeneratePreview();
    textAreaOverLay__updateCanvas()
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
  textAreaOverLay__updateCanvas()
});

document.getElementById("clearAllEmptyLines-btn").addEventListener("click", (event) => {
  event.preventDefault();
  let allOrders = document.querySelector(".allOrders");
  if (allOrders) {
    allOrders.value = allOrders.value
      .split("\n")
      .filter(line => line.trim() !== "")
      .join("\n");
      textAreaOverLay__updateCanvas()
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
  // const printDocument = document.querySelector("button.printDocument")
  // printDocument.setAttribute("disabled", true)

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
    
    const loaderContainerBlock = document.createElement("div");
    loaderContainerBlock.classList.add("loaderContainer-block")
    
    const loadingCircle = document.createElement("div");
    loadingCircle.classList.add("loaderContainerCircle")

    const loaderContainerIcon = document.createElement("i")

    loaderContainerIcon.classList.add("loaderContainerIcon", "fa-solid", "fa-rotate", "fa-spin-pulse");
    
    loaderContainer.appendChild(loaderContainerBlock);
    loaderContainerBlock.appendChild(loaderContainerIcon);
    loaderContainerBlock.appendChild(loadingCircle);
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
.map(line => line.trim().replace(/\s+/g, ' ').replace(/[()"'`]/g, ''))
.filter(line => line.length > 0);
ordersContainer.innerHTML = '';

  lines.forEach((line, index) => {
      line = line.replace(/[()"'`]/g, '');
      const parts = line.split(' ').filter(part => part.length > 0);

      let orderNumber = '';
      let cargoCode = '';
      let anomalyDescription = '';
      let extraComment = '';
      let orderType = '—'
      let oneRow = false;

      if(currentRappGeneratorType === 1 || currentRappGeneratorType === 2 || currentRappGeneratorType === 3){
        //~ МАГИСТРАЛИ • МАГИСТАРЛИ • МАГИСТАРЛИ 
        if(toggleStates.smartFormating === true){
          
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
          }else if (
            (firstPart.startsWith('VOZ') || firstPart.startsWith('PVZ') || firstPart.startsWith('FBS') || firstPart.startsWith('FBY')) && parts.length === 1) {
            orderNumber = firstPart;
            cargoCode = firstPart;
            oneRow = false;
          }else if (firstPart.startsWith('F1254')) {
            orderNumber = firstPart;
            cargoCode = 'ЛОТ';
            oneRow = false;
          }else if (firstPart.startsWith('F2254')) {
            orderNumber = firstPart;
            cargoCode = 'ТОТ (оборотная тара)';
            oneRow = false;
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
                  
            const allOrdersTextarea = document.querySelector(".allOrders");
            let lines = allOrdersTextarea.value.split("\n").map(line => {
              return line.replace(/^(\d{9,})-(\d+)$/, "$1 $1-$2");
            });
            allOrdersTextarea.value = lines.join("\n");
          }else {
              orderNumber = parts[0] || '';
              cargoCode = parts.slice(1).join(' ') || '';
              oneRow = false;
          }
        }
      }else{
        orderNumber = parts[0] || '';
        cargoCode = parts.slice(1).join(' ') || '';
        oneRow = false;
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
        }else{
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
    
        if (firstPart.startsWith('YP') || firstPart.startsWith('P0') || firstPart.startsWith('F0254'))  {
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
        } else if (firstPart.startsWith('VOZ') || firstPart.startsWith('PVZ') || firstPart.startsWith('FBS') || firstPart.startsWith('FBY')) {
          orderNumber = firstPart;
          cargoCode = firstPart;
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
          const allOrdersTextarea = document.querySelector(".allOrders");
          let lines = allOrdersTextarea.value.split("\n").map(line => {
            return line.replace(/^(\d{9,})-(\d+)$/, "$1 $1-$2");
          });
          allOrdersTextarea.value = lines.join("\n");
        }else {
            orderNumber = parts[0] || '';
            cargoCode = parts.slice(1).join(' ').split(' ')[0] || ''; // Только первая часть после пробела
            oneRow = false;
        }
    
        // Автоопределение типа грузоместа
        const lowerText = line.toLowerCase();
        if (lowerText.includes("дубль") || lowerText.includes("le,km") || lowerText.includes("dubll") || 
        lowerText.includes("dubl") || lowerText.includes("duble") || lowerText.includes("дуль") || 
        lowerText.includes("дуьл") || lowerText.includes("дубл") || lowerText.includes("дубиь") || 
        lowerText.includes("le,kmr") || lowerText.includes("le,kz") || lowerText.includes("le,kmd") || 
        lowerText.includes("дубьл") || lowerText.includes("дублл") || lowerText.includes("дубь") || 
        lowerText.includes("dubbyl") || lowerText.includes("dublb") || lowerText.includes("le,kmv") || 
        lowerText.includes("dublь") || lowerText.includes("dibl") || lowerText.includes("дубпь") || 
        lowerText.includes("дубv") || lowerText.includes("le,ln") || lowerText.includes("duibl") || 
        lowerText.includes("ду6ль") || lowerText.includes("дуб67ль") || lowerText.includes("le,km")) {
          orderType = "Дубль";
        } else if (lowerText.includes("lost") || lowerText.includes("лост") || lowerText.includes("лоst") || 
        lowerText.includes("l0st") || lowerText.includes("lst") || lowerText.includes("lozt") || 
        lowerText.includes("lostt") || lowerText.includes("lpst") || lowerText.includes("лоcт") || 
        lowerText.includes("л0ст") || lowerText.includes("losty") || lowerText.includes("loxt") || 
        lowerText.includes("loxst") || lowerText.includes("losts") || lowerText.includes("kjcn") ||
        lowerText.includes("дщые")) {
            orderType = "LOST";
        } else if ( lowerText.includes("засыл") || lowerText.includes("pfscp") || lowerText.includes("засл") || 
        lowerText.includes("засы") || lowerText.includes("засылл") || lowerText.includes("заысыл") || 
        lowerText.includes("засцыл") || lowerText.includes("засыь") || lowerText.includes("pfscpu") || 
        lowerText.includes("zasyl") || lowerText.includes("zasil") || lowerText.includes("zasul") || 
        lowerText.includes("zasl") || lowerText.includes("zasill") || lowerText.includes("zasuyl") ||
        lowerText.includes("pfcsk")) {
            orderType = "Засыл";
        } else if (lowerText.includes("невыкуп") || lowerText.includes("ytmdrel") || lowerText.includes("невыку") || 
        lowerText.includes("неvykup") || lowerText.includes("невыкуn") || lowerText.includes("неыкуп") || 
        lowerText.includes("невькуп") || lowerText.includes("невыкупп") || lowerText.includes("неаыкуп") || 
        lowerText.includes("неввыкуп") || lowerText.includes("nevykup") || lowerText.includes("nevuikup") || 
        lowerText.includes("niewykup") || lowerText.includes("nevykkup") || lowerText.includes("nvykup") || 
        lowerText.includes("nevycoup") || lowerText.includes("nevykyp") || lowerText.includes("nevykupz") ||
        lowerText.includes("ytdsreg")) {
          orderType = "Невыкуп";
        }      
      }

      if (currentRappGeneratorType === 1 || currentRappGeneratorType === 2 || currentRappGeneratorType === 3){
        if(toggleStates.extraCommentColumn === true){
          orderNumber = parts[0] || '';
          cargoCode = parts.length > 1 ? parts[1] : '';
  
          if (cargoCode.includes(' ')) {
              let cargoParts = cargoCode.split(' ');
              cargoCode = cargoParts[0]; // Берем только первую часть
              extraComment = cargoParts.slice(1).join(' '); // Остальное уходит в extraComment
          } else {
              extraComment = parts.length > 2 ? parts.slice(2).join(' ') : '';
          }
        }
      }
  
    
      const newOrderRow = document.createElement("div");
      newOrderRow.classList.add("order-row");
      newOrderRow.id = `orderRow-id-${index + 1}`

      newOrderRow.innerHTML = `
      <div class="orderRowNumber">${setcionNumber++}</div>

      <div class="orderData-container">
        <input
        type="text"
        class="orderData-input"
        id="orderNumber${index + 1}"
        value="${orderNumber}"
        placeholder="${
          currentRappGeneratorType === 1
          ?
          'Введите номер отправления'
          :
          currentRappGeneratorType === 2
          ?
          'Введите номер отправления'
          :
          currentRappGeneratorType === 3
          ?
          'Введите номер отправления'
          :
          currentRappGeneratorType === 4 
          ?
          'Номер аномалии'
          :
          currentRappGeneratorType === 5 
          ?
          'Введите номер отправления'
          :
          'Что-то сломлось'
        }"
         autocomplete="off">

        <label
        for="orderNumber${index + 1}"
        class="orderData-label">
        ${
          currentRappGeneratorType === 1
          ?
          'Номер отправления'
          :
          currentRappGeneratorType === 2
          ?
          'Номер отправления'
          :
          currentRappGeneratorType === 3
          ?
          'Номер отправления'
          :
          currentRappGeneratorType === 4 
          ?
          'Номер аномалии'
          :
          currentRappGeneratorType === 5 
          ?
          'Номер отправления'
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
            currentRappGeneratorType === 1
            ?
            'Код грузоместа' 
            :
            currentRappGeneratorType === 2
            ?
            'Код грузоместа' 
            :
            currentRappGeneratorType === 3
            ?
            'Код грузоместа' 
            :
            currentRappGeneratorType === 4 
            ?
            'Тикет аномалии' 
            :
            currentRappGeneratorType === 5 
            ?
            'Код грузоместа'
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
            currentRappGeneratorType === 1
            ?
            'Код грузоместа'
            :
            currentRappGeneratorType === 2
            ?
            'Код грузоместа'
            :
            currentRappGeneratorType === 3
            ?
            'Код грузоместа'
            :
            currentRappGeneratorType === 4 
            ?
            'Тикет аномалии' 
            :
            currentRappGeneratorType === 5 
            ?
            'Код грузоместа'
            :
            'Что-то сломлось'
          }
        </label>
        
        ${
          currentRappGeneratorType === 4
            ? 
            ''
            : 
            (oneRow === true
                ? 
                (currentRappGeneratorType === 1
                    ? 
                    `<button type="button" class="no-cargo buttonAutoDisabled"><i class="fa-solid fa-eye"></i></button>`
                    : 
                    `<button type="button" class="no-cargo"><i class="fa-solid fa-eye-slash"></i></button>`
                )
                : 
                `<button type="button" class="no-cargo"><i class="fa-solid fa-eye-slash"></i></button>`
            )
        }
      </div>

   

      ${
        currentRappGeneratorType === 4
        ?
        `
          <div class="orderData-container anomalyDescription-container">
            <input
            type="text"
            class="orderData-input"
            id="anomalyDescription${index + 1}"
            value="${anomalyDescription}"
            placeholder="Описание Аномалии"
            autocomplete="off">
            <label
            for="anomalyDescription${index + 1}"
            class="orderData-label">
              Описание Аномалии
            </label>
          </div>
        `
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
          </div>
        `
        :
        ``
      }
      
      ${
        currentRappGeneratorType === 1
        ?
        (toggleStates.extraCommentColumn === true
        ?
        `
          <div class="orderData-container extraCommentColum-container">
            <input
              type="text"
              class="orderData-input"
              id="extraComment${index + 1}"
              value="${extraComment}"
              placeholder="Комментарий"
              autocomplete="off"
            >
            <label
              for="extraComment${index + 1}"
              class="orderData-label">
              Комментарий
            </label>
          </div>
        `
        :
        ``
        )
        :
        currentRappGeneratorType === 2
        ?
        (toggleStates.extraCommentColumn === true
        ?
        `
          <div class="orderData-container extraCommentColum-container">
            <input
              type="text"
              class="orderData-input"
              id="extraComment${index + 1}"
              value="${extraComment}"
              placeholder="Комментарий"
              autocomplete="off"
            >
            <label
              for="extraComment${index + 1}"
              class="orderData-label">
              Комментарий
            </label>
          </div>
        `
        :
        ``
        )
        :
        currentRappGeneratorType === 3
        ?
        (toggleStates.extraCommentColumn === true
        ?
        `
          <div class="orderData-container extraCommentColum-container">
            <input
              type="text"
              class="orderData-input"
              id="extraComment${index + 1}"
              value="${extraComment}"
              placeholder="Комментарий"
              autocomplete="off"
            >
            <label
              for="extraComment${index + 1}"
              class="orderData-label">
              Комментарий
            </label>
          </div>
        `
        :
        ``
        )
        :
        ``
      }

      <div class="orderData-container">
        <input type="number" class="orderData-input orderData-inputCount" id="cargoCount${index + 1}" placeholder="Введите количество" value="1" autocomplete="off" min="1">
        <label for="cargoCount${index + 1}" class="orderData-label">Кол-во:</label>
      </div>

        ${currentRappGeneratorType === 1 && Math.random() < 0.01
        ?
        ``
        // `
        //   <div class="orderData-container">
        //     <input
        //       type="text"
        //       class="orderData-input"
        //       id="orderNumber${index + 1}"
        //       value="Ильяшенко - клоун 🤡"
        //       placeholder="Ильяшенко - клоун 🤡"
              
        //       readonly
        //       autocomplete="off">
      
        //     <label
        //       for="orderNumber${index + 1}"
        //       class="orderData-label">
        //       Чистая правда:
        //     </label>
        //   </div>
        // `
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

  textAreaOverLay__updateCanvas()
  throttledGeneratePreview()

}
//~ Сбор данных из textarea и заполнение их в order-row END

//~ Слушатель событий в TEXTAREA
document.querySelector("textarea.allOrders").addEventListener("input", function (event) {
  this.value = this.value.replace(/[()"'`]/g, ''); 
  getDataAndMakeOrderRow(event);
});
//~ Слушатель событий в TEXTAREA END

//~ Изменения из order-row в textarea

document.getElementById("orders-container").addEventListener("input", (event) => {
  const row = event.target.closest(".order-row");
  if (!row) return;

  const rowNumberElement = row.querySelector(".orderRowNumber");
  if (!rowNumberElement) return;

  const rowNumber = parseInt(rowNumberElement.textContent, 10) - 1;
  syncOrderRowToTextarea(rowNumber, row);
});

function syncOrderRowToTextarea(rowNumber, row) {
  const allOrdersTextarea = document.querySelector(".allOrders");
  let lines = allOrdersTextarea.value.split("\n");

  if (rowNumber < 0 || rowNumber >= lines.length) return;

  const orderNumber = row.querySelector("input[id^='orderNumber']").value.trim();
  const cargoCode = row.querySelector("input[id^='cargoCode']")?.value.trim() || "";
  const anomalyDescription = row.querySelector("input[id^='anomalyDescription']")?.value.trim() || "";
  const extraComment = row.querySelector("input[id^='extraComment']")?.value.trim() || "";
  const orderType = row.querySelector("select")?.value || "";

  let updatedLine = orderNumber;
  if (cargoCode) updatedLine += ` ${cargoCode}`;
  if (anomalyDescription) updatedLine += ` ${anomalyDescription}`;
  if (extraComment) updatedLine += ` ${extraComment}`;
  if (orderType && orderType !== "—") updatedLine += ` ${orderType}`;

  if (lines[rowNumber] === updatedLine) return;

  lines[rowNumber] = updatedLine;

  const activeElement = document.activeElement;
  const cursorPosition = activeElement.selectionStart;

  allOrdersTextarea.value = lines.join("\n");

  setTimeout(() => {
      if (document.activeElement !== activeElement) {
          activeElement.focus();
          activeElement.setSelectionRange(cursorPosition, cursorPosition);
      }
  }, 0);

  textAreaOverLay__updateCanvas();
}

//~ Изменения из order-row в textarea END

//~ Пересоздать файл

const reGenerateDocument = document.querySelector(".reGenerateDocument")
reGenerateDocument.addEventListener('click', ()=>{
  throttledGeneratePreview()
})

//~ Пересоздать файл END

let timeout;
function throttledGeneratePreview() {
  const pdfPrint = document.querySelector(".pdfPrint");
  const printLabels = document.querySelector(".printLabels");
  const iconHtml = `<i class="fa-regular fa-spinner-scale fa-spin-pulse"></i>`;
  if (!pdfPrint.innerHTML.includes(iconHtml)) {
      pdfPrint.innerHTML = iconHtml;
  }
  pdfPrint.removeAttribute("href");
  pdfPrint.setAttribute("disabled", "disabled");

  if (!printLabels.innerHTML.includes(iconHtml)) {
      printLabels.innerHTML = iconHtml;
  }
  printLabels.setAttribute("disabled", "disabled");

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
  const date = document.getElementById("dateDisplay").innerText;

  const actNumber = document.getElementById("actNumber");
  const typeMap = { 1: "m", 2: "c", 3: "s", 4: "a", 5: "z" };
  const randomString = Array.from({ length: 8 }, () => 
    Math.random() < 0.5 
      ? String.fromCharCode(48 + Math.floor(Math.random() * 10))
      : String.fromCharCode(65 + Math.floor(Math.random() * 26) + (Math.random() < 0.5 ? 32 : 0))).join("");
  let actNumber_data = `iRDG-${typeMap[currentRappGeneratorType] || "err"}:${randomString}`;
  actNumber.value = actNumber_data;
  const labelID = document.getElementById("labelID")
  labelID.value = actNumber_data;

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
    let anomalyDescription = anomalyDescriptionInit ? anomalyDescriptionInit.value : null;
    const extraCommentInit = row.querySelector(`#extraComment${index + 1}`);
    let extraComment = extraCommentInit ? extraCommentInit.value : null;
    const orderTypeInit = row.querySelector(`#selectOrderType${index + 1}`);
    let orderType = orderTypeInit ? orderTypeInit.value : "—";
    const cargoCount = parseInt(row.querySelector(`#cargoCount${index + 1}`).value);
    const isCargoDisabled = row.querySelector(`#cargoCode${index + 1}`).disabled;
    
    totalCargoCount += cargoCount;
  
    if(currentRappGeneratorType === 1 || currentRappGeneratorType === 2 || currentRappGeneratorType === 3){
      //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
      if(toggleStates.extraCommentColumn === true){
        if (isCargoDisabled) {
          orders.push([
            { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
            { content: orderNumber, colSpan: 2, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
            { content: extraComment, styles: { font: "Roboto", fontSize: 10} },
            { content: cargoCount.toString(), styles: { font: "Roboto", fontSize: 12} }
          ]);
        }else {
          orders.push([
            { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
            { content: orderNumber, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
            { content: cargoCode, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
            { content: extraComment, styles: { font: "Roboto", fontSize: 10} },
            { content: cargoCount.toString(), styles: { font: "Roboto", fontSize: 12} }
          ]);
        }
      } else if(toggleStates.extraCommentColumn === false){
        if (isCargoDisabled) {
          orders.push([
            { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
            { content: orderNumber, colSpan: 2, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
            { content: cargoCount.toString(), styles: { font: "Roboto", fontSize: 12} }
          ]);
        }else {
          orders.push([
            { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
            { content: orderNumber, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
            { content: cargoCode, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
            { content: cargoCount.toString(), styles: { font: "Roboto", fontSize: 12} }
          ]);
        }
      }
    }else if(currentRappGeneratorType === 4){
      //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
      orders.push([
        { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
        { content: orderNumber, styles: { font: "Roboto", fontSize: 12, fontStyle: "bold" } },
        { content: cargoCode, styles: { font: "Roboto", fontSize: 12, fontStyle: "bold" } },
        { content: anomalyDescription, styles: { font: "Roboto", fontSize: 9, fontStyle: "bold" } },
        { content: cargoCount.toString(), styles: { font: "Roboto", fontSize: 12} }
      ]);
    }else if(currentRappGeneratorType === 5){
      //~ ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST • ДУБЛИ/ЗАСЫЛЫ/LOST
      orders.push([
        { content: (index + 1).toString(), styles: { font: "Roboto", cellWidth: 10 } }, // Узкий столбец для № п/п
        { content: orderNumber, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
        { content: cargoCode, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
        { content: orderType, styles: { font: "Roboto", fontSize: 14, fontStyle: "bold" } },
        { content: cargoCount.toString(), styles: { font: "Roboto", fontSize: 12} }
      ]);
    }
  });
  // Строка "Итого"
  let totalRow = []
  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 2 || currentRappGeneratorType === 3){
    //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
    if(toggleStates.extraCommentColumn === true){
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
            lineColor: [0, 0, 0], // Цвет границы
            fontSize: 12
          }
        }
      ];
    }else if(toggleStates.extraCommentColumn === false){
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
            lineColor: [0, 0, 0], // Цвет границы
            fontSize: 12
          }
        }
      ];
    }
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
          lineColor: [0, 0, 0], // Цвет границы
          fontSize: 12
        }
      }
    ];
  }

  // Стили таблицы
  let tableStyles = {};
  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 2 || currentRappGeneratorType === 3){
    //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
    if(toggleStates.extraCommentColumn === true){
      tableStyles = {
        headStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
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
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
          3: { cellWidth: 45 },
          4: { cellWidth: 25 }
        }
      }
    } else if(toggleStates.extraCommentColumn === false){
      tableStyles = {
        headStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
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
    }
  }else if(currentRappGeneratorType === 4){
    //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
    tableStyles = {
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
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
  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    doc.text(`Отправитель: ${sender}`, 5, 65);
  }else{
    doc.text(`Отправитель: ИП Боровлев Дмитрий Алексеевич, СЦ МК Воронеж, ${sender}`, 5, 75);
  }

  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    doc.text("Адрес Отправителя: Воронежская область, Айдаровское сельское поселение, 2-я Промышленная зона, д. 27", 5, 70, { maxWidth: 190 });
  }else{
    doc.text("", 5, 70, { maxWidth: 190 });
  }

  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    doc.text(`Получатель: ${recipient}`, 5, 90);
  }else if(currentRappGeneratorType === 2){
    doc.text(`Получатель (Субподрядчик): ${recipient}`, 5, 85);
  }else{
    doc.text(`Получатель: ${recipient}`, 5, 85);
  }

  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    doc.text(`Адрес получателя: ${recipientAddresses[recipient]}`, 5, 95, { maxWidth: 190 });
  }else{
    doc.text("", 5, 95, { maxWidth: 190 });
  }

  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    doc.text("Заказчик: ООО «Яндекс»", 5, 110);
  }else{
    doc.text("Заказчик: ООО «Яндекс»", 5, 65);
  }

  doc.setFontSize(10);
  if(currentRappGeneratorType === 1 || currentRappGeneratorType === 4 || currentRappGeneratorType === 5){
    doc.text("Настоящий акт составлен о том, что в дату подписания настоящего Акта Получателем Отправитель передал, а Получатель принял следующие нижеуказанные Отправления (номера отправлений в соответствии с данными ПО СЦ)/грузоместа с визуальной проверкой целостности транспортной (если нет, то фирменной) упаковки, без проверки и пересчёта Отправлений:", 5, 115, { maxWidth: 190, fontSize: 10 });
  }else if (currentRappGeneratorType === 2){
    doc.text("Настоящий акт составлен о том, что в указанную выше дату (дата приема Отправления) Отправитель передал, а Исполнитель (Субподрядчик) принял следующие Отправления для передачи Получателю:", 5, 95, { maxWidth: 190, fontSize: 10 });
  }else if (currentRappGeneratorType === 3){
    doc.text("Настоящий акт составлен о том, что в указанную выше дату (дату возврата Товаров) Исполнитель в лице Складского Оператора/Субподрядчика передал, а Получатель принял следующие Товары:", 5, 95, { maxWidth: 190, fontSize: 10 });
  }else{
    doc.text("Что-то сломалось", 5, 115, { maxWidth: 190, fontSize: 10 });
  }
  doc.setTextColor("#000");

  // Генерация таблицы
  if(currentRappGeneratorType === 1){
    //~ МАГИСТРАЛИ • МАГИСТРАЛИ • МАГИСТРАЛИ
    if(toggleStates.extraCommentColumn === true){
      doc.autoTable({
        startY: 135,
        head: [["№ п/п", "Номер отправления в системе заказчика", "Код грузоместа", "Комментарий", "Кол-во грузомест"]],
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
    }else if(toggleStates.extraCommentColumn === false){
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
    }
  }else if(currentRappGeneratorType === 2 || currentRappGeneratorType === 3){
    //~ Курьеры/Мерчи • Курьеры/Мерчи • Курьеры/Мерчи
    if(toggleStates.extraCommentColumn === true){
      doc.autoTable({
        startY: 105,
        head: [["№ п/п", "Номер отправления в системе заказчика", "Код грузоместа", "Комментарий", "Кол-во грузомест"]],
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
    }else if(toggleStates.extraCommentColumn === false){
      doc.autoTable({
        startY: 105,
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
    }
  }else if(currentRappGeneratorType === 4){
    //~ АНОМАЛИИ • АНОМАЛИИ • АНОМАЛИИ
    doc.autoTable({
      startY: 135,
      head: [["№ п/п", "Номер аномалии", "Тикет аномалии", "Описание", "Кол-во грузомест"]],
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
    setTimeout(() => {
      pdfPrintLink.href = blobUrl;
      pdfPrintLink.target = "_blank";
      
      setTimeout(() => {
        const pdfPrint = document.querySelector(".pdfPrint")
        pdfPrint.innerHTML = `<i class="fa-solid fa-print fa-beat-fade"></i>`
        pdfPrint.removeAttribute("disabled")

        const printLabels = document.querySelector(".printLabels")
        printLabels.innerHTML = `<i class="fa-solid fa-note-sticky fa-bounce"></i>`
        printLabels.removeAttribute("disabled")
        
      }, 50);
    }, 2000);
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

  const loaderContainerBlock = document.createElement("div");
  loaderContainerBlock.classList.add("loaderContainer-block")
  
  const loadingCircle = document.createElement("div");
  loadingCircle.classList.add("loaderContainerCircle", "loaderContainerCircleRender")

  const loaderContainerIcon = document.createElement("i")
  loaderContainerIcon.classList.add("loaderContainerIcon", "loaderContainerIconRender", "fa-solid", "fa-rotate", "fa-spin-pulse");

  loaderContainer.appendChild(loaderContainerBlock);
  loaderContainerBlock.appendChild(loaderContainerIcon);
  loaderContainerBlock.appendChild(loadingCircle);
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
    canvasContainer.style.overflowY = "scroll";
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