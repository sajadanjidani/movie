import { useRef, useState } from "react";

const items = Array.from({ length: 24 });

export default function CardSlider() {

  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startX = useRef(0);
  const startTranslateX = useRef(0);

  const visibleItems = 6;

  const totalItems = items.length;

  const maxIndex = totalItems - visibleItems;

  const itemWidth = 210;
 
  const gap = 50;

  const step = itemWidth + gap;


  const handlePointerDown = (event) => {

    setIsDragging(true);

    startX.current = event.clientX;
    startTranslateX.current = currentX;

    event.currentTarget.setPointerCapture(event.pointerId);
  };


  const handlePointerMove = (event) => {

    if (!isDragging) return;

    const distance = event.clientX - startX.current;

    let newX = startTranslateX.current + distance;

    const minX = -(maxIndex * step);

    if (newX > 0) {
      newX = 0;
    }

    if (newX < minX) {
      newX = minX;
    }

    setCurrentX(newX);
  };


  const handlePointerUp = () => {

    setIsDragging(false);

    const index = Math.round(Math.abs(currentX) / step);

    const safeIndex = Math.min(
      Math.max(index, 0),
      maxIndex
    );

    setCurrentX(-(safeIndex * step));
  };


  return (
    <div
      className="w-full overflow-hidden select-none touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >

      <div
        className={`flex gap-5 ${
          isDragging ? "" : "transition-transform duration-300 ease-out"
        }`}
        style={{
          transform: `translateX(${currentX}px)`
        }}
      >

        {items.map((_, index) => (
          <div
            key={index}
            className="min-w-20 h-20 bg-red-500"
          />
        ))}

      </div>

    </div>
  );
}