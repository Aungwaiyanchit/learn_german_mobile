import { useEffect, useState } from "react";

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useFetch = <T>(fn: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [status, setStatus] = useState<Status>('idle');
    const [errorMessage, setErrorMessage] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setStatus('loading');
            setErrorMessage(null);
            const result = await fn();
            setData(result)
            setStatus('success');
        } catch (error) {
            console.log(error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error : new Error('An error occurred'));
        }
    }

    const reset = () => {
        setData(null);
        setStatus('idle');
        setErrorMessage(null);
    }

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [])

    return { data, status, error: errorMessage, refetch: fetchData, reset }
}