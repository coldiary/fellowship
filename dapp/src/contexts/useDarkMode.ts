import { useEffect, useState } from "react"
import nightwind from "nightwind/helper"

export const useDarkMode = () => {
    const initialValue = (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
    const [darkMode, setDarkMode] = useState(initialValue);

    useEffect(() => {
        nightwind.enable(darkMode);
    }, [darkMode]);

    const toggleDarkMode = (value?: boolean) => {
        const nextValue = value === undefined ? !darkMode : value;
        localStorage.theme = nextValue ? 'dark' : 'light';
        setDarkMode(nextValue);
    }

    return [darkMode, toggleDarkMode] as const;
}
