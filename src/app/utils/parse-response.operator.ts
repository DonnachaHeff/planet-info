import { tap } from "rxjs";
import type { MonoTypeOperatorFunction } from "rxjs";
import type { ZodType } from "zod";
import { environment } from "src/environments/environment";

export function parseResponse<T>(schema: ZodType): MonoTypeOperatorFunction<T> {
    return tap({
        next: (value: any) => {
            if (!environment.production) {
                // Throw in development so we're aware of the error
                schema.parse(value);
            } else {
                const parsed = schema.safeParse(value)
                if (!parsed.success) {
                    // Log to service to be informed
                    console.log(parsed.error)
                }
            }
        }
    })
}