import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/email-entry-screen', label: 'Start Game', icon: 'Play' },
    { path: '/game-play-screen', label: 'Play', icon: 'GameController2' },
    { path: '/results-screen', label: 'Results', icon: 'Trophy' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-game-resting">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg shadow-game-resting">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary-foreground"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                  fill="currentColor"
                />
                <circle cx="12" cy="12" r="3" fill="var(--color-accent)" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-text-primary leading-tight">
                Skill Bucket
              </h1>
              <span className="text-xs text-text-secondary font-medium">
                Sorting Game
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.path)}
                iconName={item.icon}
                iconPosition="left"
                iconSize={16}
                className="hover-lift"
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
              onClick={() => window.location.reload()}
              className="hover-lift"
            >
              Reset
            </Button>
            <Button
              variant="default"
              size="sm"
              iconName="Play"
              iconPosition="left"
              iconSize={16}
              onClick={() => handleNavigation('/game-play-screen')}
              className="hover-lift"
            >
              Play Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              iconName={isMobileMenuOpen ? "X" : "Menu"}
              iconSize={20}
              className="hover-lift"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface border-t border-border shadow-game-hover animate-slide-up">
            <div className="px-4 py-3 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  size="sm"
                  fullWidth
                  onClick={() => handleNavigation(item.path)}
                  iconName={item.icon}
                  iconPosition="left"
                  iconSize={16}
                  className="justify-start"
                >
                  {item.label}
                </Button>
              ))}
              
              <div className="pt-2 border-t border-border space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="RotateCcw"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => {
                    window.location.reload();
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start"
                >
                  Reset Game
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  iconName="Play"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => handleNavigation('/game-play-screen')}
                  className="justify-start"
                >
                  Play Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;