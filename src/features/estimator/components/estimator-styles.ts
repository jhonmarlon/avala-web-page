import { formStyles } from "@/components/ui/form-styles";

// Estimator-local surfaces and opt-in shared form controls.
export const estimatorStyles = {
  panel: "border border-avala-paper/15 bg-avala-ink text-avala-paper",
  metric: "border border-avala-paper/15 bg-avala-paper/[0.02] p-4",
  label: formStyles.label,
  input: formStyles.input,
  error: formStyles.error,
  inputError: formStyles.inputError,
  option: "border p-4 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avala-neon focus-visible:ring-offset-2 focus-visible:ring-offset-avala-ink disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
  optionSelected: "border-avala-neon bg-avala-neon/10 text-avala-paper",
  optionIdle: "border-avala-paper/20 bg-avala-paper/[0.02] text-avala-paper hover:border-avala-neon/70 hover:bg-avala-paper/5",
  button: "rounded-none border-avala-neon bg-[var(--color-avala-neon)] bg-none px-5 py-3 text-base text-avala-ink shadow-none hover:border-avala-paper hover:bg-avala-paper hover:brightness-100 focus-visible:ring-avala-neon disabled:opacity-40 motion-reduce:transition-none",
  buttonSecondary: "rounded-none border-avala-paper/25 bg-transparent px-5 py-3 text-base text-avala-paper shadow-none hover:border-avala-neon hover:text-avala-neon focus-visible:ring-avala-neon disabled:opacity-40 motion-reduce:transition-none",
} as const
