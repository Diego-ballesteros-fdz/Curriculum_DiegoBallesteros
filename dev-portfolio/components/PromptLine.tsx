/**
 * Una línea de comando: `visitante@portfolio:~$ <comando>`.
 * Se usa para encabezar cada bloque de salida del portfolio.
 */
export default function PromptLine({ command }: { command: string }) {
  return (
    <p className="select-none break-all text-sm">
      <span className="text-term-green">visitante@portfolio</span>
      <span className="text-term-dim">:</span>
      <span className="text-term-cyan">~</span>
      <span className="text-term-dim">$ </span>
      <span className="text-term-fg">{command}</span>
    </p>
  );
}
