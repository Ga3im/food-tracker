import { useEffect, useRef, useState } from "react";

export const useContextMenu = <T>() => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: T;
  } | null>(null);

  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMenuOpening = useRef<boolean>(false);

  useEffect(() => {
    const handleClose = () => {
      // Если меню прямо сейчас НЕ открывается, закрываем его
      if (!isMenuOpening.current) {
        setContextMenu(null);
      }
    };

    // Слушаем клики и тапы на уровне всего окна
    window.addEventListener("mousedown", handleClose);
    window.addEventListener("touchstart", handleClose);

    return () => {
      window.removeEventListener("mousedown", handleClose);
      window.removeEventListener("touchstart", handleClose);
    };
  }, []);

  const openMenuAtCoordinates = (clientX: number, clientY: number, item: T) => {
    const menuWidth = 170;
    const menuHeight = 140;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const x = clientX + menuWidth > screenWidth ? screenWidth - menuWidth - 15 : clientX;
    const y = clientY + menuHeight > screenHeight ? clientY - menuHeight - 5 : clientY;

    setContextMenu({ x, y, item });

    // 🌟 ХАК: Сбрасываем флаг в самом конце очереди событий (в следующем тике)
    // Это предотвратит мгновенное срабатывание handleClose от текущего клика
    setTimeout(() => {
      isMenuOpening.current = false;
    }, 0);
  };

  // Обработка правого клика мыши (ПК)
  const handleContextMenu = (e: React.MouseEvent, item: T) => {
    e.preventDefault();
    e.stopPropagation();

    isMenuOpening.current = true;
    openMenuAtCoordinates(e.clientX, e.clientY, item);
  };

  // Начало касания (Мобильные)
  const handleTouchStart = (e: React.TouchEvent, item: T) => {
    if (e.touches.length > 1) return; // Игнорируем мультитач

    const touch = e.touches[0];
    const travelX = touch.clientX;
    const travelY = touch.clientY;

    if (touchTimer.current) clearTimeout(touchTimer.current);

    touchTimer.current = setTimeout(() => {
      isMenuOpening.current = true;
      openMenuAtCoordinates(travelX, travelY, item);
      touchTimer.current = null;
    }, 600); // 600мс для удержания
  };

  // Очистка таймера, если пользователь отпустил палец или скроллит
  const clearTouchTimer = () => {
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
      touchTimer.current = null;
    }
  };

  return { contextMenu, setContextMenu, handleContextMenu, handleTouchStart, clearTouchTimer };
};

// Вызываем эти события у компоненты которая открывает контестное меню
//  onContextMenu={(e) => handleContextMenu(e, item)}
// onTouchStart={(e) => handleTouchStart(e, item)}
// onTouchMove={clearTouchTimer}
// onTouchEnd={clearTouchTimer}
// onTouchCancel={clearTouchTimer}

// Пример использования
// {contextMenu && (
//       <div
//         className="z-[9999] pointer-events-auto min-w-[160px] bg-white border border-slate-200 rounded-xl shadow-2xl p-1.5 flex flex-col font-sans select-none"
//         onMouseDown={(e) => e.stopPropagation()}
//         onTouchStart={(e) => e.stopPropagation()}
//         onContextMenu={(e) => e.preventDefault()}
//       >
// тут тело контестного меню
//       </div>
//     )}
