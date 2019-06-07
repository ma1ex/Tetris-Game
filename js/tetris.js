/**
 * Tetris engine
 */

'use strict';

// Создание основного элемента, содержащего сетку
 let tetris = document.createElement('div');
 tetris.classList.add('tetris');

 // Отрисовка 180-ти ячеек поля (18x10)
for (let i = 0; i <= 179; i++) {
    let excel = document.createElement('div');
    
    // Тестовая закраска стартовых ячеек для дебага
    if (i < 20) {
        excel.classList.add('excel-test');
    }

    excel.classList.add('excel');
    tetris.appendChild(excel);
}

// Вставка сформированной сетки в div-обертку
let main = document.getElementsByClassName('main')[0];
main.appendChild(tetris);

// Задание координат для каждой ячейки
let excel = document.getElementsByClassName('excel');
let i = 0;

// Назначение координат каждой ячейки.
/**
 * Как это работает.
 * Отрисовка (назначение координат) происходит с самой верхней слева ячейки
 * слева направо сверху вниз. Т.е. первый цикл отвечает за ряды, а вложенный
 * за столбцы.
 */
for (let y = 18; y > 0; y--) {
    for (let x = 1; x <= 10; x++) {
        excel[i].setAttribute('posX: ', x);
        excel[i].setAttribute('posY: ', y);
        i++;
    }
}