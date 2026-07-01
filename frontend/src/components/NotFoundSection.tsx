import notFoundImage from "../imgs/NotFound.png";
import woodBackground from "../imgs-optimized/Woodstock.webp";

function NotFoundSection() {
  return (
    <section className="not-found-section" aria-labelledby="not-found-title">
      <div
        className="not-found-section__wood"
        style={{ backgroundImage: `url(${woodBackground})` }}
        aria-hidden="true"
      />

      <div className="not-found-section__content">
        <img
          className="not-found-section__number"
          src={notFoundImage}
          alt="404"
        />

        <h1 id="not-found-title">Woops</h1>
        <p>Oh, you must be lost, there is no such page.</p>
        <a href="/">Go to the home page</a>
      </div>
    </section>
  );
}

export default NotFoundSection;