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
      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 focus-within:border-indigo-500">
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <Button
          onClick={onGenerate}
          className="ml-4"
        >
          {generateText}
        </Button>
      </div>
      {helperText && (
        <p className="mt-3 text-center text-sm text-zinc-500">
          {helperText}
        </p>
      )}
    </div>
  );
}

