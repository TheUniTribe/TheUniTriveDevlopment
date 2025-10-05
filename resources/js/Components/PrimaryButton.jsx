const PrimaryButton = ({ children, className = "", size = "md", ...props }) => {
  const sizes = {
    sm: "px-4 py-1 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };
  
  return (
    <button className={`rounded-lg bg-blue-600 text-white font-medium transition hover:bg-blue-700 
                       ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
