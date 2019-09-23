var field = document.querySelector('.field'); // Определяем поле для рисования
var ctx = field.getContext('2d'); // Определяем контекст двумерный рисования
var palette = document.querySelector('.color'); // Палитра
var sizeList = document.querySelectorAll('.size'); // Рызмеры кисти
var clear = document.querySelector('.clear');
var save = document.querySelector('.save');

var color; // Цвет кисти
var radius = 5; // Размер кисти

// Загружаем последний сохранённый рисунок из localStorage.
var key = getNamePicture(); // Ключ последнего сохраненного рисунка
if (key != 'рисунок-undefined') {
    drawPictire(key);
    alert('Загружен рисунок name: "' + key + '"');
} else {
    alert('Нет сохранённых рисунков');
}


var check = localStorage['change'];
setInterval(checkedSave, 1000);

function checkedSave() { // Функция проверяет изменился ли рисунок на одной из вкладок
    if (check != localStorage['change']) {
        // savePicture(generationNamePicture()); // Сохраняем текущие рисунки на всех вкладках
        // drawPictire('clone') // Рисуем рисунок, который был сохранён, на всех вкладках
        drawPictire(getNamePicture()); // Рисуем рисунок, который был сохранён, на всех вкладках
        check = localStorage['change'];
    }
}

palette.oninput = function(e) { // Выбираем цвет
    color = this.value; // Изменяем цвет
    for (var i = 0; i < sizeList.length; i++) { //Изменяем цвета контролов размера кисти
        sizeList[i].style.backgroundColor = this.value;
    }
}

field.onmousedown = function(e) { // Нажатие клавиши мыши
    field.onmousemove = function(e) { // Движение курсора в поле
        var x = e.offsetX; // Координата курсора X
        var y = e.offsetY; // Координата курсора Y
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2,true); // Рисуем круг с радиусом 5px
        ctx.fillStyle = color; // Присваеваем цвет
        ctx.fill();
    }
    field.onmouseup = function(e) { // Отпускаем клавишу мыши
        field.onmousemove = null;
    }
}

for (var i = 0; i < sizeList.length; i++) {
    sizeList[i].addEventListener('click', function() { // Клик по размеру кисти
        for (var i = 0; i < sizeList.length; i++) {
            sizeList[i].classList.remove('selected'); // Удаляем предыдущий выборанный размер кисти
        } 
        this.classList.add('selected'); // Выбираем размер
        radius = this.getAttribute('data-size'); // Присваеваем размер
    });
}

clear.addEventListener('click', function() { // Клик 'очистить'
    clearPicture();
});

save.addEventListener('click', function() { // Клик 'сохранить'
    // localStorage.setItem('clone', field.toDataURL());
    savePicture(generationNamePicture()); // Сохраняем рисунок в localStorage
    if ((localStorage['change'] === undefined) || (localStorage['change'] == 0)) {
        localStorage['change'] = 1;
    } else {
        localStorage['change'] = 0;
    }
});

function getNamePicture() { // Функция возвращает ключ последнего сохранённого рисунка
    var array = [];
    for (var i=0; i < localStorage.length; i++)  {
        if (localStorage.key(i).indexOf('рисунок-') > -1) {
            array.push(parseInt(localStorage.key(i).replace('рисунок-',''))); // Записываем уникальные имена в отдельный массив
        }
    }
    array.sort(); // Сортируем массив по возрастанию
    return 'рисунок-' + array[array.length - 1]; // Возвращаем имя последнего сохранённного рисунока
}

function drawPictire(name) { // Функция отрисовки рисунка
    var dataURL = localStorage.getItem(name);
    var img = new Image;
    img.src = dataURL;
    img.onload = function() {
        ctx.drawImage(img, 0, 0); 
    }
}

function generationNamePicture() { // Функция генарция uniqueName для рисунка
    var date = new Date;
    return 'рисунок-' + date.setTime(date);// Возвращаем новое название
}

function savePicture(name) { // Функция сохранения рисунка
    localStorage.setItem(name, field.toDataURL()); // Сохраняем изображение в localStorage
    alert('Рисунок сохранён! name: ' + name); // 'localStorage["namePicture"]'
}

function clearPicture() { // Функция удаления рисунка
    ctx.clearRect(0, 0, field.width, field.height);
}