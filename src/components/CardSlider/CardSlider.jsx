import { useRef, useState } from "react";
import Card from "../Card/Card";

const items = Array.from({ length: 24 });

export default function CardSlider() {
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // موقعیت شروع Pointer
  const startX = useRef(0);

  // موقعیت Slider قبل از شروع Drag
  const startTranslateX = useRef(0);

  // آیا Pointer پایین است؟
  const pointerDownRef = useRef(false);

  // آیا واقعاً Drag شروع شده؟
  const draggingRef = useRef(false);

  // تنظیمات Slider
  const visibleItems = 6;
  const totalItems = items.length;

  const maxIndex = totalItems - visibleItems;

  const itemWidth = 208;
  const gap = 50;

  const step = itemWidth + gap;

  // حداقل مقدار حرکت Slider
  const minX = -(maxIndex * step);


  // =========================
  // Pointer Down
  // =========================

  const handlePointerDown = (event) => {
    pointerDownRef.current = true;
    draggingRef.current = false;

    startX.current = event.clientX;
    startTranslateX.current = currentX;

    // event.currentTarget.setPointerCapture(event.pointerId);
  };


  // =========================
  // Pointer Move
  // =========================

  const handlePointerMove = (event) => {
    // اگر Pointer پایین نیست، کاری انجام نده
    if (!pointerDownRef.current) {
      return;
    }

    const distance = event.clientX - startX.current;


    // هنوز Drag شروع نشده
    if (!draggingRef.current) {

      // کمتر از 8px = Click
      if (Math.abs(distance) < 8) {
        return;
      }

      // بیشتر از 8px = Drag
      draggingRef.current = true;

      setIsDragging(true);
    }


    let newX =
      startTranslateX.current + distance;


    // محدود کردن Slider
    if (newX > 0) {
      newX = 0;
    }

    if (newX < minX) {
      newX = minX;
    }


    setCurrentX(newX);
  };


  // =========================
  // Pointer Up
  // =========================

  const handlePointerUp = (event) => {

    if (!pointerDownRef.current) {
      return;
    }


    // Pointer دیگر پایین نیست
    pointerDownRef.current = false;


    // اگر Drag شروع نشده باشد
    // یعنی کاربر Click کرده
    if (!draggingRef.current) {
      setIsDragging(false);

      return;
    }


    // مقدار نهایی حرکت
    const distance =
      event.clientX - startX.current;


    let newX =
      startTranslateX.current + distance;


    // محدود کردن مقدار
    if (newX > 0) {
      newX = 0;
    }

    if (newX < minX) {
      newX = minX;
    }


    // پیدا کردن نزدیک‌ترین Card
    const index =
      Math.round(
        Math.abs(newX) / step
      );


    // جلوگیری از خارج شدن index
    const safeIndex =
      Math.min(
        Math.max(index, 0),
        maxIndex
      );


    // قرار گرفتن روی Card
    setCurrentX(
      -(safeIndex * step)
    );


    // پایان Drag
    draggingRef.current = false;

    setIsDragging(false);
  };


  // =========================
  // Pointer Cancel
  // =========================

  const handlePointerCancel = () => {
    pointerDownRef.current = false;
    draggingRef.current = false;

    setIsDragging(false);
  };


  return (
    <div
      className="w-full overflow-hidden select-none touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >

      <div
        className={`
          flex
          gap-11.5
          mt-5
          ${
            isDragging
              ? ""
              : "transition-transform duration-300 ease-out"
          }
        `}
        style={{
          transform: `translateX(${currentX}px)`,
        }}
      >

        {items.map((_, index) => (
          <Card key={index} />
        ))}

      </div>

    </div>
  );
}