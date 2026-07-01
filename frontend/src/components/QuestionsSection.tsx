import logImage from "../imgs/LogImg.png";

function QuestionsSection() {
  return (
    <section
      id="contact"
      className="questions-section"
      aria-labelledby="questions-title"
    >
      <div className="questions-section__inner">
        <h2 id="questions-title" className="questions-section__title">
          ANY QUESTIONS?
        </h2>

        <div className="questions-section__layout">
          <form
            className="questions-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <label>
              <span className="questions-form__label">Your name</span>
              <input type="text" name="name" placeholder="Your name" required />
            </label>

            <label>
              <span className="questions-form__label">Your telephone number</span>
              <input
                type="tel"
                name="telephone"
                placeholder="Your telephone number"
                required
              />
            </label>

            <label>
              <span className="questions-form__label">Your question</span>
              <textarea
                name="question"
                placeholder="Your question"
                rows={5}
                required
              />
            </label>

            <button type="submit">Send</button>
          </form>

          <p className="questions-section__copy">
            Write to us and we will be sure to answer all your questions and
            give you a comprehensive consultation.
          </p>
        </div>

        <img
          className="questions-section__log"
          src={logImage}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </div>
    </section>
  );
}

export default QuestionsSection;