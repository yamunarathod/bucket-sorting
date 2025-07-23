import React from 'react';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ onPlayAgain, onShareResults }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 roun">
      <Button
        onClick={onPlayAgain}
        variant="default"
        size="lg"
        iconName="RotateCcw"
        iconPosition="left"
        className="hover-lift px-12 py-8 rounded-full text-lg font-semibold text-2xl"
      >
        Home 
      </Button>
      
     
    </div>
  );
};

export default ActionButtons;