import { useRef, useState } from "react";
import arrow from "../imgs/Arrow.png";

type WorkSlide = {
  src: string;
  alt: string;
};

type OurWorkSectionProps = {
  title: string;
  description: string;
  workSlides: WorkSlide[];
};

function OurWorkSection({
  title,
  description,
  workSlides,
}: OurWorkSectionProps) {
  const [activeWork, setActiveWork] = useState(0);
  const workTouchStartX = useRef<number | null>(null);

  const showWork = (index: number) => {
    setActiveWork((index + workSlides.length) % workSlides.length);
  };

  return (
    <section
      id="gallery"
      className="our-work-section"
      aria-labelledby="our-work-title"
    >
      <div className="our-work-section__inner">
        <h2
          id="our-work-title"
          className={`our-work-section__title${
            description
              ? ""
              : " our-work-section__title--without-description"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p className="our-work-section__description">{description}</p>
        )}

        <div className="our-work-slider">
          <button
            className="our-work-slider__arrow our-work-slider__arrow--previous"
            type="button"
            aria-label="Show previous project"
            onClick={() => showWork(activeWork - 1)}
          >
            <img src={arrow} alt="" aria-hidden="true" />
          </button>

          <div
            className="our-work-slider__viewport"
            aria-live="polite"
            onTouchStart={(event) => {
              workTouchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (workTouchStartX.current === null) {
                return;
              }

              const endX = event.changedTouches[0]?.clientX;

              if (endX !== undefined) {
                const distance = endX - workTouchStartX.current;

                if (Math.abs(distance) > 40) {
                  showWork(activeWork + (distance < 0 ? 1 : -1));
                }
              }

              workTouchStartX.current = null;
            }}
          >
            {workSlides.map((slide, index) => (
              <img
                key={slide.src}
                className={`our-work-slider__image${
                  index === activeWork ? " our-work-slider__image--active" : ""
                }`}
                src={slide.src}
                alt={index === activeWork ? slide.alt : ""}
                aria-hidden={index !== activeWork}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>

          <button
            className="our-work-slider__arrow our-work-slider__arrow--next"
            type="button"
            aria-label="Show next project"
            onClick={() => showWork(activeWork + 1)}
          >
            <img src={arrow} alt="" aria-hidden="true" />
          </button>

          <div className="our-work-slider__pagination" aria-label="Choose project">
            {workSlides.map((slide, index) => (
              <button
                key={slide.src}
                className={`our-work-slider__dot${
                  index === activeWork ? " our-work-slider__dot--active" : ""
                }`}
                type="button"
                aria-label={`Show project ${index + 1}`}
                aria-current={index === activeWork ? "true" : undefined}
                onClick={() => showWork(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurWorkSection;
