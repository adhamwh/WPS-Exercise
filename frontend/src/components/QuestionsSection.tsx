import logImage from "../imgs/LogImg.png";

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;
const PHONE_MIN_LENGTH = 7;
const PHONE_MAX_LENGTH = 15;
const QUESTION_MIN_LENGTH = 10;
const QUESTION_MAX_LENGTH = 1000;

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
              <input
                type="text"
                name="name"
                placeholder="Your name"
                minLength={NAME_MIN_LENGTH}
                maxLength={NAME_MAX_LENGTH}
                required
              />
            </label>

            <label>
              <span className="questions-form__label">Your telephone number</span>
              <input
                type="tel"
                name="telephone"
                placeholder="Your telephone number"
                inputMode="numeric"
                pattern={`[0-9]{${PHONE_MIN_LENGTH},${PHONE_MAX_LENGTH}}`}
                minLength={PHONE_MIN_LENGTH}
                maxLength={PHONE_MAX_LENGTH}
                title={`Enter ${PHONE_MIN_LENGTH} to ${PHONE_MAX_LENGTH} digits`}
                onInput={(event) => {
                  event.currentTarget.value = event.currentTarget.value
                    .replace(/\D/g, "")
                    .slice(0, PHONE_MAX_LENGTH);
                }}
                required
              />
            </label>

            <label>
              <span className="questions-form__label">Your question</span>
              <textarea
                name="question"
                placeholder="Your question"
                rows={5}
                minLength={QUESTION_MIN_LENGTH}
                maxLength={QUESTION_MAX_LENGTH}
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
