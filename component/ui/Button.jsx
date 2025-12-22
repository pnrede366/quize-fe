import Link from "next/link";

export default function Button({ 
  children, 
  href, 
  onClick, 
  variant = "primary",
  size = "md",
  className = "",
  ...props 
}) {
  const baseStyles = "rounded-lg font-medium transition-colors";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white",
    secondary: "bg-zinc-700 hover:bg-zinc-600 text-white",
    outline: "border border-zinc-800 bg-transparent hover:bg-zinc-800 text-zinc-300",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  
  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
}

