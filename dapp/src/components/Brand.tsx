import { FC } from 'react';
import { MaiarLogo } from './Icons';

export const Brand: FC<{ name: string }> = ({ name }) => (
    <div className="flex-shrink-0 flex flex-row gap-4 dark:text-white">
        <MaiarLogo />
        <div className="flex-auto flex items-center justify-center text-xl text-hint border-l pl-4 text-gray-500 dark:text-gray-300">
            {name}
        </div>
    </div>
);
