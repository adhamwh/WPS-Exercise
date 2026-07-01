import backgroundTexture from "../imgs/BackgroundImg.png";

function BackgroundContours() {
  return (
    <div
      className="home-page__contours"
      style={{ backgroundImage: `url(${backgroundTexture})` }}
      aria-hidden="true"
    />
  );
}

export default BackgroundContours;