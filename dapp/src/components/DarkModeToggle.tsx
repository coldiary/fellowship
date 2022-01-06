import React from 'react';
import { Moon, Sun } from './Icons';
import { useDarkMode } from '../contexts/useDarkMode';

export const DarkModeToggle = () => {
    const [darkMode, toggleDarkMode] = useDarkMode();

    return (
        <>
            <button className="p-2 rounded-md text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white" onClick={() => toggleDarkMode()}>
                {darkMode ? <Moon /> : <Sun />}
            </button>
        </>
    );
};
