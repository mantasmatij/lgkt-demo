export const inputClassNames = {
  // Outer wrapper of the control (pill)
  inputWrapper:
    "h-11 min-h-11 rounded-full border-2 border-black data-[hover=true]:border-black/80 px-2 flex items-center shadow-sm outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none ring-0 focus:ring-0 focus-visible:ring-0 data-[focus=true]:ring-0 data-[focus=true]:border-black data-[focus-visible=true]:ring-0 data-[focus-visible=true]:border-black",
  // Actual input element inside
  input: "text-base leading-6 py-0 px-2 placeholder:text-gray-400 appearance-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0",
  // Not used (external label), but kept for completeness
  label: "!text-black font-medium",
  // Ensure the slot wrapper doesn't force extra height
  mainWrapper: "h-auto",
};

// Textarea-specific class names: no fixed height, bordered rounded container
export const textareaClassNames = {
  inputWrapper:
    "rounded-2xl border-2 border-black data-[hover=true]:border-black/80 px-4 py-3 shadow-sm outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none ring-0 focus:ring-0 focus-visible:ring-0 data-[focus=true]:ring-0 data-[focus=true]:border-black data-[focus-visible=true]:ring-0 data-[focus-visible=true]:border-black",
  input: "text-base leading-6 py-0 px-2 placeholder:text-gray-400 appearance-none resize-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0",
  label: "!text-black font-medium",
  mainWrapper: "h-auto",
};
