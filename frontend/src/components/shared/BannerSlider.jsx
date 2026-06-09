import Slider from "react-slick";
import { banners } from "../../utils/constants";

const BannerSlider = () => {
  const settings = {
    centerMode: true,
    centerPadding: "18%",
    slidesToShow: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 700,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    arrows: false,
    dots: true,
    pauseOnHover: true,
    swipeToSlide: true,
    dotsClass: "banner-slider-dots slick-dots",
    responsive: [
      {
        breakpoint: 1280,
        settings: { centerPadding: "14%" },
      },
      {
        breakpoint: 1024,
        settings: { centerPadding: "10%" },
      },
      {
        breakpoint: 768,
        settings: { centerPadding: "6%" },
      },
      {
        breakpoint: 640,
        settings: {
          centerMode: true,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <section className="banner-slider w-full bg-[#f5f5f5] pt-6 pb-10">
      <Slider {...settings}>
        {banners.map((banner, i) => (
          <div key={i} className="banner-slide outline-none">
            <img
              src={banner}
              alt={`Promotional banner ${i + 1}`}
              className="banner-slide-image w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[360px] object-cover"
              draggable={false}
            />
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default BannerSlider;
