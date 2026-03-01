import { useRef } from "react";
import CardCrypto from "../CardCrypto/CardCrypto";
import "./css/OptionCrypto.css";

function OptionCrypto() {
  const carrosselRef = useRef(null);

    const scrollLeft = () => {
        if (carrosselRef.current) {
            const distance = window.innerWidth <= 500 ? 200 : 300;
            carrosselRef.current.scrollBy({
            left: -distance,
            behavior: "smooth",
            });
        }
    };

    const scrollRight = () => {
        if (carrosselRef.current) {
            const distance = window.innerWidth <= 500 ? 230 : 300; 
            carrosselRef.current.scrollBy({
            left: distance,
            behavior: "smooth",
            });
        }
    };

  return (
    <>
      
      <section id="containerCarrosslCards">
        <button className="btnSlides" onClick={scrollLeft}>
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
        <div id="carrosselCards" ref={carrosselRef}>
          <CardCrypto />
        </div>
        <button className="btnSlides" onClick={scrollRight}>
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      </section>
    </>
  );
}

export default OptionCrypto;
