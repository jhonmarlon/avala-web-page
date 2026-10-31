// Opt-in form presentation; native semantics and validation belong to each form.
export const formStyles = {
  label: "font-mono text-xs uppercase tracking-[0.14em] text-avala-mute",
  input: [
    "w-full rounded-none border border-avala-paper/25 bg-avala-ink px-4 py-3 text-base text-avala-paper placeholder:text-avala-mute outline-none transition-colors focus:border-avala-neon focus-visible:ring-2 focus-visible:ring-avala-neon/60 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
    // Paint over browser autofill without replacing Tailwind's focus-ring shadow.
    // Leave forced-colors rendering to the browser and system palette.
    // Explicit width + state-specific colors avoid a bright native autofill edge.
    "not-forced-colors:autofill:border not-forced-colors:autofill:not-focus:border-avala-paper/25 not-forced-colors:autofill:focus:border-avala-neon",
    "not-forced-colors:autofill:bg-avala-ink not-forced-colors:autofill:text-avala-paper not-forced-colors:autofill:caret-avala-paper",
    "not-forced-colors:autofill:[-webkit-text-fill-color:var(--color-avala-paper)]",
    "not-forced-colors:autofill:inset-shadow-[0_0_0_1000px_var(--color-avala-ink)]",
  ].join(" "),
  // Local opt-in scroll region; system colors retain the native scrollbar.
  countryList: [
    "max-h-52 overflow-y-auto overscroll-contain",
    "not-forced-colors:[scrollbar-width:auto] not-forced-colors:[scrollbar-color:var(--color-avala-neon)_var(--color-avala-ink)]",
    "not-forced-colors:supports-[selector(::-webkit-scrollbar)]:[scrollbar-color:auto]",
    "not-forced-colors:[&::-webkit-scrollbar]:w-3 not-forced-colors:[&::-webkit-scrollbar-track]:bg-avala-ink",
    "not-forced-colors:[&::-webkit-scrollbar-thumb]:rounded-full not-forced-colors:[&::-webkit-scrollbar-thumb]:border-[3px] not-forced-colors:[&::-webkit-scrollbar-thumb]:border-avala-ink not-forced-colors:[&::-webkit-scrollbar-thumb]:bg-avala-neon",
  ].join(" "),
  error: "text-sm leading-5 text-red-300",
  inputError: "border-red-300 not-forced-colors:autofill:not-focus:border-red-300 not-forced-colors:autofill:focus:border-red-300",
} as const
