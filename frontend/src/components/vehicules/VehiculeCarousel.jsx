import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function VehiculeCarousel({ images = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, images]);

  if (!images?.length) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {images.map((src, i) => (
            <div key={i} className="min-w-full">
              <img
                src={src}
                alt={`Image ${i + 1}`}
                className="w-full h-64 md:h-96 object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        {scrollSnaps.map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à l'image ${i + 1}`}
            onClick={() => emblaApi && emblaApi.scrollTo(i)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              selectedIndex === i
                ? "bg-gray-900 dark:bg-gray-100"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
