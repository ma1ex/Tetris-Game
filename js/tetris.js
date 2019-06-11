/**
 * Tetris engine
 */

'use strict';

// Создание основного элемента, содержащего сетку
 let tetris = document.createElement('div');
 tetris.classList.add('tetris');

 // Отрисовка 180-ти ячеек поля (18x10)
for (let i = 0; i < 181; i++) {
    let excel = document.createElement('div');
    
    // Тестовая закраска стартовых ячеек для дебага
    /* if (i < 20) {
        excel.classList.add('excel-test');
    } */

    excel.classList.add('excel');
    tetris.appendChild(excel);
}

// Вставка сформированной сетки в div-обертку
let main = document.getElementsByClassName('main')[0];
main.appendChild(tetris);

// Задание координат для каждой ячейки
let excel = document.getElementsByClassName('excel');
let i = 0;

/**
 * Назначение координат каждой ячейке.
 * Как это работает.
 * Отрисовка (назначение координат) происходит с самой верхней слева ячейки
 * слева направо сверху вниз. Т.е. первый цикл отвечает за ряды, а вложенный
 * за столбцы.
 */
for (let y = 18; y > 0; y--) {
    for (let x = 1; x < 11; x++) {
        excel[i].setAttribute('posX', x);
        excel[i].setAttribute('posY', y);
        i++;
    }
}

// Координаты для визуализации построения фигур; слева направо снизу вверх;
// От этих координат путем сложения или вычитания (отрицательные единицы)
// отрисовываются фигуры. 
// Например, для квадрата начальная точка отсчета по горизонтали (ось X)  
// равна 5 - это первая ячейка для отрисовки; двигаясь вправо, следующая точка
// на одну единицу вправо по оси X (по горизонтали), т.е. +1 к имеющейся 
// координате X, что по факту получается x = 6. Далее, двигаемся вверх по 
// оси Y и третья точка находится y + 1, а X остается в начальной позиции.
// Получается такая картина:
// [1, 0] -> [X вправо на +1, Y остается на месте]
// [0, 1] -> [X остается на месте, Y вверх на +1]
// [1, 1] -> [X вправо на +1, Y вверх на +1]
let x = 5, 
    y = 15;

/**
 * Трехмерный массив с фигурами: 
 * mainArr[номер фигуры][строка с координатами X и Y][ячейка с координатой X или Y]
 */
// [x, y] -> [->, ^]
let mainArr = [
    // Балка
    [
        [0, 1],
        [0, 2],
        [0, 3]
    ],

    // Квадрат
    [
        [1, 0],
        [0, 1],
        [1, 1],
    ],

    // Фигура L
    [
        [1, 0],
        [0, 1],
        [0, 2],
    ],

    // Фигура зеркальная L
    [
        [1, 0],
        [1, 1],
        [1, 2],
    ],

    // Фигура "молния" Z
    [
        [1, 0],
        [-1, 1],
        [0, 1],
    ],

    // Фигура зеркальная "молния" Z
    [
        [1, 0],
        [1, 1],
        [2, 1],
    ],

    // Фигура "Lego"
    [
        [1, 0],
        [2, 0],
        [1, 1],
    ]
];

// Текущая фигура, выбранная генератором псевдослучайных чисел; 
// выбирается из массива фигур и далее с ней происходит основная работа
let currentFigure = 0;
// Массив с координатами для дальнейшей закраски
let figureBody = 0;

// Функция создания фигуры
function create() {
    // Получение случайного числа в пределах длины массива с фигурами
    let getRandom = () => Math.round( Math.random() * (mainArr.length-1) );
    currentFigure = getRandom();
   
    // Формирование фигуры по заданным исходным координатам;
    // в этом массиве массив
    figureBody = [
        // Начальные координаты поля откуда начинается отрисовка
        document.querySelector(`[posX = "${x}"][posY = "${y}"]`),
        // Координаты получаем из атрибута элемента (ячейки) posX="" и posY="",
        // которые предварительно вносили циклом после отрисовки игрового поля.
        // начальная координата X или Y + mainArr[номер фигуры][строка с координатами X и Y][ячейка с координатой X или Y]
        document.querySelector(`[posX = "${x + mainArr[currentFigure][0][0]}"][posY = "${y + mainArr[currentFigure][0][1]}"]`),
        document.querySelector(`[posX = "${x + mainArr[currentFigure][1][0]}"][posY = "${y + mainArr[currentFigure][1][1]}"]`),
        document.querySelector(`[posX = "${x + mainArr[currentFigure][2][0]}"][posY = "${y + mainArr[currentFigure][2][1]}"]`)
    ];

    // Присвоение CSS-стиля к ячейкам сформированной фигуры - закраска
    for (let i = 0; i < figureBody.length; i++) {
        figureBody[i].classList.add('figure');
    }

}
create();

function move() {
    // Флаг разрешения движения фигуры вниз; если true - то можно
    let moveFlag = true;
    // Массив массивов с координатами фигуры
    let coordinates = [
        [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')],
        [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')],
        [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')],
        [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')]
    ];

    // В цикле в условии проверяется достигла ли фигура дна поля, т.е. координат
    // по оси Y нуля (это второй элемент массива 
    // coordinates[здесь строка с координатами X и Y][этот]), а также наличия 
    // нижележащих фигур (определяется по наличию класса .set у фигуры)
    for (let i = 0; i < coordinates.length; i++) {
        if (coordinates[i][1] == 1 || document.querySelector(`[posX = "${coordinates[i][0]}"][posY = "${coordinates[i][1] - 1}"]`).classList.contains('set')) {
            moveFlag = false;
            break;
        }
    }

    // Если движение вниз возможно, то...
    if(moveFlag) {
        // удаляем у фигуры класс .figure
        for (let i = 0; i < figureBody.length; i++) {
            figureBody[i].classList.remove('figure');
        }

        // после заново перезаписываем координаты падающей фигуры, где posX оставляем
        // без изменений, а posY понижаем на единицу
        figureBody = [
            document.querySelector(`[posX = "${coordinates[0][0]}"][posY = "${coordinates[0][1] - 1}"]`),
            document.querySelector(`[posX = "${coordinates[1][0]}"][posY = "${coordinates[1][1] - 1}"]`),
            document.querySelector(`[posX = "${coordinates[2][0]}"][posY = "${coordinates[2][1] - 1}"]`),
            document.querySelector(`[posX = "${coordinates[3][0]}"][posY = "${coordinates[3][1] - 1}"]`)
        ];

        // Снова присваиваем CSS-стиль .figure, т.е. закрашиваем
        for (let i = 0; i < figureBody.length; i++) {
            figureBody[i].classList.add('figure');
        }
    } else { // далее описываем логику, если движение вниз невозможно
        // удаление класса .figure и присвоение класса .set
        for (let i = 0; i < figureBody.length; i++) {
            figureBody[i].classList.remove('figure');
            figureBody[i].classList.add('set');
        }

        // Всё, фигура лежит или на низу, или на другой фигуре, значит,
        // инициируем появление новой
        create();
    }
}

// Вызов функции движения фигур с интервалом в 300 миллисекунд
let interval = setInterval(() => {
    move();
}, 300);

// Управление фигурами
let flag = true;

window.addEventListener('keydown', function(e) {
    // Получение координат фигуры
    let coordinates1 = [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')];
    let coordinates2 = [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')];
    let coordinates3 = [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')];
    let coordinates4 = [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')];

    // Определение координат новой фигуры в пространстве
    function getNewState(a) {
        // При каждом вызове функции флаг признака падения сбрасывается
        flag = true;

        // Массив с гипотетической фигурой, в которой отслеживаются координаты
        // по оси X, а Y остается без изменений, т.к. перемещение происходит
        // только по горизонтали соответственно.
        // Аргументом функции "a" передается позиция смещения фигуры:
        // если -1, то влево, если 1, то вправо. Y не изменяется.
        // P.$. "+" перед coordinates1[0] для преобразования string в int, чтобы
        // прошла операция суммирования чисел, а не строк.
        let figureNew = [
            document.querySelector(`[posX = "${+coordinates1[0] + a}"][posY = "${coordinates1[1]}"]`),
            document.querySelector(`[posX = "${+coordinates2[0] + a}"][posY = "${coordinates2[1]}"]`),
            document.querySelector(`[posX = "${+coordinates3[0] + a}"][posY = "${coordinates3[1]}"]`),
            document.querySelector(`[posX = "${+coordinates4[0] + a}"][posY = "${coordinates4[1]}"]`),
        ];

        // Проверка возможности перемещения влево-вправо
        for (let i = 0; i < figureNew.length; i++) {
            // Если фигура не существует или существует, но с классом .set (т.е. неподвижна),
            if (!figureNew[i] || figureNew[i].classList.contains('set')) {
                // значит перемещение запрещаем.
                flag = false;
            }
        }

        // Если же все хорошо и перемещение возможно
        if (flag == true) {
            // удаляем у фигуры класс .figure у тех координат, где была нажата
            // клавиша управления
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.remove('figure');
            }
            
            // Присваиваем фигуре новые координаты
            figureBody = figureNew;

            // И снова добавляем класс .figure по новым координатам
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.add('figure');
            }
        }
    }

    // Реакция на клавиши управления
    // Если нажата стрелка влево, то смещаем фигуру на одну позицию влево, 
    // т.е. на -1 по оси X
    if (e.keyCode == 37) {
        getNewState(-1);
    } else if (e.keyCode == 39) { // Стрелка вправо
        getNewState(1);
    } else if (e.keyCode == 40) { // Если стрелка вниз - ускоряем падение
        move();
    }
});
