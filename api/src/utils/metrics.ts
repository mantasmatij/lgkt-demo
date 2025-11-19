// Minimal metrics stub for export attempts (T052)
type Labels = Record<string, string | number | boolean>;

const counters: Record<string, number> = {};

export function incCounter(name: string, labels?: Labels) {
  const key = labels ? `${name}:${Object.entries(labels).map(([k,v])=>`${k}=${v}`).join(',')}` : name;
  counters[key] = (counters[key] || 0) + 1;
}

export function observeDuration(name: string, ms: number, labels?: Labels) {
  // Placeholder: integrate with real metrics later
  incCounter(`${name}_count`, labels);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ level: 'debug', metric: name, durationMs: ms, ...labels }));
}

export function getCountersSnapshot() {
  return { ...counters };
}
