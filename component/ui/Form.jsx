"use client";

import { useState, useCallback, memo } from "react";
import Input from "./Input";
import Button from "./Button";

const FormField = memo(({ field, value, onChange }) => {
  return (
    <div>
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-zinc-300">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 focus-within:border-indigo-500">
        <Input
          id={field.name}
          name={field.name}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          className="text-base"
          required={field.required}
          {...field.props}
        />
      </div>
    </div>
  );
});

FormField.displayName = "FormField";

export default function Form({
  title,
  fields = [],
  submitButtonText = "Submit",
  onSubmit,
  footer,
  initialValues = {},
  className = "",
}) {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] = initialValues[field.name] || "";
    });
    return initial;
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(formData);
      }
    },
    [formData, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {title && <h1 className="mb-8 text-3xl font-bold text-zinc-100">{title}</h1>}
      
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name] || ""}
          onChange={handleChange}
        />
      ))}

      <Button type="submit" size="lg" className="w-full">
        {submitButtonText}
      </Button>

      {footer && <div className="mt-6">{footer}</div>}
    </form>
  );
}

