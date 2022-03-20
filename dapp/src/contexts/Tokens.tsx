import React, { createContext, FC, useMemo } from 'react';

import EGLDIcon from 'assets/img/elrond-symbol.svg';
import useTokenDefinitons from 'hooks/useTokenDefinitions';
import { TokenDefinition } from 'types/Token';

export interface TokensContextType {
    all: TokenDefinition[];
    get: (identifier: string) => TokenDefinition | undefined;
}

export const TokensContext = createContext<TokensContextType>({
    all: [],
    get: () => undefined,
});

export const TokensContextProvider: FC = ({ children }) => {
    const { tokens } = useTokenDefinitons();

    const getOne = (identifier: string): TokenDefinition | undefined => {
        if (identifier === 'EGLD') return {
            name: 'EGLD',
            identifier: 'EGLD',
            decimals: 18,
            assets: {
                svgUrl: EGLDIcon,
            }
        } as TokenDefinition;
        return tokens.find(t => t.identifier === identifier);
    };

    const value = useMemo(() => ({ all: tokens, get: getOne }), [tokens]);

    return <TokensContext.Provider value={value}>{children}</TokensContext.Provider>;
};
