/**
 * Tetris engine
 */

'use strict';

let speed = 0; // Скорость падения фигур

/**
 * Начальный экран (сцена) при загрузке игры
 */
function introScene() {
    let overlay = document.querySelector('.overlay'); // Перекрывающий слов на всю страницу
    let modal = document.querySelector('.modal');     // Окно выбора уровня сложности
    
    /* if(modal.style.display == 'none' && overlay.style.display == 'none') {
        modal.style.display = 'flex';
        overlay.style.display = '';
    } */

    // Реакция на события нажатия кнопок выбора уровня сложности
    modal.addEventListener('click', function(e) {
        if (e.target.classList.contains('easy')) {
            speed = 1000;
        } else if (e.target.classList.contains('normal')) {
            speed = 500;
        } else if (e.target.classList.contains('hard')) {
            speed = 200;
        }

        // После того, как выбор был сделан, скрываем слой и модальное окно и стартуем игру
        if (e.target.classList.contains('button')) {
            modal.style.display = 'none';
            overlay.style.display = 'none';
            startGame();

        }
    });
}
introScene();


/**
 * Функция со всей логикой игры
 */
function startGame() {
    // Создание основного элемента DOM, содержащего сетку игрового поля
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
     * за столбцы - за один проход внешнего цикла, внутренний производит 10 итераций.
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
     * Четырехмерный массив с фигурами: 
     * mainArr:
     *  [номер фигуры]
     *  [ячейки 0,1,2 - координаты отрисовки фигуры; 3,4,5,6 - строки с координатами поворота]
     *  [запись 0 - X, запись 1 - Y] - для ячеек с 0-й до 2-й координаты отрисовки фигуры; для ячеек с 3-й по 6-ю - координаты поворота
     *  [запись 0 - X, запись 1 - Y] - координаты поворота фигуры; подмассив доступен с 3-й по 6-ю ячейку родительского подмассива
     */
    // [x, y] -> [->, ^]
    let mainArr = [
        // Балка
        [
            [0, 1],
            [0, 2],
            [0, 3],

            // Поворот на 90 градусов
            [
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],
            // Поворот на 180 градусов
            [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ],
            // Поворот на 270 градусов
            [
                [-1, 1],
                [0, 0],
                [1, -1],
                [2, -2]
            ],
            // Поворот на 360 градусов
            [
                [1, -1],
                [0, 0],
                [-1, 1],
                [-2, 2]
            ]
        ],

        // Квадрат
        [
            [1, 0],
            [0, 1],
            [1, 1],
            
            // Поворот на 90 градусов
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            // Поворот на 180 градусов
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            // Поворот на 270 градусов
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            // Поворот на 360 градусов
            [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ]
        ],

        // Фигура L
        [
            [1, 0],
            [0, 1],
            [0, 2],

            // Поворот на 90 градусов
            [
                [0, 0],
                [-1, 1],
                [1, 0],
                [2, -1]
            ],
            // Поворот на 180 градусов
            [
                [1, -1],
                [1, -1],
                [-1, 0],
                [-1, 0]
            ],
            // Поворот на 270 градусов
            [
                [-1, 0],
                [0, -1],
                [2, -2],
                [1, -1]
            ],
            // Поворот на 360 градусов
            [
                [0, -1],
                [0, -1],
                [-2, 0],
                [-2, 0]
            ]
        ],

        // Фигура зеркальная L
        [
            [1, 0],
            [1, 1],
            [1, 2],

            // Поворот на 90 градусов
            [
                [0, 0],
                [0, 0],
                [1, -1],
                [-1, -1]
            ],
            // Поворот на 180 градусов
            [
                [0, -1],
                [-1, 0],
                [-2, 1],
                [1, 0]
            ],
            // Поворот на 270 градусов
            [
                [2, 0],
                [0, 0],
                [1, -1],
                [1, -1]
            ],
            // Поворот на 360 градусов
            [
                [-2, 0],
                [1, -1],
                [0, 0],
                [-1, 1]
            ]
        ],

        // Фигура "молния" Z
        [
            [1, 0],
            [-1, 1],
            [0, 1],

            // Поворот на 90 градусов
            [
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],
            // Поворот на 180 градусов
            [
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ],
            // Поворот на 270 градусов
            [
                [0, -1],
                [-1, 0],
                [2, -1],
                [1, 0]
            ],
            // Поворот на 360 градусов
            [
                [0, 0],
                [1, -1],
                [-2, 0],
                [-1, -1]
            ]
        ],

        // Фигура зеркальная "молния" Z
        [
            [1, 0],
            [1, 1],
            [2, 1],

            // Поворот на 90 градусов
            [
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],
            // Поворот на 180 градусов
            [
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ],
            // Поворот на 270 градусов
            [
                [2, -1],
                [0, 0],
                [1, -1],
                [-1, 0]
            ],
            // Поворот на 360 градусов
            [
                [-2, 0],
                [0, -1],
                [-1, 0],
                [1, -1]
            ]
        ],

        // Фигура "Lego"
        [
            [1, 0],
            [2, 0],
            [1, 1],

            // Поворот на 90 градусов
            [
                [1, -1],
                [0, 0],
                [0, 0],
                [0, 0]
            ],
            // Поворот на 180 градусов
            [
                [0, 0],
                [-1, 0],
                [-1, 0],
                [1, -1]
            ],
            // Поворот на 270 градусов
            [
                [1, -1],
                [1, -1],
                [1, -1],
                [0, 0]
            ],
            // Поворот на 360 градусов
            [
                [-2, 0],
                [0, -1],
                [0, -1],
                [-1, -1]
            ]
        ]
    ];

    // Массив с CSS-классами цветов для фигур
    let colorsArr = [
        'blue',
        'teal',
        'orange',
        'red',
        'purple',
        'green',
        'brown',
        'olive',
        'pink',
        'khaki',
        'yellow',
        'light-blue'
    ];

    // Текущая фигура, выбранная генератором псевдослучайных чисел; 
    // выбирается из массива фигур и далее с ней происходит основная работа
    let currentFigure = 0;
    // Текущий цвет фигуры
    let currentColor = 0;
    // Массив с координатами для дальнейшей закраски
    let figureBody = 0;
    // Начальный флаг поворота фигуры
    let rotate = 1; 

    /**
     * Генератор псевдослучайных чисел
     *
     * @param   {array}  arr      Массив на вход
     * @param   {boolean}  wrapper  если нужно получить значения, а не ключи
     *
     * @return  Номер ключа массива или его значение
     */
    const getRandom = (arr, wrapper = false) => {
        if (wrapper) {
            return arr[Math.round( Math.random() * (arr.length-1) )];
        }
        return Math.round( Math.random() * (arr.length-1) );
    };
    
    /**
     * Функция создания фигуры
     */
    function create() {
        
        // Сброс поворота фигуры по умолчанию
        rotate = 1;
        // Случайная фигура
        currentFigure = getRandom(mainArr);
        // Случайный цвет
        currentColor = getRandom(colorsArr, true);
    
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
            figureBody[i].classList.add(currentColor);
        }
    }
    create();

    // Счет очков в игре
    let score = 0;
    let input = document.getElementsByTagName('input')[0];
    input.value = `Ваши очки: ${score}`;

    /**
     * Функция движения фигуры
     */
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
                figureBody[i].classList.remove(currentColor);
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
                figureBody[i].classList.add(currentColor);
            }
        } else { // далее описываем логику, если движение вниз невозможно
            // удаление класса .figure и присвоение класса .set
            for (let i = 0; i < figureBody.length; i++) {
                figureBody[i].classList.remove('figure');
                figureBody[i].classList.remove(currentColor);
                figureBody[i].classList.add('set');
            }

            /**
             * Основная логика игры.
             */
            
            // Проверка наличия заполненных рядов на поле
            for (let i = 1; i < 15; i++) {
                let count = 0;
                for (let k = 1; k < 11; k++) {
                    if (document.querySelector(`[posX = "${k}"][posY = "${i}"]`).classList.contains('set')) {
                        count++;
                        if (count == 10) {
                            // Увеличение очков при успешном сложении ряда
                            score += 10;
                            input.value = `Ваши очки: ${score}`;
                            //
                            for (let m = 1; m < 11; m++) {
                                document.querySelector(`[posX = "${m}"][posY = "${i}"]`).classList.remove('set');
                            }
                            // Как только заполненный ряд исчез, смещаем все оставшиеся
                            // элементы вниз.
                            // Получение всех элементов с классом .set
                            let set = document.querySelectorAll('.set');
                            // Массив координат новых рядов поля
                            let newSet = [];
                            for (let s = 0; s < set.length; s++) {
                                let setCoordinates = [ set[s].getAttribute('posX'), set[s].getAttribute('posY') ];
                                // Проверка на наличие нижележащих рядов, которые смещать не надо
                                if (setCoordinates[1] > i) {
                                    set[s].classList.remove('set');
                                    newSet.push(document.querySelector(`[posX = "${setCoordinates[0]}"][posY = "${setCoordinates[1] - 1}"]`));
                                }
                            }
                            // Перерисовка оставшихся рядов
                            for (let a = 0; a < newSet.length; a++) {
                                newSet[a].classList.add('set');
                            }
                            i--; // Понижение рядов после исчезания сложенного
                        }
                    }
                }
            }

            // Окончание игры
            // Если падающие фигуры достигли самого верха (15-го ряда), игра заканчивается.
            for (let n = 1; n < 11; n++) {
                if ( document.querySelector(`[posX = "${n}"][posY = "${15}"]`).classList.contains('set') ) {
                    clearInterval(interval);
                    alert(`Игра окончена. Ваши очки: ${score}`);
                    break;
                }
            }
            
            // Всё, фигура лежит или на низу, или на другой фигуре, значит,
            // инициируем появление новой
            create();
        }
    }

    // Вызов функции движения фигур с заданным интервалом в миллисекундах
    let interval = setInterval(() => {
        move();
    }, speed);

    // Управление фигурами
    let flag = true;

    window.addEventListener('keydown', function(e) {
        // Получение координат фигуры
        let coordinates1 = [figureBody[0].getAttribute('posX'), figureBody[0].getAttribute('posY')];
        let coordinates2 = [figureBody[1].getAttribute('posX'), figureBody[1].getAttribute('posY')];
        let coordinates3 = [figureBody[2].getAttribute('posX'), figureBody[2].getAttribute('posY')];
        let coordinates4 = [figureBody[3].getAttribute('posX'), figureBody[3].getAttribute('posY')];

        /**
         * Определение координат новой фигуры в пространстве
         *
         * @param   {[number]}  a  принимает -1 или 1
         *
         * @return  {[void]} 
         */
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
                document.querySelector(`[posX = "${+coordinates4[0] + a}"][posY = "${coordinates4[1]}"]`)
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
            if (flag) {
                // удаляем у фигуры класс .figure у тех координат, где была нажата
                // клавиша управления
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.remove('figure');
                    figureBody[i].classList.remove(currentColor);
                }
                
                // Присваиваем фигуре новые координаты
                figureBody = figureNew;

                // И снова добавляем класс .figure по новым координатам
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.add('figure');
                    figureBody[i].classList.add(currentColor);
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
        } else if (e.keyCode == 38) { // Если стрелка вверх - поворачиваем фигуру
            // При каждом нажатии клавиши флаг признака падения сбрасывается
            flag = true;

            // Массив с гипотетической фигурой.
            // Здесь все тоже самое, что и в функции getNewState(a), только вместо
            // аргумента "a" подставляются варианты поворота фигуры из основоного
            // массива mainArr, начиная с 3-й ячейки подмассива координат
            let figureNew = [
                document.querySelector(`[posX = "${+coordinates1[0] + mainArr[currentFigure][rotate + 2][0][0]}"][posY = "${+coordinates1[1] + mainArr[currentFigure][rotate + 2][0][1]}"]`),
                document.querySelector(`[posX = "${+coordinates2[0] + mainArr[currentFigure][rotate + 2][1][0]}"][posY = "${+coordinates2[1] + mainArr[currentFigure][rotate + 2][1][1]}"]`),
                document.querySelector(`[posX = "${+coordinates3[0] + mainArr[currentFigure][rotate + 2][2][0]}"][posY = "${+coordinates3[1] + mainArr[currentFigure][rotate + 2][2][1]}"]`),
                document.querySelector(`[posX = "${+coordinates4[0] + mainArr[currentFigure][rotate + 2][3][0]}"][posY = "${+coordinates4[1] + mainArr[currentFigure][rotate + 2][3][1]}"]`)
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
                    figureBody[i].classList.remove(currentColor);
                }
                
                // Присваиваем фигуре новые координаты
                figureBody = figureNew;

                // И снова добавляем класс .figure по новым координатам
                for (let i = 0; i < figureBody.length; i++) {
                    figureBody[i].classList.add('figure');
                    figureBody[i].classList.add(currentColor);
                }
                
                // Если клавиша вверх была нажата 4 раза, т.е. фигура повернулась
                // на 360 градусов, значит она вернулась в исходное состояние и
                // флаг поворота сбрасываем на умолчание.
                if (rotate < 4) {
                    rotate++;
                } else {
                    rotate = 1;
                }
            }
        } else if (e.keyCode == 32) { // Пауза по нажатию на пробел
            alert('ПАУЗА. \n Нажмите "OK", чтобы продолжить.');
        } else if (e.keyCode == 27) { // Выход из игры по Esc
            if (confirm('Вы действительно хотите покинуть игру?')) {
                location.reload();
            }
        }
    });
}
