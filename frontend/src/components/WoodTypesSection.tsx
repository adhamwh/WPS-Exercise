import { useRef, useState } from "react";
import type { WoodType } from "../types/homepage";

type WoodItem = WoodType & {
  image: string;
};

type WoodTypesSectionProps = {
  woodItems: WoodItem[];
};

type WoodCardProps = {
  wood: WoodItem;
};

function WoodCard({ wood }: WoodCardProps) {
  return (
    <article className="wood-type-card">
      <img
        className="wood-type-card__image"
        src={wood.image}
        alt={`${wood.name} wood texture`}
      />

      <h3 className="wood-type-card__name">{wood.name}</h3>

      {(wood.short_description || wood.description) && (
        <p className="wood-type-card__description">
          {wood.short_description || wood.description}
        </p>
      )}

      <ul className="wood-type-card__features">
        {wood.features?.map((feature) => (
          <li key={feature.label}>
            <span
              className={`wood-type-card__feature-icon${
                feature.positive
                  ? " wood-type-card__feature-icon--positive"
                  : " wood-type-card__feature-icon--negative"
              }`}
              aria-hidden="true"
            >
              {feature.positive ? "\u2713" : "\u00d7"}
            </span>
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function WoodTypesSection({ woodItems }: WoodTypesSectionProps) {
  const [activeWood, setActiveWood] = useState(0);
  const woodTrackRef = useRef<HTMLDivElement>(null);
  const hasDesktopSlideshow = woodItems.length > 3;

  const showWood = (index: number) => {
    const count = woodItems.length;

    if (!count) {
      return;
    }

    const nextIndex = (index + count) % count;

    woodTrackRef.current?.scrollTo({
      left: woodTrackRef.current.clientWidth * nextIndex,
      behavior: "smooth",
    });
    setActiveWood(nextIndex);
  };

  return (
    <section
      id="wood-types"
      className="wood-types-section"
      aria-labelledby="wood-types-title"
    >
      <div className="wood-types-section__inner">
        <h2 id="wood-types-title" className="wood-types-section__title">
          <span>THE WOOD WE</span>
          <span>WORK WITH</span>
        </h2>

        <div className="wood-types__slider">
          <div className="wood-types__desktop-view">
            {hasDesktopSlideshow ? (
              <div className="wood-types__desktop-marquee">
                <div
                  className="wood-types__desktop-marquee-track"
                  style={{ animationDuration: `${woodItems.length * 4}s` }}
                >
                  {[false, true].map((duplicate) => (
                    <div
                      className={`wood-types__desktop-marquee-group${
                        duplicate
                          ? " wood-types__desktop-marquee-group--duplicate"
                          : ""
                      }`}
                      aria-hidden={duplicate || undefined}
                      key={duplicate ? "duplicate" : "primary"}
                    >
                      {woodItems.map((wood) => (
                        <WoodCard
                          wood={wood}
                          key={`${duplicate ? "duplicate" : "primary"}-${wood.id}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`wood-types__desktop-static wood-types__desktop-static--${woodItems.length}`}
              >
                {woodItems.map((wood) => (
                  <WoodCard wood={wood} key={wood.id} />
                ))}
              </div>
            )}
          </div>

          <div className="wood-types__mobile-slider">
            <button
              className="wood-types__arrow wood-types__arrow--previous"
              type="button"
              aria-label="Show previous wood type"
              onClick={() => showWood(activeWood - 1)}
            >
              <span aria-hidden="true">{"\u2039"}</span>
            </button>

            <div
              ref={woodTrackRef}
              className="wood-types__mobile-track"
              onScroll={(event) => {
                const track = event.currentTarget;

                if (track.clientWidth > 0) {
                  setActiveWood(
                    Math.min(
                      woodItems.length - 1,
                      Math.max(
                        0,
                        Math.round(track.scrollLeft / track.clientWidth),
                      ),
                    ),
                  );
                }
              }}
            >
              {woodItems.map((wood) => (
                <WoodCard wood={wood} key={wood.id} />
              ))}
            </div>

            <button
              className="wood-types__arrow wood-types__arrow--next"
              type="button"
              aria-label="Show next wood type"
              onClick={() => showWood(activeWood + 1)}
            >
              <span aria-hidden="true">{"\u203a"}</span>
            </button>

            <div className="wood-types__pagination" aria-label="Choose wood type">
              {woodItems.map((wood, index) => (
                <button
                  key={wood.id}
                  className={`wood-types__dot${
                    index === activeWood ? " wood-types__dot--active" : ""
                  }`}
                  type="button"
                  aria-label={`Show ${wood.name}`}
                  aria-current={index === activeWood ? "true" : undefined}
                  onClick={() => showWood(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WoodTypesSection;
