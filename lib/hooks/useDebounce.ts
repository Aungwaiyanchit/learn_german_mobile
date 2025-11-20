import { useEffect, useState } from "react";

/**
 * useDebounce
 * Delays updating the value until after the specified delay
 *
 * @param value - The input value to debounce
 * @param delay - The debounce delay in ms (default: 500ms)
 * @returns debouncedValue - The debounced output
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup if value or delay changes
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}