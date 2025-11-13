import { Navigation, Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import { dummyTestimonial } from '../../assets/dummyTestimonial'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Testimonial = () => {
    return (
        <section className='pb-14 pt-40 px-4 md:px-0 text-center max-w-7xl mx-auto'>
            <h2 className="text-3xl font-semibold text-gray-900">Community Stories</h2>
            <p className="md:text-base text-gray-600 mt-3 max-w-2xl mx-auto">
                Real people sharing how PlateShare helped them reduce waste, feed neighbours, and build small local connections.
            </p>
            <div className='mt-10 px-0 relative'>
                <button type="button" className="testimonial-prev absolute left-0 top-1/2 -translate-y-1/2 -ml-14 p-3 bg-green-600 text-white rounded-sm shadow-md z-20 cursor-pointer" aria-label="Previous testimonial">
                    <FaChevronLeft />
                </button>
                <button type="button" className="testimonial-next absolute right-0 top-1/2 -translate-y-1/2 -mr-14 p-3 bg-green-600 text-white rounded-sm shadow-md z-20 cursor-pointer" aria-label="Next testimonial">
                    <FaChevronRight />
                </button>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={10}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    navigation={{ prevEl: '.testimonial-prev', nextEl: '.testimonial-next' }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                    aria-live='polite'
                >
                    {dummyTestimonial.map((t, idx) => (
                        <SwiperSlide key={idx}>
                            <article className='text-sm text-left border border-gray-200 pb-6 rounded-lg bg-white shadow-sm overflow-hidden m-3'>
                                <div className='flex items-center gap-4 px-5 py-4 bg-gray-50'>
                                    <img className='h-12 w-12 rounded-full object-cover' src={t.image} alt={t.name} />
                                    <div>
                                        <h3 className='text-lg font-medium text-gray-800'>{t.name}</h3>
                                        <p className='text-gray-600 text-sm'>{t.role}</p>
                                    </div>
                                </div>
                                <div className='p-5 pb-7'>
                                    <p className='text-gray-500 mt-5'>{t.feedback}</p>
                                </div>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default Testimonial
