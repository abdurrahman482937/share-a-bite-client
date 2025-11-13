const About = () => {
    return (
        <div>
            <div className="my-10 flex flex-col md:flex-row gap-16 items-center justify-center h-[50vh] px-2 lg:px-10">
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
                    <p>PlateShare was born out of a passion to combat food waste and build a compassionate community. Our journey began with a simple idea: to create a platform where surplus food can find its way to those who need it most. We believe that no food should go to waste when someone out there is hungry.</p>
                    <p>Since our inception, we've worked tirelessly to connect generous donors with community members in need. Every food item posted represents care and compassion from our donors, and every request represents hope for someone in need. Together, we're reducing food waste while strengthening our community bonds.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>Our mission at PlateShare is to create a sustainable food-sharing ecosystem that reduces waste and fights hunger. We're dedicated to providing a seamless platform where donors can easily share surplus food, and recipients can find meals nearby with confidence and dignity.</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-1 text-sm mb-20 lg:px-10 px-2">
                <div className="border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Food Safety & Quality:</b>
                    <p className='to-gray-600'>We prioritize the safety and quality of every
                        food item shared. Donors provide detailed information
                        including expiry dates and storage conditions.</p>
                </div>
                <div className="border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Community Trust:</b>
                    <p className='to-gray-600'>Verified donor profiles and transparent
                        communication build trust. Every transaction is backed by
                        our community of caring individuals.</p>
                </div>
                <div className="border border-gray-400 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
                    <b>Environmental Impact:</b>
                    <p className='to-gray-600'>Every meal shared is a step toward sustainability.
                        By reducing food waste, we're protecting our planet
                        while feeding our community.</p>
                </div>
            </div>
        </div>
    )
}

export default About
