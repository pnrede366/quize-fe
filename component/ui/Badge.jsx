export default function Badge({ 
  children, 
  variant = "default",
  onClick,
  className = "",
  ...props 
}) {
  const variants = {
    default: "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
    easy: "bg-green-600/20 text-green-400",
    medium: "bg-yellow-600/20 text-yellow-400",
    hard: "bg-orange-600/20 text-orange-400",
    expert: "bg-red-600/20 text-red-400",
  };
  
  const baseStyles = "rounded-full px-4 py-2 text-sm";
  const interactiveStyles = onClick ? "cursor-pointer" : "";
  
  const classes = `${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`;
  
  return (
    <span onClick={onClick} className={classes} {...props}>
      {children}
    </span>
  );
}

