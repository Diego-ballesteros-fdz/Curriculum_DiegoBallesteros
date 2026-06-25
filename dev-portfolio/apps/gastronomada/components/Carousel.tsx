"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt: string;
}

interface Props {
  images: CarouselImage[];
  /** Tiempo (ms) entre transiciones automáticas. */
  intervalMs?: number;
  /** Duración (ms) de la transición de deslizamiento. */
  durationMs?: number;
  className?: string;
}

/**
 * Carrusel de imágenes con bucle infinito fluido.
 *
 * Para evitar el "salto" (empezar o acabar en vacío) se clona la primera imagen
 * al final de la pista: al llegar a ese clon —visualmente idéntico a la primera—
 * se reposiciona al índice 0 sin transición, de modo que el bucle es continuo y
 * nunca se ve un hueco.
 */
export default function Carousel({
  images,
  intervalMs = 3000,
  durationMs = 700,
  className,
}: Props) {
  const total = images.length;
  // Con una sola imagen no hay nada que animar; el clon solo aplica si hay >1.
  const slides = total > 1 ? [...images, images[0]] : images;

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);

  // Avance automático.
  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, total, intervalMs]);

  const goTo = (i: number) => {
    setAnimate(true);
    setIndex(i);
  };

  const next = () => goTo(index + 1);

  const prev = () => {
    if (index === 0) {
      // Saltamos sin animación al clon final y retrocedemos desde ahí.
      setAnimate(false);
      setIndex(total);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimate(true);
          setIndex(total - 1);
        }),
      );
    } else {
      goTo(index - 1);
    }
  };

  // Al terminar la transición sobre el clon, reposicionamos al original sin animar.
  const handleTransitionEnd = () => {
    if (index === total) {
      setAnimate(false);
      setIndex(0);
    }
  };

  if (total === 0) return null;

  const activeDot = index % total;

  return (
    <div
      className={cn(
        "relative mx-auto h-80 w-full max-w-3xl overflow-hidden rounded-2xl shadow-lg sm:h-96",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
    >
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: animate ? `transform ${durationMs}ms ease-in-out` : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((img, i) => (
          <div key={i} className="relative h-full w-full shrink-0">
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Imagen anterior"
            className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-very-dark/40 text-cream transition-colors hover:bg-very-dark/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Imagen siguiente"
            className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-very-dark/40 text-cream transition-colors hover:bg-very-dark/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronRight className="size-6" />
          </button>

          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
                aria-current={i === activeDot}
                className={cn(
                  "size-2.5 rounded-full transition-all",
                  i === activeDot
                    ? "w-6 bg-gold"
                    : "bg-cream/60 hover:bg-cream",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
