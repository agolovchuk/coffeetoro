import * as React from 'react';
import cx from 'classnames';
import styles from "./std.module.css";

interface Props {
  onRemove: () => void;
  children: React.ReactNode;
  className?: string;
}

function SlideToDelete({ onRemove, children, className }: Props) {

  const position = React.useRef({ start: 0, delta: 0 });

  const element = React.useRef<HTMLDivElement | null>(null);

  const button = React.useRef<HTMLButtonElement | null>(null);

  const updatePosition = React.useCallback((offset: number) => {
    const position = Math.floor(offset);
    if (element.current) {
      element.current.style.setProperty(
        'transform',
        `translate3d(-${position + 1}px, 0, 0)`,
      );
    }
    if (button.current) {
      button.current.style.setProperty(
        'width',
        `${position}px`,
      );
    }
  }, []);

  const handleStart = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    position.current.start = e.changedTouches[0].clientX;
  }, []);

  const handleMove = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const delta = position.current.start - e.changedTouches[0].clientX;
    if (element.current && position.current.delta > 0) {
      updatePosition(delta + position.current.delta)
    } else if (element.current && delta > 0) {
      updatePosition(delta);
    }
  }, [updatePosition]);

  const handleEnd = React.useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const delta = (position.current.start - e.changedTouches[0].clientX) + position.current.delta;
    if (element.current) {
      const half = element.current.offsetWidth / 2;
      if (delta > element.current.offsetWidth * 0.8) {
        updatePosition(element.current.offsetWidth);
        position.current.delta = 0;
        setTimeout(() => { onRemove(); }, 300);
      } else if (delta > element.current.offsetWidth / 2) {
        updatePosition(half);
        position.current.delta = half;
      } else {
        position.current.start = 0;
        position.current.delta = 0;
        updatePosition(0);
      }
    }
  }, [onRemove, updatePosition]);

  return (
    <div className={cx(styles.wrapper, className)}>
      <div
        className={styles.container}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        ref={element}
      >
        {
          children
        }
      </div>
      <button
        type="button"
        onClick={onRemove}
        className={styles.remove}
        ref={button}
      >Remove</button>
    </div>
  );
}

export default SlideToDelete;
