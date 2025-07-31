import React, { useState } from 'react';

const EmailForm = ({ onEmailSubmit }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // State to control which view (and background) is shown
  const [showEmailForm, setShowEmailForm] = useState(false);

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

  // This function will now trigger the state change to show the email form
  const handlePlayClick = () => {
    setShowEmailForm(true);
  };

  const isValidEmail = email.trim() && validateEmail(email);

  // Dynamically set the background image based on the showEmailForm state.
  // This assumes 'background2.png' and 's1.png' are in your 'public' folder.
  const backgroundImageUrl = showEmailForm
    ? "url('/s1.png')"
    : "url('/background2.png')";

  return (
    <div
      className="h-screen w-screen flex items-center justify-center px-4 overflow-hidden transition-all duration-500"
      style={{
        // The backgroundImage property is now dynamic
        backgroundImage: backgroundImageUrl,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center relative w-full">
        {/* Conditional rendering based on showEmailForm state */}
        {!showEmailForm ? (
          // Initial Welcome Content with background2.png
          <div className="text-center mb-16 transition-opacity duration-500 ease-in-out">
     
            <button
              onClick={handlePlayClick}
              className="text-white text-6xl font-semibold w-[800px] h-[240px] rounded-full  transform hover:scale-105 hover:shadow-xl mt-[900px]"
              style={{ backgroundColor: 'transparent' }}
            >
            </button>
          </div>
        ) : (
          // Email Form Content with s1.png
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
