import React, { useState, useEffect, useRef } from 'react';
import {
    FaPlane,
    FaBus,
    FaTrain,
    FaBed,
    FaChevronLeft,
    FaChevronRight,
    FaPercent,
    FaClock,
    FaFire,
    FaStar,
    FaGift,
    FaTag
} from 'react-icons/fa';

const OffersCarousel = ({ serviceType = 'auto', apiEndpoint = null }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const carouselRef = useRef(null);
    const autoSlideRef = useRef(null);

    // Auto-detect service type from URL if not provided
    const detectServiceType = () => {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/flight')) return 'flights';
        if (path.includes('/bus')) return 'bus';
        if (path.includes('/train')) return 'trains';
        if (path.includes('/hotel')) return 'hotels';
        return 'general';
    };

    const currentServiceType = serviceType === 'auto' ? detectServiceType() : serviceType;

    // Service configuration with orange theme
    const serviceConfig = {
        flights: {
            icon: FaPlane,
            color: 'orange',
            bgGradient: 'from-orange-400 to-orange-600',
            name: 'Flight'
        },
        bus: {
            icon: FaBus,
            color: 'orange',
            bgGradient: 'from-orange-400 to-orange-600',
            name: 'Bus'
        },
        trains: {
            icon: FaTrain,
            color: 'orange',
            bgGradient: 'from-orange-400 to-orange-600',
            name: 'Train'
        },
        hotels: {
            icon: FaBed,
            color: 'orange',
            bgGradient: 'from-orange-400 to-orange-600',
            name: 'Hotel'
        },
        general: {
            icon: FaGift,
            color: 'orange',
            bgGradient: 'from-orange-400 to-orange-600',
            name: 'Travel'
        }
    };

    // Mock data - replace with API call
    const mockOffers = {
        flights: [
            {
                id: 1,
                title: 'Fly to Paradise',
                subtitle: 'Mumbai to Goa',
                discount: '40% OFF',
                originalPrice: '₹8,999',
                discountedPrice: '₹5,399',
                validUntil: '2025-09-15',
                code: 'FLY40',
                type: 'flash',
                image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop',
                description: 'Book domestic flights and save big!'
            },
            {
                id: 2,
                title: 'International Escape',
                subtitle: 'Delhi to Dubai',
                discount: '₹5,000 OFF',
                originalPrice: '₹35,999',
                discountedPrice: '₹30,999',
                validUntil: '2025-08-30',
                code: 'INTL5000',
                type: 'premium',
                image: 'https://images.unsplash.com/photo-1597149238537-59ca9dba8d1f?w=400&h=250',
                description: 'Exclusive international flight deals'
            },
            {
                id: 3,
                title: 'Weekend Gateway',
                subtitle: 'Bangalore to Chennai',
                discount: '25% OFF',
                originalPrice: '₹4,499',
                discountedPrice: '₹3,374',
                validUntil: '2025-09-01',
                code: 'WEEKEND25',
                type: 'weekend',
                image: 'https://images.unsplash.com/photo-1556388158-158dc738e8db?w=400&h=250',
                description: 'Perfect for weekend trips'
            }
        ],
        bus: [
            {
                id: 1,
                title: 'Luxury Bus Travel',
                subtitle: 'Delhi to Jaipur',
                discount: '30% OFF',
                originalPrice: '₹1,200',
                discountedPrice: '₹840',
                validUntil: '2025-08-31',
                code: 'LUXURY30',
                type: 'luxury',
                image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250',
                description: 'Travel in comfort and style'
            },
            {
                id: 2,
                title: 'Overnight Journey',
                subtitle: 'Mumbai to Pune',
                discount: '20% OFF',
                originalPrice: '₹800',
                discountedPrice: '₹640',
                validUntil: '2025-09-10',
                code: 'NIGHT20',
                type: 'sleeper',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250',
                description: 'Comfortable overnight travel'
            },
            {
                id: 3,
                title: 'Express Route',
                subtitle: 'Bangalore to Hyderabad',
                discount: '15% OFF',
                originalPrice: '₹1,000',
                discountedPrice: '₹850',
                validUntil: '2025-08-28',
                code: 'EXPRESS15',
                type: 'express',
                image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250',
                description: 'Quick and reliable service'
            }
        ],
        trains: [
            {
                id: 1,
                title: 'First Class Comfort',
                subtitle: 'Delhi to Mumbai',
                discount: '35% OFF',
                originalPrice: '₹3,500',
                discountedPrice: '₹2,275',
                validUntil: '2025-09-05',
                code: 'FIRST35',
                type: 'first-class',
                image: 'https://images.unsplash.com/photo-1544620666-6df75e8c7e29?w=400&h=250',
                description: 'Premium train travel experience'
            },
            {
                id: 2,
                title: 'Express Journey',
                subtitle: 'Chennai to Bangalore',
                discount: '25% OFF',
                originalPrice: '₹1,800',
                discountedPrice: '₹1,350',
                validUntil: '2025-08-29',
                code: 'RAPID25',
                type: 'express',
                image: 'https://images.unsplash.com/photo-1553052286-c0fb4c1035b8?w=400&h=250',
                description: 'Fast and comfortable travel'
            },
            {
                id: 3,
                title: 'Sleeper Class Deal',
                subtitle: 'Kolkata to Delhi',
                discount: '20% OFF',
                originalPrice: '₹2,200',
                discountedPrice: '₹1,760',
                validUntil: '2025-09-15',
                code: 'SLEEPER20',
                type: 'sleeper',
                image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=250',
                description: 'Affordable overnight journeys'
            }
        ],
        hotels: [
            {
                id: 1,
                title: 'Luxury Resort Stay',
                subtitle: 'Goa Beach Resort',
                discount: '50% OFF',
                originalPrice: '₹12,000',
                discountedPrice: '₹6,000',
                validUntil: '2025-09-20',
                code: 'LUXURY50',
                type: 'luxury',
                image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=250',
                description: 'Beachfront luxury at its finest'
            },
            {
                id: 2,
                title: 'Business Hotel Deal',
                subtitle: 'Mumbai Central',
                discount: '40% OFF',
                originalPrice: '₹5,000',
                discountedPrice: '₹3,000',
                validUntil: '2025-08-30',
                code: 'BUSINESS40',
                type: 'business',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250',
                description: 'Perfect for business travelers'
            },
            {
                id: 3,
                title: 'Heritage Property',
                subtitle: 'Jaipur Palace',
                discount: '30% OFF',
                originalPrice: '₹8,000',
                discountedPrice: '₹5,600',
                validUntil: '2025-09-12',
                code: 'HERITAGE30',
                type: 'heritage',
                image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=250',
                description: 'Experience royal hospitality'
            }
        ],
        general: [
            {
                id: 1,
                title: 'Travel Combo Offer',
                subtitle: 'Flight + Hotel Package',
                discount: '45% OFF',
                originalPrice: '₹25,000',
                discountedPrice: '₹13,750',
                validUntil: '2025-09-30',
                code: 'COMBO45',
                type: 'combo',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250',
                description: 'Complete travel packages'
            },
            {
                id: 2,
                title: 'Early Bird Special',
                subtitle: 'Book 30 days in advance',
                discount: '35% OFF',
                originalPrice: '₹15,000',
                discountedPrice: '₹9,750',
                validUntil: '2025-10-15',
                code: 'EARLY35',
                type: 'early-bird',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250',
                description: 'Plan ahead and save more'
            },
            {
                id: 3,
                title: 'Last Minute Deals',
                subtitle: 'Book today, travel tomorrow',
                discount: '25% OFF',
                originalPrice: '₹10,000',
                discountedPrice: '₹7,500',
                validUntil: '2025-08-28',
                code: 'LASTMIN25',
                type: 'flash',
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250',
                description: 'Spontaneous travel deals'
            }
        ]
    };

    // Load offers (mock data or API)
    const loadOffers = async () => {
        setLoading(true);
        try {
            if (apiEndpoint) {
                // API call implementation
                const response = await fetch(`${apiEndpoint}?service=${currentServiceType}`);
                const data = await response.json();
                setOffers(data.offers || []);
            } else {
                // Use mock data
                setOffers(mockOffers[currentServiceType] || mockOffers.general);
            }
        } catch (error) {
            console.error('Error loading offers:', error);
            setOffers(mockOffers[currentServiceType] || mockOffers.general);
        } finally {
            setLoading(false);
        }
    };

    // Auto-slide functionality
    const startAutoSlide = () => {
        autoSlideRef.current = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % offers.length);
        }, 5000);
    };

    const stopAutoSlide = () => {
        if (autoSlideRef.current) {
            clearInterval(autoSlideRef.current);
        }
    };

    useEffect(() => {
        loadOffers();
    }, [currentServiceType, apiEndpoint]);

    useEffect(() => {
        if (offers.length > 1) {
            startAutoSlide();
            return () => stopAutoSlide();
        }
    }, [offers]);

    const nextSlide = () => {
        stopAutoSlide();
        setCurrentSlide(prev => (prev + 1) % offers.length);
        startAutoSlide();
    };

    const prevSlide = () => {
        stopAutoSlide();
        setCurrentSlide(prev => (prev - 1 + offers.length) % offers.length);
        startAutoSlide();
    };

    const goToSlide = (index) => {
        stopAutoSlide();
        setCurrentSlide(index);
        startAutoSlide();
    };

    const getOfferTypeIcon = (type) => {
        switch (type) {
            case 'flash': return <FaFire className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'premium': return <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'luxury': return <FaStar className="w-3 h-3 sm:w-4 sm:h-4" />;
            case 'weekend': return <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />;
            default: return <FaPercent className="w-3 h-3 sm:w-4 sm:h-4" />;
        }
    };

    const getOfferTypeColor = (type) => {
        switch (type) {
            case 'flash': return 'bg-red-500';
            case 'premium': return 'bg-purple-500';
            case 'luxury': return 'bg-yellow-500';
            case 'weekend': return 'bg-orange-500';
            default: return 'bg-green-500';
        }
    };

    const config = serviceConfig[currentServiceType];
    const ServiceIcon = config.icon;

    if (loading) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="text-gray-400">Loading amazing offers...</div>
            </div>
        );
    }

    if (!offers.length) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-gray-500">No offers available at the moment</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r ${config.bgGradient} flex items-center justify-center text-white`}>
                        <ServiceIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {config.name} Offers
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">Save more on your next journey</p>
                    </div>
                </div>

                {/* Navigation Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <button
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={offers.length <= 1}
                    >
                        <FaChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={offers.length <= 1}
                    >
                        <FaChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className="relative">
                <div
                    ref={carouselRef}
                    className="overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl"
                    onMouseEnter={stopAutoSlide}
                    onMouseLeave={startAutoSlide}
                >
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {offers.map((offer) => (
                            <div key={offer.id} className="w-full flex-shrink-0">
                                <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl">
                                    {/* Background Image */}
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-40 rounded-lg sm:rounded-xl lg:rounded-2xl"
                                        style={{ backgroundImage: `url(${offer.image})` }}
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent rounded-lg sm:rounded-xl lg:rounded-2xl" />

                                    {/* Content */}
                                    <div className="relative h-full flex items-center">
                                        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                                                {/* Left Content */}
                                                <div className="text-white">
                                                    {/* Offer Type Badge */}
                                                    <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4 ${getOfferTypeColor(offer.type)}`}>
                                                        {getOfferTypeIcon(offer.type)}
                                                        <span className="capitalize">{offer.type.replace('-', ' ')} Deal</span>
                                                    </div>

                                                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                                                        {offer.title}
                                                    </h3>
                                                    <p className="text-lg sm:text-xl md:text-2xl text-orange-200 mb-3 sm:mb-4 font-medium">
                                                        {offer.subtitle}
                                                    </p>
                                                    <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                                                        {offer.description}
                                                    </p>

                                                    {/* Price and Discount */}
                                                    <div className="flex flex-wrap items-baseline gap-3 sm:gap-4 mb-4 sm:mb-6">
                                                        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400">
                                                            {offer.discountedPrice}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm sm:text-base lg:text-lg text-gray-400 line-through">
                                                                {offer.originalPrice}
                                                            </span>
                                                            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">
                                                                {offer.discount}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Code and Validity */}
                                                    <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
                                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg w-fit">
                                                            <FaTag className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                                                            <span className="font-mono font-bold text-xs sm:text-sm">
                                                                Code: {offer.code}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-yellow-200">
                                                            <FaClock className="w-3 h-3 sm:w-4 sm:h-4" />
                                                            <span className="text-xs sm:text-sm">
                                                                Valid until {new Date(offer.validUntil).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* CTA Button */}
                                                    <button className={`bg-gradient-to-r ${config.bgGradient} hover:shadow-lg hover:shadow-orange-500/25 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all duration-300 transform hover:-translate-y-1`}>
                                                        Book Now & Save
                                                    </button>
                                                </div>

                                                {/* Right Content - Hidden on mobile and small tablets */}
                                                <div className="hidden xl:flex justify-end">
                                                    <div className="w-72 h-56 lg:w-80 lg:h-64 relative">
                                                        <img
                                                            src={offer.image}
                                                            alt={offer.title}
                                                            className="w-full h-full object-cover rounded-xl shadow-2xl"
                                                        />
                                                        <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-2 rounded-full font-bold text-sm sm:text-base animate-pulse">
                                                            {offer.discount}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Navigation Buttons */}
                <div className="md:hidden">
                    <button
                        onClick={prevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={offers.length <= 1}
                    >
                        <FaChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={offers.length <= 1}
                    >
                        <FaChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Dots Indicator */}
            {offers.length > 1 && (
                <div className="flex justify-center mt-4 sm:mt-6 gap-2">
                    {offers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? `bg-gradient-to-r ${config.bgGradient} w-6 sm:w-8`
                                    : 'bg-gray-300 hover:bg-gray-400 w-2 sm:w-3'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OffersCarousel;