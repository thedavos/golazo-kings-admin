export interface TryCatchResult<T> {
  data: T | null;
  error: string | null;
}

export interface TryCatchVoidResult {
  data: void | null;
  error: string | null;
}

export async function tryCatch<T>(
  promise: () => Promise<T>,
  defaultValueOnError: T | null = null,
): Promise<TryCatchResult<T>> {
  try {
    const data = await promise();
    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { data: defaultValueOnError, error: errorMessage };
  }
}

export async function tryCatchVoid(promise: () => Promise<void>): Promise<TryCatchVoidResult> {
  try {
    await promise();
    return { data: undefined, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error caught by tryCatchWrapper (void):', errorMessage);
    return { data: null, error: errorMessage };
  }
}
