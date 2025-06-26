import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/navbars/Navbar';

const steps = [
  {
    title: "Sign Up or Login",
    description: "Create an account or log in as a user or admin to access recharge features and manage EV bunks.",
    icon: "🔐",
  },
  {
    title: "Complete Profile Setup",
    description: "Update your vehicle details, preferred locations, and contact info to personalize your experience.",
    icon: "📝",
  },
  {
    title: "Locate Nearby Recharge Bunks",
    description: "Use the map or search bar to find EV recharge stations near your location with real-time availability.",
    icon: "📍",
  },
  {
    title: "Check Availability",
    description: "See live slot status, capacity, and details of each recharge station including location on map.",
    icon: "🕒",
  },
  {
    title: "Book a Slot",
    description: "Reserve a slot in advance to secure your recharge without waiting in queues.",
    icon: "📅",
  },
  {
    title: "Track Bookings & History",
    description: "Easily view, manage, cancel, or reschedule your recharge bookings from your dashboard.",
    icon: "📊",
  },
  {
    title: "Check-in & Recharge",
    description: "Visit the bunk at your booked time, check in with your booking ID, and recharge your EV.",
    icon: "⚡",
  },
  {
    title: "Get Help if Needed",
    description: "Use the in-app support or contact section if you need assistance with bookings or usage.",
    icon: "📞",
  },
];

const faqData = [
  {
    question: "What is EV Recharge Hub?",
    answer:
      "EV Recharge Hub is an electric vehicle recharge management platform that allows users to locate, book, and recharge at EV stations easily and efficiently.",
  },
  {
    question: "How do I find the nearest recharge bunk?",
    answer:
      "After logging in, you can use the map and search functionality to view nearby EV recharge stations based on your location.",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, you can cancel or reschedule your booking from your dashboard under the 'My Bookings' section before the scheduled slot time.",
  },
  {
    question: "Is the booking service free?",
    answer:
      "Yes, booking a slot on EV Recharge Hub is free. However, actual recharge cost may vary based on the station and slot duration.",
  },
  {
    question: "How can I become an admin or register my recharge station?",
    answer:
      "If you own an EV recharge station, you can register as an admin through the 'Admin Login' section and manage your bunk and available slots.",
  },
  {
    question: "Do I need an account to book a recharge slot?",
    answer:
      "Yes, users need to register and log in to access the booking features and manage their bookings securely.",
  },
  {
    question: "Can I see real-time slot availability?",
    answer:
    "Yes, the system shows real-time availability of slots for each recharge station so you can plan accordingly.",
  },
  {
    question: "What happens if I miss my booked slot?",
    answer:
    "If a user does not check-in during their scheduled time, the slot may be marked as missed and can be released for others.",
  },
  {
    question: "How do I contact support if I face issues?",
    answer:
    "You can reach our support team via the 'Contact Us' section available in the website footer or from your dashboard.",
  },
  {
    question: "Is EV Recharge Hub available across India?",
    answer:
    "Currently, EV Recharge Hub is expanding across major cities in India. You can check the availability of recharge bunks in your area via the platform.",
  },
  {
    question: "How long does a typical EV recharge take?",
    answer:
    "Recharge times vary based on your vehicle and the charging station. Typically, a full charge can take anywhere from 30 minutes to a few hours.",
  },
  {
    question: "What types of vehicles are supported?",
    answer:
    "Our platform supports all types of electric vehicles, including two-wheelers, three-wheelers, and four-wheelers.",
  },
  {
    question: "Are there any penalties for late check-ins?",
    answer:
    "Repeated late check-ins without notice may lead to temporary suspension of booking privileges to ensure fairness for other users.",
  },
  {
    question: "Can I view my booking history?",
    answer:
    "Yes, you can view all past and current bookings in your dashboard under the 'My Bookings' section.",
  },
  {
    question: "Is the EV Recharge Hub mobile-friendly?",
    answer:
    "Absolutely. The platform is fully responsive and works smoothly on all devices including smartphones and tablets.",
  },
  {
    question: "How often is station data updated?",
    answer:
    "Station data including availability and location is updated in real time by station admins and system sensors.",
  },
  {
    question: "Do I need to bring anything for verification?",
    answer:
    "Most stations verify your booking using your phone number or booking ID. Some may request additional verification like your vehicle number.",
  },
  {
    question: "Can I use the service without GPS?",
    answer:
    "While GPS helps to automatically detect nearby stations, you can manually search by location if GPS access is disabled.",
  }
];

// Animation observer hook
const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState(null);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, options]);

  return [setElement, isVisible];
};

// Animated section component
const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const [setRef, isVisible] = useIntersectionObserver();
  
  return (
    <div
      ref={setRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Floating animation component
const FloatingElement = ({ children, className = "" }) => {
  return (
    <div className={`animate-float ${className}`}>
      {children}
    </div>
  );
};

// Staggered animation component
const StaggeredAnimation = ({ children, className = "", index = 0 }) => {
  const [setRef, isVisible] = useIntersectionObserver();
  
  return (
    <div
      ref={setRef}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-6 scale-95'
      } ${className}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {children}
    </div>
  );
};

const Homepage = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState(""); 

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending"); // Set status to indicate submission is in progress
    
        // *** THIS IS THE ONLY LINE YOU NEED TO CHANGE ***
        // Use the Formspree URL you provided
        const formUrl = "https://formspree.io/f/xblgewvr"; 
    
        try {
          const response = await fetch(formUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            setStatus("success");
            alert("Thank you for contacting us! We'll get back to you shortly.");
            setFormData({ name: "", email: "", message: "" }); // Clear form after success
          } else {
            const data = await response.json();
            console.error("Formspree error:", data);
            setStatus("error");
            alert("Oops! There was an issue sending your message. Please try again.");
          }
        } catch (error) {
          console.error("Network error:", error);
          setStatus("error");
          alert("Oops! A network error occurred. Please check your connection and try again.");
        }
      };

    return (
        <div>
            <style jsx>{`

            .text-shimmer {
            background: linear-gradient(135deg, #FFFFFF 0%, #F0F9FF 25%, #DBEAFE 50%, #BFDBFE 75%, #FFFFFF 100%);
            background-size: 300% 100%;
            animation: shimmer 4s ease-in-out infinite;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .dark .text-shimmer {
            background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #60A5FA 100%);
            background-size: 300% 100%;
            animation: shimmer 4s ease-in-out infinite;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 30px rgba(96, 165, 250, 0.4);
        }

        @keyframes shimmer {
            0%, 100% { background-position: 300% 0; }
            50% { background-position: -300% 0; }
        }

        .gradient-move {
            background-size: 400% 400%;
            animation: gradientMove 15s ease infinite;
        }

        @keyframes gradientMove {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .hero-text-enter {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease-out;
        }

        .hero-text-enter-active {
            opacity: 1;
            transform: translateY(0);
        }

        .hero-image-enter {
            opacity: 0;
            transform: translateX(50px) scale(0.9);
            transition: all 1s ease-out;
        }

        .hero-image-enter-active {
            opacity: 1;
            transform: translateX(0) scale(1);
        }

        .stagger-animation {
            opacity: 0;
            transform: translateY(20px);
            animation: staggerFadeIn 0.8s ease-out forwards;
        }

        .stagger-2 {
            animation-delay: 0.3s;
        }

        .stagger-3 {
            animation-delay: 0.6s;
        }

        @keyframes staggerFadeIn {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .button-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }

        .button-hover::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .button-hover:hover::before {
            left: 100%;
        }

        .button-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .floating-element {
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .pattern-dots {
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            animation: patternMove 20s linear infinite;
        }

        .dark .pattern-dots {
            background-image: radial-gradient(circle, rgba(96, 165, 250, 0.1) 1px, transparent 1px);
        }

        @keyframes patternMove {
            0% { background-position: 0 0; }
            100% { background-position: 20px 20px; }
        }

        .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .dark .glass-effect {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Enhanced text colors for better contrast */
        .hero-title {
            color: #1e3a8a; /* blue-900 for better contrast on light background */
        }

        .dark .hero-title {
            color: #dbeafe; /* blue-100 for better contrast on dark background */
        }

        .hero-subtitle {
            color: #1e40af; /* blue-800 */
        }

        .dark .hero-subtitle {
            color: #93c5fd; /* blue-300 */
        }

        
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInFromBottom {
                    from {
                        opacity: 0;
                        transform: translateY(50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }

                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translate3d(0,0,0);
                    }
                    40%, 43% {
                        transform: translate3d(0, -30px, 0);
                    }
                    70% {
                        transform: translate3d(0, -15px, 0);
                    }
                    90% {
                        transform: translate3d(0, -4px, 0);
                    }
                }

                @keyframes rotateY {
                    from {
                        transform: rotateY(0deg);
                    }
                    to {
                        transform: rotateY(360deg);
                    }
                }

                @keyframes morphing {
                    0%, 100% {
                        border-radius: 25% 75% 70% 30% / 30% 30% 70% 70%;
                    }
                    50% {
                        border-radius: 75% 25% 30% 70% / 70% 70% 30% 30%;
                    }
                }

                @keyframes slideInFromLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.5);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes flipInX {
                    from {
                        opacity: 0;
                        transform: perspective(400px) rotateX(-90deg);
                    }
                    to {
                        opacity: 1;
                        transform: perspective(400px) rotateX(0deg);
                    }
                }

                @keyframes slideInFromTop {
                    from {
                        opacity: 0;
                        transform: translateY(-40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes heartbeat {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }

                @keyframes wiggle {
                    0%, 7%, 14%, 21%, 28%, 35%, 42%, 49%, 56%, 63%, 70%, 77%, 84%, 91%, 98%, 100% {
                        transform: rotate(0deg);
                    }
                    7%, 21%, 35%, 49%, 63%, 77%, 91% {
                        transform: rotate(1deg);
                    }
                    14%, 28%, 42%, 56%, 70%, 84%, 98% {
                        transform: rotate(-1deg);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                .animate-fadeInLeft {
                    animation: fadeInLeft 0.8s ease-out forwards;
                }

                .animate-fadeInRight {
                    animation: fadeInRight 0.8s ease-out forwards;
                }

                .animate-slideInFromBottom {
                    animation: slideInFromBottom 0.8s ease-out forwards;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse 4s ease-in-out infinite;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.6s ease-out forwards;
                }

                .animate-slideUp {
                    animation: slideUp 0.6s ease-out forwards;
                }

                .animate-bounce-slow {
                    animation: bounce 2s infinite;
                }

                .animate-rotate-y {
                    animation: rotateY 2s ease-in-out infinite;
                }

                .animate-morphing {
                    animation: morphing 8s ease-in-out infinite;
                }

                .animate-slideInFromLeft {
                    animation: slideInFromLeft 0.8s ease-out forwards;
                }

                .animate-slideInFromRight {
                    animation: slideInFromRight 0.8s ease-out forwards;
                }

                .animate-zoomIn {
                    animation: zoomIn 0.8s ease-out forwards;
                }

                .animate-flipInX {
                    animation: flipInX 0.8s ease-out forwards;
                }

                .animate-slideInFromTop {
                    animation: slideInFromTop 0.8s ease-out forwards;
                }

                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                }

                .animate-heartbeat {
                    animation: heartbeat 2s ease-in-out infinite;
                }

                .animate-wiggle {
                    animation: wiggle 1s ease-in-out;
                }

                .hero-text-enter {
                    opacity: 0;
                    transform: translateY(30px);
                }

                .hero-text-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    transition: all 0.8s ease-out;
                }

                .hero-image-enter {
                    opacity: 0;
                    transform: translateX(30px) scale(0.9);
                }

                .hero-image-enter-active {
                    opacity: 1;
                    transform: translateX(0) scale(1);
                    transition: all 1s ease-out;
                }

                .stagger-animation {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: slideUp 0.6s ease-out forwards;
                }

                .stagger-1 { animation-delay: 0.1s; }
                .stagger-2 { animation-delay: 0.2s; }
                .stagger-3 { animation-delay: 0.3s; }
                .stagger-4 { animation-delay: 0.4s; }
                .stagger-5 { animation-delay: 0.5s; }
                .stagger-6 { animation-delay: 0.6s; }
                .stagger-7 { animation-delay: 0.7s; }
                .stagger-8 { animation-delay: 0.8s; }

                .card-hover {
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .card-hover:hover {
                    transform: translateY(-12px) rotateX(5deg) scale(1.03);
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3);
                }

                .button-hover {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .button-hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s;
                }

                .button-hover:hover::before {
                    left: 100%;
                }

                .button-hover:hover {
                    transform: translateY(-3px) scale(1.05);
                    box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.3);
                }

                .text-shimmer {
                    background: linear-gradient(90deg, #3B82F6, #1D4ED8, #8B5CF6, #3B82F6);
                    background-size: 300% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                @keyframes shimmer {
                    0%, 100% { background-position: 300% 0; }
                    50% { background-position: -300% 0; }
                }

                .gradient-move {
                    background-size: 400% 400%;
                    animation: gradientMove 6s ease infinite;
                }

                @keyframes gradientMove {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                .faq-enter {
                    opacity: 0;
                    max-height: 0;
                    transform: translateY(-10px);
                }

                .faq-enter-active {
                    opacity: 1;
                    max-height: 200px;
                    transform: translateY(0);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .number-counter {
                    animation: countUp 2s ease-out forwards;
                }

                @keyframes countUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .feature-icon-bounce:hover {
                    animation: bounce 1s ease-in-out;
                }

                .parallax-bg {
                    background-attachment: fixed;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                }

                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .gradient-text {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .typing-animation {
                    border-right: 2px solid #3B82F6;
                    animation: typing 3s steps(30) infinite;
                }

                @keyframes typing {
                    0%, 50% { border-right-color: #3B82F6; }
                    51%, 100% { border-right-color: transparent; }
                }

                .feature-card-hover {
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
                }

                .feature-card-hover:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                .faq-item {
                    transition: all 0.3s ease;
                }

                .faq-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }

                .contact-card {
                    transition: all 0.3s ease;
                }

                .contact-card:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
                }

                .form-floating {
                    transition: all 0.4s ease;
                }

                .form-floating:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
                }

                .footer-link {
                    transition: all 0.2s ease;
                }

                .footer-link:hover {
                    transform: translateX(5px);
                    color: #60A5FA;
                }
                    .pattern-dots {
            background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        }
        
        .glass-effect {
            background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
            backdrop-filter: blur(10px);
        }
        
        .gradient-move {
            background-size: 400% 400%;
            animation: gradientMove 15s ease infinite;
        }
        
        @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .text-shimmer {
            background: linear-gradient(45deg, #3B82F6, #8B5CF6, #06B6D4, #3B82F6);
            background-size: 400% 400%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        
        .hero-text-enter-active {
            animation: slideInLeft 1s ease-out;
        }
        
        .hero-image-enter-active {
            animation: slideInRight 1s ease-out;
        }
        
        @keyframes slideInLeft {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .stagger-animation {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
        }
        
        .stagger-2 {
            animation-delay: 0.2s;
        }
        
        .stagger-3 {
            animation-delay: 0.4s;
        }
        
        @keyframes fadeInUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .floating-element {
            position: relative;
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        .button-hover {
            transition: all 0.3s ease;
        }
        
        .button-hover:hover {
            transform: translateY(-2px);
        }
        
        /* Mobile-first approach for image positioning */
        .mobile-image-order {
            order: 2;
        }
        
        .mobile-content-order {
            order: 3;
        }
        
        /* Large screen layout */
        @media (min-width: 768px) {
            .mobile-image-order {
                order: 0;
            }
            
            .mobile-content-order {
                order: 0;
            }
        }
            `}</style>
            
            <Navbar />
            <main className="dark:bg-gray-900 dark:text-white text-gray-800 font-inter overflow-hidden">
                <section id="hero" class="relative bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-24 md:py-32 px-6 gradient-move">
        <div class="absolute inset-0 z-0 pattern-dots opacity-30"></div>
        <div class="absolute inset-0 z-5 glass-effect opacity-20"></div>
        
        <div class="max-w-7xl mx-auto flex -mt-11 flex-col md:flex-row items-center justify-between gap-12 relative z-10">
            <div class="flex-1 text-center md:text-left hero-text-enter-active">
                <h1 class="text-4xl lg:text-6xl font-extrabold leading-tight mb-6 hero-title">
                    Power Your Journey with 
                    <span class="text-shimmer drop-shadow-lg block mt-4 pb-4">EV Charge Hub</span>
                </h1>
                
                <div class="md:hidden flex justify-center mb-8 hero-image-enter-active">
                    <div class="floating-element">
                        <img
                            src="https://img.freepik.com/free-vector/electric-car-charging-station-concept-illustration_114360-8227.jpg"
                            alt="EV Charging Station"
                            class="rounded-3xl shadow-2xl w-full max-w-sm border-4 border-white/30 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-500 backdrop-blur-sm"
                            onerror="this.onerror=null; this.src='https://placehold.co/600x400/E0E7FF/3F51B5?text=EV+Charging'"
                        />
                        <div class="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-full opacity-70 animate-pulse"></div>
                        <div class="absolute -bottom-4 -right-4 w-8 h-8 bg-indigo-400 rounded-full opacity-60 animate-bounce"></div>
                        <div class="absolute top-1/2 -left-8 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-ping"></div>
                    </div>
                </div>
                
                <p class="text-xl lg:text-2xl mb-8 hero-subtitle stagger-animation stagger-2 font-medium">
                    Locate, Book, and Recharge at your nearest EV Station. Easy. Fast. Smart.
                </p>
                
                <div class="flex flex-col sm:flex-row justify-center md:justify-start gap-5 stagger-animation stagger-3">
                    <button class="button-hover bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                        <a href="/user/login" onclick="alert('Navigate to /user/login')">
                            Get Started
                        </a>
                    </button>
                    <button class="button-hover bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                        <a href="/how-it-works" onclick="alert('Navigate to /how-it-works')">
                            How It Works
                        </a>
                    </button>
                </div>
            </div>
            
\            <div class="hidden md:flex flex-1 justify-center md:justify-end mt-12 md:mt-0 hero-image-enter-active">
                <div class="floating-element">
                    <img
                        src="https://img.freepik.com/free-vector/electric-car-charging-station-concept-illustration_114360-8227.jpg"
                        alt="EV Charging Station"
                        class="rounded-3xl shadow-2xl w-full max-w-md border-4 border-white/30 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-500 backdrop-blur-sm"
                        onerror="this.onerror=null; this.src='https://placehold.co/600x400/E0E7FF/3F51B5?text=EV+Charging'"
                    />
                    <div class="absolute -top-6 -left-6 w-12 h-12 bg-blue-500 rounded-full opacity-70 animate-pulse"></div>
                    <div class="absolute -bottom-4 -right-4 w-8 h-8 bg-indigo-400 rounded-full opacity-60 animate-bounce"></div>
                    <div class="absolute top-1/2 -left-8 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-ping"></div>
                </div>
            </div>
        </div>
    </section>
                <section id='about-us' className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-16 px-6 md:px-20">
                    <div className="max-w-6xl mx-auto">
                        {/* Enhanced Introduction */}
                        <AnimatedSection className="text-center mb-12">
                            <h1 className="text-5xl font-extrabold mb-4 text-blue-700 dark:text-blue-400 animate-slideInFromTop">
                                About EV Charge Hub
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fadeIn">
                                Connecting you to the future of sustainable electric vehicle charging in **Karnataka**.
                            </p>
                            <div className="w-24 h-1 bg-blue-500 mx-auto mt-6 rounded-full animate-pulse-slow"></div>
                        </AnimatedSection>

                        <AnimatedSection delay={200}>
                            <p className="mb-12 text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto animate-slideInFromBottom">
                                <strong className="text-blue-600 dark:text-blue-300">EV Charge Hub</strong> is an innovative platform designed to streamline the electric vehicle (EV) charging experience for users and administrators alike in **Udupi, Karnataka**, and beyond. Our mission is to empower the future of mobility by connecting EV drivers with accessible, reliable, and smart charging stations, fostering a greener transportation ecosystem in India.
                            </p>
                        </AnimatedSection>

                        {/* Card-Based Sections */}
                        <div className="grid md:grid-cols-2 gap-10 mt-10">
                            <AnimatedSection delay={300}>
                                <div className="card-hover bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 animate-slideInFromLeft">
                                    <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400 animate-zoomIn">Why EV Charge Hub?</h2>
                                    <ul className="list-disc ml-6 space-y-3 text-base text-gray-700 dark:text-gray-200">
                                        <li className="animate-slideUp stagger-1">Locate nearby EV charging stations in **Udupi** and across **Karnataka** with ease.</li>
                                        <li className="animate-slideUp stagger-2">Book and manage charging slots seamlessly in real-time within our network.</li>
                                        <li className="animate-slideUp stagger-3">Get detailed bunk info including address, map specific to **Karnataka** locations, and available slots.</li>
                                        <li className="animate-slideUp stagger-4">Dedicated admin tools to add, manage, and monitor EV recharge bunks efficiently, focusing on the **Karnataka** region.</li>
                                        <li className="animate-slideUp stagger-5">Modern interface with responsive and dark mode support for optimal user experience.</li>
                                    </ul>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={400}>
                                <div className="card-hover bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 animate-slideInFromRight">
                                    <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400 animate-zoomIn">Our Vision</h2>
                                    <p className="text-base leading-relaxed text-gray-700 dark:text-gray-200 animate-fadeIn">
                                        At EV Charge Hub, we believe the future of transportation in **Karnataka** and across India is electric and sustainable. We're committed to supporting this transition by building a platform that is simple, efficient, and accessible for everyone—from enthusiastic EV owners in **Udupi** to dedicated recharge station operators throughout the state. We envision a future where range anxiety is a thing of the past, and charging an EV is as simple as fueling a traditional vehicle.
                                    </p>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                <section id="how-it%20works" className="py-24 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                    <div className="max-w-7xl mx-auto">
                        <AnimatedSection>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-16">
                                How EV Charge Hub Works
                            </h2>
                        </AnimatedSection>
                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <AnimatedSection key={index} delay={index * 100}>
                                    <div className={`card-hover flex flex-col md:flex-row items-center md:space-x-10 p-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                        <FloatingElement className={`text-6xl md:text-7xl flex-shrink-0 mb-6 md:mb-0 ${index % 2 === 0 ? 'text-blue-500' : 'text-emerald-500'} dark:text-blue-300 feature-icon-bounce`}>
                                            {step.icon}
                                        </FloatingElement>
                                        <div className={index % 2 === 0 ? 'text-center md:text-left' : 'text-center md:text-right'}>
                                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 md:mt-0 mb-3">{`${index + 1}. ${step.title}`}</h3>
                                            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                        <AnimatedSection delay={800} className="mt-20 text-center">
                            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                                Ready to simplify your EV charging?{" "}
                                <Link
                                    to="/user/login"
                                    className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold transition-colors duration-200"
                                >
                                    Login now
                                </Link>{" "}
                                and book your slot!
                            </p>
                        </AnimatedSection>
                    </div>
                </section>

                <section id="features" className="py-24 px-6 md:px-12 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-slate-800">
    <div className="max-w-7xl mx-auto">
        <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-50 mb-8 animate-fade-in-down text-center">
                Unlock the Power of Seamless EV Charging
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 animate-fade-in-down delay-100 mb-20 text-center max-w-4xl mx-auto">
                Effortless EV Charging: Experience Tomorrow's Convenience Today with Intelligent Slot Reservations and an Expansive Network.
            </p>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {[
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    ),
                    title: "Extensive Network in Karnataka",
                    description: "Discover a growing network of EV charging stations across Mudbidri and all major locations in Karnataka, ensuring you're always connected.",
                    color: "from-purple-600 to-indigo-700",
                    shadowColor: "shadow-purple-500/25",
                    delay: "delay-0"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    ),
                    title: "Real-Time Availability & Booking",
                    description: "Check live availability of charging slots and book your preferred time in advance to avoid waiting, ensuring a smooth charging experience.",
                    color: "from-blue-600 to-cyan-700",
                    shadowColor: "shadow-blue-500/25",
                    delay: "delay-100"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    ),
                    title: "Intuitive User & Admin Panels",
                    description: "Dedicated, user-friendly dashboards for EV owners to manage bookings and for station administrators to oversee the network efficiently.",
                    color: "from-emerald-600 to-teal-700",
                    shadowColor: "shadow-emerald-500/25",
                    delay: "delay-200"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    ),
                    title: "Smart Charge Management",
                    description: "Optimize your charging sessions with smart features, monitor energy usage in real-time, and track your complete charging history for insights.",
                    color: "from-orange-600 to-red-700",
                    shadowColor: "shadow-orange-500/25",
                    delay: "delay-300"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    title: "Guaranteed Charging Slots",
                    description: "Book your preferred charging slot in advance, eliminating waiting times and range anxiety across Karnataka, including Mudbidri.",
                    color: "from-green-600 to-lime-700",
                    shadowColor: "shadow-green-500/25",
                    delay: "delay-400"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9m-9 9c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path>
                        </svg>
                    ),
                    title: "Optimized Charging Experience",
                    description: "Intelligent booking systems help distribute demand, preventing congestion at popular charging points and ensuring a smooth experience.",
                    color: "from-pink-600 to-rose-700",
                    shadowColor: "shadow-pink-500/25",
                    delay: "delay-500"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.92 12c0 3.072 1.22 5.852 3.14 7.954L12 22.95l5.94-5.046A12.004 12.004 0 0021.08 12c0-3.072-1.22-5.852-3.14-7.954z"></path>
                        </svg>
                    ),
                    title: "Efficient Route Planning",
                    description: "Integrate charging stops seamlessly into your travel plans across Karnataka, ensuring smooth and uninterrupted long-distance journeys.",
                    color: "from-violet-600 to-purple-700",
                    shadowColor: "shadow-violet-500/25",
                    delay: "delay-600"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    ),
                    title: "Diverse Charger Types & Speeds",
                    description: "Find a variety of charging options, from rapid DC chargers for quick top-ups to AC chargers for overnight power, catering to all EV models.",
                    color: "from-teal-600 to-blue-700",
                    shadowColor: "shadow-teal-500/25",
                    delay: "delay-700"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path>
                        </svg>
                    ),
                    title: "Enhanced Charging Network",
                    description: "Benefit from Karnataka's continuously expanding EV charging infrastructure, with thousands of stations across the state, making charging accessible everywhere.",
                    color: "from-amber-600 to-orange-700",
                    shadowColor: "shadow-amber-500/25",
                    delay: "delay-800"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    ),
                    title: "Time Tracking",
                    description: "Monitor your charging sessions and energy consumption directly through the app, helping you manage your EV expenses effectively.",
                    color: "from-indigo-600 to-blue-700",
                    shadowColor: "shadow-indigo-500/25",
                    delay: "delay-900"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 21h7a2 2 0 002-2V9a2 2 0 00-2-2h-7a2 2 0 00-2 2v10a2 2 0 002 2zM9 19H7a2 2 0 01-2-2V7a2 2 0 012-2h2"></path>
                        </svg>
                    ),
                    title: "User-Friendly Mobile Apps",
                    description: "Access intuitive and easy-to-use mobile applications for finding, booking, and managing your EV charging sessions.",
                    color: "from-sky-600 to-cyan-700",
                    shadowColor: "shadow-sky-500/25",
                    delay: "delay-1000"
                },
                {
                    icon: (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l-2 5m2-5l-2-5m-2 5l4-9"></path>
                        </svg>
                    ),
                    title: "Eco-Friendly Initiative",
                    description: "Join our community committed to sustainable transportation, reduce your carbon footprint, and contribute to a cleaner environment in Karnataka.",
                    color: "from-emerald-600 to-green-700",
                    shadowColor: "shadow-emerald-500/25",
                    delay: "delay-1100"
                }
            ].map((feature, index) => (
                <StaggeredAnimation key={index} index={index}>
                    <div className="feature-card-hover pt-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl border border-slate-200/60 dark:border-slate-700/60 h-full transition-all duration-300">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 mx-auto animate-bounce-slow shadow-lg ${feature.shadowColor}`}>
                            <span className="text-white text-3xl animate-wiggle hover:animate-pulse">{feature.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
                            {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-center leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                </StaggeredAnimation>
            ))}
        </div>
    </div>
</section>
                {/* FAQ Section */}
                <section id="faq" className="py-24 px-6 md:px-12 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-4xl mx-auto">
                        <AnimatedSection>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-16">
                                Frequently Asked Questions
                            </h2>
                        </AnimatedSection>
                        
                        <div className="space-y-6">
                            {faqData.map((faq, index) => (
                                <AnimatedSection key={index} delay={index * 100} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 ">
                                    <div className="faq-item">
                                        <button
                                        className="flex justify-between items-center w-full text-left text-2xl font-semibold text-gray-900 dark:text-white focus:outline-none"
                                        onClick={() => toggleFAQ(index)}
                                    >
                                        {faq.question}
                                        <svg className={`w-6 h-6 transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </button>
                                    {activeIndex === index && (
                                        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed animate-fade-in">
                                            {faq.answer}
                                        </p>
                                    )}
                                    </div>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-24 px-6 md:px-12 bg-white dark:bg-gray-900">
                    <div className="max-w-6xl mx-auto">
                        <AnimatedSection>
                            <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-16">
                                Get in Touch
                            </h2>
                            <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
                                Have questions about EV charging in Karnataka? We're here to help you power your journey.
                            </p>
                        </AnimatedSection>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Info */}
                            <AnimatedSection delay={200}>
                                <div className="space-y-8">
                                    {[
                                        {
                                            icon: "📧",
                                            title: "Email Us",
                                            info: "support@evchargehub.com",
                                            description: "Get in touch for support and inquiries"
                                        },
                                        {
                                            icon: "📞",
                                            title: "Call Us",
                                            info: "+91 9876543210",
                                            description: "24/7 customer support available"
                                        },
                                        {
                                            icon: "📍",
                                            title: "Visit Us",
                                            info: "Udupi, Karnataka, India",
                                            description: "Our headquarters in the heart of Karnataka"
                                        }
                                    ].map((contact, index) => (
                                        <StaggeredAnimation key={index} index={index}>
                                            <div className="contact-card bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-start space-x-4">
                                                    <div className="text-3xl animate-bounce-slow">{contact.icon}</div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                            {contact.title}
                                                        </h3>
                                                        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                                            {contact.info}
                                                        </p>
                                                        <p className="text-gray-600 dark:text-gray-300">
                                                            {contact.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </StaggeredAnimation>
                                    ))}
                                </div>
                            </AnimatedSection>

                            {/* Contact Form */}
                            <AnimatedSection delay={400}>
                                <div className="form-floating bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
                                    <form onSubmit={handleSubmit} className="grid gap-6 p-6 md:p-8 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
                                        <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="name">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                                            placeholder="Your Name"
                                        />
                                        </div>

                                        <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="email">Your Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition duration-200"
                                            placeholder="youremail@gmail.com"
                                        />
                                        </div>

                                        <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300" htmlFor="message">Your Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="6"
                                            required
                                            className="w-full px-5 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-y transition duration-200"
                                            placeholder="Tell us how we can help you..."
                                        ></textarea>
                                        </div>

                                        <button
                                        type="submit"
                                        disabled={status === "sending"} // Disable button during submission
                                        className={`w-full text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform ${
                                            status === "sending"
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                                        } focus:outline-none focus:ring-3 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
                                        >
                                        {status === "sending" ? "Sending..." : "Send Message"}
                                        </button>
                                        {status === "success" && (
                                        <p className="text-green-600 dark:text-green-400 mt-2 text-center">Message sent successfully!</p>
                                        )}
                                        {status === "error" && (
                                        <p className="text-red-600 dark:text-red-400 mt-2 text-center">Error sending message. Please try again.</p>
                                        )}
                                    </form>
                                </div>
                            </AnimatedSection>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 dark:bg-black text-white py-16 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-4 gap-8">
                            <AnimatedSection>
                                <div className="col-span-2 md:col-span-1">
                                    <h3 className="text-2xl font-bold mb-6 text-blue-400">EV Charge Hub</h3>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        Connecting Karnataka to the future of sustainable electric vehicle charging.
                                    </p>
                                    <div className="flex space-x-4">
                                        {['📘', '🐦', '📷', '💼'].map((icon, index) => (
                                            <div key={index} className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 animate-float" style={{animationDelay: `${index * 0.5}s`}}>
                                                <span className="text-lg">{icon}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={100}>
                                <div>
                                    <h4 className="text-lg font-semibold mb-6 text-blue-400">Quick Links</h4>
                                    <ul className="space-y-3">
                                        {['About Us', 'How It Works', 'Features', 'FAQ', 'Contact'].map((link, index) => (
                                            <li key={index}>
                                                <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="footer-link text-gray-300 hover:text-blue-400">
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={200}>
                                <div>
                                    <h4 className="text-lg font-semibold mb-6 text-blue-400">For Users</h4>
                                    <ul className="space-y-3">
                                        {['Find Stations', 'Book Slots', 'User Guide', 'Mobile App', 'Support'].map((link, index) => (
                                            <li key={index}>
                                                <Link to="/user/login" className="footer-link text-gray-300 hover:text-blue-400">
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={300}>
                                <div>
                                    <h4 className="text-lg font-semibold mb-6 text-blue-400">For Operators</h4>
                                    <ul className="space-y-3">
                                        {['Admin Dashboard', 'Add Stations', 'Manage Bookings', 'Analytics', 'Partner With Us'].map((link, index) => (
                                            <li key={index}>
                                                <Link to="/admin/login" className="footer-link text-gray-300 hover:text-blue-400">
                                                    {link}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedSection>
                        </div>

                        <AnimatedSection delay={400}>
                            <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                                <p className="text-gray-400">
                                    © 2024 EV Charge Hub. All rights reserved. Powering sustainable mobility across Karnataka.
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default Homepage;