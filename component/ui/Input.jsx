export default function Input({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className = "",
  ...props 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex-1 bg-transparent text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
      {...props}
    />
  );
}

