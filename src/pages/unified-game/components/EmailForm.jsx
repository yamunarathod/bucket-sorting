import React, { useState } from 'react';

const EmailForm = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false); // New state to control visibility

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call or async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onEmailSubmit(email);
    } catch {
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handlePlayClick = () => {
    setShowEmailForm(true); // Show the email form when "Click here to Play" is clicked
  };

  const isValidEmail = email.trim() && validateEmail(email);

  return (
    <div
      className="h-screen w-screen flex items-center justify-center px-4 overflow-hidden"
      style={{
        backgroundImage: "url('/assets/images/s1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center relative w-full">
        {/* Conditional rendering based on showEmailForm state */}
        {!showEmailForm ? (
          // Initial Welcome Content
          <div className="text-center mb-16 transition-opacity duration-500 ease-in-out">
            {/* Headings with increased font size and specific color */}
            <h3 className="text-8xl font-bold mb-4" style={{ color: '#00B5DB', lineHeight: '1' }}>Play More,</h3>
            <h3 className="text-8xl font-bold" style={{ color: '#00B5DB', lineHeight: '1' }}>Learn More</h3>

            {/* CTA Button with increased font, width, height, and specific background color */}
            <button
              onClick={handlePlayClick}
              className="text-white text-6xl font-semibold px-20 py-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl mt-20"
              style={{ backgroundColor: '#4315EF' }} // Applied direct style for specific background color
            >
              Click here to Play
            </button>
          </div>
        ) : (
          // Email Form Content
          <div className="w-full max-w-3xl flex flex-col items-center transition-opacity duration-500 ease-in-out">
            <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-bold text-[#00B5DB] text-center mb-12 sm:mb-16">
              Sort into buckets Game
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 sm:gap-12 items-center w-full px-4">
              <input
                type="email"
                placeholder="Enter E-mail address"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                required
                className="w-full max-w-xl h-[64px] sm:h-[80px] md:h-[90px] px-4 sm:px-6 text-lg sm:text-2xl md:text-3xl bg-[#4291C3] border border-[#4315EF] text-white placeholder-white text-center rounded-[12px] shadow-md focus:outline-none"
              />

              <button
                type="submit"
                disabled={!isValidEmail || isLoading}
                className="w-full max-w-xs h-[60px] sm:h-[70px] md:h-[80px] bg-[#4315EF] text-white text-lg sm:text-xl md:text-4xl font-semibold rounded-full shadow-xl hover:opacity-90 transition-all"
              >
                {isLoading ? 'Starting...' : 'Play'}
              </button>
            </form>

            {error && <p className="text-md sm:text-lg text-red-600 mt-6 sm:mt-8 text-center">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailForm;