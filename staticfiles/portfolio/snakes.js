document.addEventListener('DOMContentLoaded', function() {
    const snakeContainer = document.querySelector('.snake-container');
    const pageWrapper = document.querySelector('.page-wrapper'); // Центральный блок
    const footer = document.querySelector('footer'); // Подвал
    const numSnakes = 20; // Количество змей на экране
    const rightBoundary = window.innerWidth - 20; // Ограничиваем змей на 20px перед краем экрана

    // Получаем размеры и положение центрального блока и подвала
    function getBounds(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            right: rect.right,
            bottom: rect.bottom
        };
    }

    // Функция создания змеи
    function createSnake() {
        const snakeLength = Math.floor(Math.random() * 8) + 5; // Длина змеи от 5 до 12 сегментов
        const snake = [];

        // Генерируем случайное начальное положение для всей змеи (голова и все сегменты)
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;

        for (let i = 0; i < snakeLength; i++) {
            const segment = document.createElement('div');
            segment.classList.add('snake-segment');

            // Уменьшаем размер сегментов: от большего к меньшему
            const size = 15 - i * 2; // Размер от 15 пикселей до минимального
            segment.style.width = `${size}px`;
            segment.style.height = `${size}px`;

            // Устанавливаем начальные координаты для всех сегментов змеи одинаковыми (в точке головы)
            segment.style.top = `${startY}px`;
            segment.style.left = `${startX}px`;

            snakeContainer.appendChild(segment);
            snake.push(segment);
        }

        moveSnake(snake);
    }

    // Логика движения змеи
    function moveSnake(snake) {
        let mouseX = Math.random() * window.innerWidth;
        let mouseY = Math.random() * window.innerHeight;
        let randomDirection = null; // Хранит случайное направление
        let orbitAngle = 0; // Угол для движения по орбите
        let orbitRadius = null; // Радиус орбиты вокруг курсора

        const pageBounds = getBounds(pageWrapper); // Границы центрального блока
        const footerBounds = getBounds(footer); // Границы подвала

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        setInterval(() => {
            snake.forEach((segment, index) => {
                let targetX, targetY;

                // Проверяем, находится ли курсор в пределах центрального блока или подвала
                const isCursorInPageWrapper = mouseX > pageBounds.left && mouseX < pageBounds.right &&
                                              mouseY > pageBounds.top && mouseY < pageBounds.bottom;
                const isCursorInFooter = mouseX > footerBounds.left && mouseX < footerBounds.right &&
                                         mouseY > footerBounds.top && mouseY < footerBounds.bottom;

                if (index === 0) { // Только голова выбирает направление
                    // Проверяем, если змея близко к курсору
                    const segmentX = parseFloat(segment.style.left);
                    const segmentY = parseFloat(segment.style.top);
                    const distanceToCursor = Math.sqrt((mouseX - segmentX) ** 2 + (mouseY - segmentY) ** 2);

                    if (distanceToCursor < 100) { // Если змея близка к курсору (меньше 100px)
                        if (!orbitRadius) {
                            orbitRadius = Math.random() * 50 + 50; // Случайный радиус орбиты от 50 до 100px
                        }
                        // Движемся по кругу вокруг курсора
                        orbitAngle += 0.05; // Увеличиваем угол для кругового движения
                        targetX = mouseX + Math.cos(orbitAngle) * orbitRadius;
                        targetY = mouseY + Math.sin(orbitAngle) * orbitRadius;
                    } else {
                        // Если змея не близко к курсору
                        orbitRadius = null; // Сбрасываем орбиту
                        if (isCursorInPageWrapper || isCursorInFooter) {
                            // Если курсор в центральном блоке или подвале, змея движется в случайную сторону
                            if (!randomDirection) {
                                // Генерируем случайное направление только один раз, пока курсор в блоке
                                const randomAngle = Math.random() * 2 * Math.PI; // Случайный угол
                                randomDirection = {
                                    x: Math.cos(randomAngle),
                                    y: Math.sin(randomAngle)
                                };
                            }

                            // Движемся по прямой в случайном направлении
                            targetX = parseFloat(snake[0].style.left) + randomDirection.x * 10;
                            targetY = parseFloat(snake[0].style.top) + randomDirection.y * 10;

                            // Проверяем, достигла ли змея края экрана или правого ограниченного края
                            if (targetX < 0 || targetX > rightBoundary || targetY < 0 || targetY > window.innerHeight ||
                                (targetX > pageBounds.left && targetX < pageBounds.right && targetY > pageBounds.top && targetY < pageBounds.bottom)) {
                                // Если достигли края экрана или коснулись центрального блока, генерируем новое случайное направление
                                const randomAngle = Math.random() * 2 * Math.PI;
                                randomDirection = {
                                    x: Math.cos(randomAngle),
                                    y: Math.sin(randomAngle)
                                };
                            }

                        } else {
                            // Если курсор вне зоны, змея движется к курсору
                            randomDirection = null; // Сбрасываем случайное направление
                            targetX = mouseX;
                            targetY = mouseY;
                        }
                    }

                    const deltaX = targetX - segmentX;
                    const deltaY = targetY - segmentY;

                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const speed = 4; // Скорость змеи

                    if (distance > 5) {
                        const moveX = (deltaX / distance) * speed;
                        const moveY = (deltaY / distance) * speed;

                        segment.style.left = `${segmentX + moveX}px`;
                        segment.style.top = `${segmentY + moveY}px`;
                    }
                } else {
                    // Остальные сегменты следуют за предыдущими
                    let targetX = parseFloat(snake[index - 1].style.left);
                    let targetY = parseFloat(snake[index - 1].style.top);

                    const segmentX = parseFloat(segment.style.left);
                    const segmentY = parseFloat(segment.style.top);

                    const deltaX = targetX - segmentX;
                    const deltaY = targetY - segmentY;

                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    if (distance > 20) { // Дистанция между сегментами
                        const moveX = (deltaX / distance) * 4;
                        const moveY = (deltaY / distance) * 4;

                        segment.style.left = `${segmentX + moveX}px`;
                        segment.style.top = `${segmentY + moveY}px`;
                    }
                }
            });
        }, 50); // Обновляем движение каждые 50 миллисекунд
    }

    // Создаем несколько змей
    for (let i = 0; i < numSnakes; i++) {
        createSnake();
    }
});
