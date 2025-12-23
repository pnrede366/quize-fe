import Input from "./Input";
import Button from "./Button";

export default function SearchBox({ 
  value, 
  onChange, 
  onGenerate,
  placeholder,
  generateText = "Generate",
  helperText,
  className = "" 
}) {
  return (
    <div className={`w-full max-w-2xl ${className}`}>
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3 focus-within:border-indigo-500 sm:flex-row sm:items-center sm:px-4 sm:py-3 sm:gap-0">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full flex-1"
        />
        <Button
          onClick={onGenerate}
          className="w-full shrink-0 sm:ml-4 sm:w-auto"
        >
          {generateText}
        </Button>
      </div>
      {helperText && (
        <p className="mt-3 text-center text-xs text-zinc-300 sm:text-sm">
          {helperText}
        </p>
      )}
    </div>
  );
}

