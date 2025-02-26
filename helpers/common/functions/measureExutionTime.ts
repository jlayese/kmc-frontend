export async function measureExecutionTime<T>(fn: () => Promise<T>, label: string): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    return result;
  } finally {
    const end = performance.now();
    console.log(`[Execution Time] ${label}: ${(end - start).toFixed(2)} ms`);
  }
}
