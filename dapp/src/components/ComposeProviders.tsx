import React, { FC, ComponentType, Fragment } from 'react';

type Provider = ComponentType | [ComponentType, { [key: string]: any }];

interface Props {
    providers: Provider[];
}

export const ComposeProviders: FC<Props> = ({ providers, children }) => (
    <Fragment>
        {providers.reverse().reduce((acc, curr) => {
            const [Provider, props] = Array.isArray(curr) ? [curr[0], curr[1]] : [curr, {}];
            return <Provider {...props}>{acc}</Provider>;
        }, children)}
    </Fragment>
);
