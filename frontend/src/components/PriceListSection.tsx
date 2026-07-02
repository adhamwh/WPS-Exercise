import { useRef, useState } from "react";
import arrow from "../imgs/Arrow.png";

type PriceItem = {
  src: string;
  alt: string;
};

type PriceSlide = {
  id: string;
  items: PriceItem[];
};

type PriceListSectionProps = {
  priceSlides: PriceSlide[];
};

function PriceListSection({ priceSlides }: PriceListSectionProps) {
  const [activePrice, setActivePrice] = useState(0);
  const priceTouchStartX = useRef<number | null>(null);

  const showPreviousPrice = () => {
    setActivePrice((activePrice - 1 + priceSlides.length) % priceSlides.length);
  };

  const showNextPrice = () => {
    setActivePrice((activePrice + 1) % priceSlides.length);
  };

  return (
    <section
      id="price-list"
      className="price-list-section"
      aria-labelledby="price-list-title"
    >
      <div className="price-list-section__inner">
        <h1 id="price-list-title" className="price-list-section__title">
          PRICE LIST
        </h1>

        <div className="price-slider">
          <button
            className="price-slider__arrow price-slider__arrow--previous"
            type="button"
            aria-label="Show previous price list"
            onClick={showPreviousPrice}
          >
            <img src={arrow} alt="" aria-hidden="true" />
          </button>

          <div
            className="price-slider__viewport"
            aria-live="polite"
            onTouchStart={(event) => {
              priceTouchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (priceTouchStartX.current === null) {
                return;
              }

              const endX = event.changedTouches[0]?.clientX;

              if (endX !== undefined) {
                const distance = endX - priceTouchStartX.current;

                if (Math.abs(distance) > 40) {
                  setActivePrice(
                    (activePrice +
                      (distance < 0 ? 1 : -1) +
                      priceSlides.length) %
                      priceSlides.length,
                  );
                }
              }

              priceTouchStartX.current = null;
            }}
          >
            {priceSlides.map((slide, index) => (
              <div
                key={slide.id}
                className={`price-slider__slide${
                  index === activePrice ? " price-slider__slide--active" : ""
                }`}
                aria-hidden={index !== activePrice}
              >
                {slide.items.map((item) => (
                  <img
                    className="price-slider__image"
                    src={item.src}
                    alt={index === activePrice ? item.alt : ""}
                    loading={index === 0 ? "eager" : "lazy"}
                    key={item.src}
                  />
                ))}
              </div>
            ))}
          </div>

          <button
            className="price-slider__arrow price-slider__arrow--next"
            type="button"
            aria-label="Show next price list"
            onClick={showNextPrice}
          >
            <img src={arrow} alt="" aria-hidden="true" />
          </button>

          <div className="price-slider__pagination" aria-label="Choose price list">
            {priceSlides.map((slide, index) => (
              <button
                key={slide.id}
                className={`price-slider__dot${
                  index === activePrice ? " price-slider__dot--active" : ""
                }`}
                type="button"
                aria-label={`Show price list ${index + 1}`}
                aria-current={index === activePrice ? "true" : undefined}
                onClick={() => setActivePrice(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PriceListSection;
