import './Candle.css';

export const Candle = () => {
  const object = {
    image_url: "/public/candle-placeholder.svg",
    name: "Vanilla mist",
    color: "Beige",
    smell: "Vanilla",
    volume: "130ml",
    price: "20,00zł",
    popularity: 5,
    description: "Feel the softness of vanilla",
    discounted: true,
    discounted_value: "-20%",
    discounted_price: "16,00zł",
  }

  const stars = Array.from({ length: object.popularity }, (_, index) => (
    <span key={index} className="star-icon">★</span>
  ));

  return (
    <div className="candle">
      <img className="candle-image" src={object.image_url} />
      <span className="candle-name">{object.name}</span>
      <div className="candle-popularity">
        {stars}
      </div>
      <span className="candle-price">{object.discounted ?
        <div className="candle-discount-container">
          <span className="discounted-price">{object.discounted_price}</span>
          <span className="original-price">{object.price}</span>
        </div>
        :
        <>{object.price}</>}</span>
      <button className="candle-button">Add to cart</button>
      {object.discounted ?
        <div className="candle-discount">{object.discounted_value}</div>
        :
        <></>
      }
    </div>
  )
}