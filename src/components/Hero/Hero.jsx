import SearchBar from "../SearchBar/SearchBar";
import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Link } from "react-router-dom";

export default function Hero() {
    const slides = [
        {
            id: 1,
            title: "Share a bite, save a life.",
            highlight: "Donate surplus food today.",
            desc:
                "Post the extra food you have and help neighbors in need. Fast pickup, safe handover — community powered.",
            cta: { text: "View All Foods", to: "/foods" },
        },
        {
            id: 2,
            title: "Find free meals near you",
            highlight: "Browse available donations.",
            desc:
                "Search nearby donations by quantity, location or expiry date. Grab what you need — no waste, more care.",
            cta: { text: "Search Foods", to: "/foods" },
        },
        {
            id: 3,
            title: "Donated with love",
            highlight: "Trusted local donors.",
            desc:
                "Every post shows donor info and pickup details. Request foods safely and coordinate pickup with the donor.",
            cta: { text: "Add Food (Private)", to: "/add-food" },
        },
    ];

    return (
        <div className="relative flex flex-col items-center justify-center w-full md:pt-32 pt-16 px-6 md:px-0 space-y-7 text-center">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={10}
                loop={true}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                navigation={true}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                }}
                className="w-full"
            >
                {slides.map((item) => (
                    <SwiperSlide key={item.id} className="flex flex-col items-center justify-center py-10">
                        <div className="flex flex-col items-center justify-center w-full space-y-5">
                            <h1 className="md:text-[44px] text-[28px] md:leading-[54px] leading-8 font-extrabold text-gray-900 max-w-4xl mx-auto">
                                {item.title}{" "}
                                <span className="text-green-600 block md:inline">{item.highlight}</span>
                            </h1>

                            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
                                {item.desc}
                            </p>

                            <div className="w-full flex justify-center">
                                <SearchBar />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
