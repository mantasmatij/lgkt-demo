export const inputClassNames = {
  // Outer wrapper of the control (pill)
  inputWrapper:
    "h-11 min-h-11 rounded-full border-2 border-black data-[hover=true]:border-black/80 px-2 flex items-center shadow-sm",
  // Actual input element inside
  input: "text-base leading-6 py-0 px-2 placeholder:text-gray-400 appearance-none",
  // Not used (external label), but kept for completeness
  label: "!text-black font-medium",
  // Ensure the slot wrapper doesn't force extra height
  mainWrapper: "h-auto",
};

// Textarea-specific class names: no fixed height, bordered rounded container
export const textareaClassNames = {
  inputWrapper:
    "rounded-2xl border-2 border-black data-[hover=true]:border-black/80 px-4 py-3 shadow-sm",
  input: "text-base leading-6 py-0 px-2 placeholder:text-gray-400 appearance-none resize-none",
  label: "!text-black font-medium",
  mainWrapper: "h-auto",
};
