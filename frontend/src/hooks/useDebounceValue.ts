import { useEffect, useState } from "react";

export const useDebounceValue = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState<string>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
};
