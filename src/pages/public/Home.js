import React, { useState } from 'react';
import '../../index.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../components/common/LoginModal';
import Register from '../../components/common/Register';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { Carousel, Card } from '../../components/ui/AppleCardsCarousel';


function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [redirectTo, setRedirectTo] = useState('/shop');

  const handleProtectedNavigation = (path) => {
    if (currentUser) {
      navigate(path);
    } else {
      setRedirectTo(path);
      setShowLogin(true);
    }
  };

  const products = [
    { id: 1, image: '/images/WATCH-ULTAR2.jpg', name: 'Apple Watch Ultra 2', link: '/shop' },
    { id: 2, image: '/images/JBL-SPEAKERS.jpg', name: 'JBL Speakers', link: '/shop' },
    { id: 3, image: '/images/Galaxy-watch-ultraA.jpg', name: 'Galaxy Watch Ultra', link: '/shop' },
    { id: 4, image: '/images/Galaxy-Buds3-pro.jpg', name: 'Galaxy Buds Pro', link: '/shop' },
  ];

  const appleProducts = [
    { id: 1, image: '/images/ipad 10th Gen.png', name: 'Apple iPad 10th Gen', price: 'LKR 181,600', link: '/shop' },
    { id: 2, image: '/images/ipad 9th Gen.png', name: 'Apple iPad 9th Gen', price: 'LKR 145,000', link: '/shop' },
    { id: 3, image: '/images/Apple MacBook Air.jpg', name: 'Apple MacBook Air', price: 'LKR 550,000', link: '/shop' },
    { id: 4, image: '/images/Apple-AirPods-Pro.png', name: 'Apple AirPods Pro', price: 'LKR 85,000', link: '/shop' },
  ];
// Carousel Items Data (AppleCardsCarousel)
const carouselItems = [
  {
    src: "/images/ADD1.png",
    title: "Enjoy a sleek design with A14 Bionic chip for work & play.",
    category: "Apple",
    content: (
      <p className="text-gray-600 dark:text-gray-300">
        Enjoy a sleek design with A14 Bionic chip for work & play.
      </p>
    ),
  },
  {
    src: "/images/ADD2.avif",
    title: "Launching the new Apple Vision Pro.",
    category: "Product",
    content: (
      <p className="text-gray-600 dark:text-gray-300">
        Launching the new Apple Vision Pro.
      </p>
    ),
  },
  {
    src: "/images/ADD3.png",
    title: "JBL Speakers",
    category: "Audio",
    content: (
      <p className="text-gray-600 dark:text-gray-300">
        Rich sound and portability for every occasion.
      </p>
    ),
  },
  {
    src: "/images/ADD4.avif",
    title: "Photography just got better with the new iPhone 15 Pro.",
    category: "Camera",
    content: (
      <p className="text-gray-600 dark:text-gray-300">
        Photography just got better with the new iPhone 15 Pro.
      </p>
    ),
  },
  {
    src: "/images/ADD5.png",
    title: "Galaxy Watch Ultra",
    category: "Wearable",
    content: (
      <p className="text-gray-600 dark:text-gray-300">
        Experience the future of wearable technology.
      </p>
    ),
  },
];


  return (
    
    <>
    
      <div className="relative w-full min-h-screen overflow-hidden text-white -mt-25 rounded-t-lg fade-in">


<section className="relative z-10 w-full h-[60vh] flex items-center -mt-32 fade-in rounded-2xl rounded-t-lg">
  {/* Background Video */}
  <video
    className="absolute inset-0 w-full h-full object-cover z-0 rounded-2xl rounded-t-lg "
    src="/videos/fonezone-promo.mp4"
    autoPlay
    loop
    muted
    playsInline
  />

  {/* Optional Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 z-0 rounded-2xl"></div>

  {/* Foreground Content (if you want text/buttons here) */}
  <div className="relative z-10 w-full px-2 sm:px-6">
    {/* You can put content here if needed */}
  </div>
</section>
        {/* Apple Cards Carousel (Place here) */}
<div className="relative z-10 max-w-7xl mx-auto py-12">
  <h3 className="text-3xl font-bold text-white mb-6">Explore More</h3>
  <Carousel
    items={carouselItems.map((card, idx) => (
      <Card key={idx} card={card} index={idx} layout />
    ))}
  />

</div>
                    {/* Payment Banner Section */}
        <div className="relative z-10 w-full mt-12">
          <img
            src="/images/Payment-Bank-cards-Desktop-.jpg"
            alt="Payment Options"
            className="w-full object-cover rounded-none shadow-lg"
          />
        </div>
        
        {/* Apple Products Promo Section */}
        <div className="relative z-10 w-full bg-gradient-to-r from-gray-950 via-slate-900 to-blue-950 py-16 px-6 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            
            {/* Banner Image */}
            <div className="flex-1">
              <img
                src="/images/apple-shopping-event-full-img-opt.png"
                alt="Apple Products"
                className="w-full rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Apple Products
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Buy genuine Apple devices and accessories with exclusive deals.
              </p>
              <button
                onClick={() => handleProtectedNavigation('/shop')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg text-white font-bold hover:from-cyan-300 hover:to-blue-400 transition"
              >
                View More
              </button>
            </div>
          </div>
                {/* Featured Products Carousel */}
        <div className="relative z-10 max-w-7xl mx-auto py-12 px-6 mt-16">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            modules={[Pagination, Autoplay]}
            className="w-full"
          >
            {products.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/10 hover:scale-105 transition-transform duration-300 p-4 text-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded-lg h-56 w-full object-cover mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white">{item.name}</h3>
                  <a
                    href={item.link}
                    className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg text-white font-bold hover:from-cyan-300 hover:to-blue-400 transition"
                  >
                    Shop Now
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        </div>

        {/* Modals */}
        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            redirectTo={redirectTo}
            switchToRegister={() => setShowRegister(true)}
          />
        )}
        {showRegister && (
          <Register
            onClose={() => setShowRegister(false)}
            switchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
    </>
  );
}

export default Home;
