import { createContext, useMemo } from 'react';

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

export function useTokensContext() {
    const { tokens } = useTokenDefinitons();

    const getOne = (identifier: string): TokenDefinition | undefined => {
        if (identifier === 'EGLD') return {
            name: 'EGLD',
            identifier: 'EGLD',
            decimals: 18,
        } as TokenDefinition;
        return tokens.find(t => t.identifier === identifier);
    };

    const value = useMemo(() => ({ all: tokens, get: getOne }), [tokens]);

    return value;
}
