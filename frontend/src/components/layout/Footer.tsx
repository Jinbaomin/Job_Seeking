import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 text-center p-4 mt-8 text-gray-500">
      © {new Date().getFullYear()} Job Seeking. All rights reserved.
    </footer>
  );
};

export default Footer; 