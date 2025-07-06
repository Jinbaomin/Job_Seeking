import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const additionalClass = props.className;

  delete props.className;

  const base = 'px-4 py-2 rounded-lg font-semibold focus:outline-none transition-colors hover:cursor-pointer';
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100';
  return (
    <button className={`${base} ${styles} ${additionalClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button; 