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
} as const
