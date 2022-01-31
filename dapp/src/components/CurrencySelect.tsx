import React, { FC, Fragment, useContext, useMemo } from 'react';
import Select, { components, OptionProps, SingleValueProps, StylesConfig } from 'react-select';

import egldSymbol from 'assets/img/elrond-symbol.svg';
import { TokensContext } from 'contexts/Tokens';

export interface CurrencySelectProps {
    defaultCurrency: string;
    onChange: (currency: string) => void;
}

export interface Option {
    value: string;
    label: string;
    icon: string;
}

const Option = (props: OptionProps) => {
    return (
        <Fragment>
            <components.Option {...props}>
                <div className="flex flex-row gap-4 items-center justify-start">
                    <img className='w-4 h-4 object-contain' src={(props.data as any).icon} alt="" />
                    {props.children}
                </div>
            </components.Option>
        </Fragment>
    );
};

const SingleValue = (props: SingleValueProps) => {
    return (
        <Fragment>
            <components.SingleValue {...props}>
                <div className="flex flex-row gap-4 items-center justify-start">
                    <img className='w-4 h-4 object-contain' src={(props.data as any).icon} alt="" />
                    {props.children}
                </div>
            </components.SingleValue>
        </Fragment>
    );
};

const styles: StylesConfig = {
    option: (provided, state) => ({
        ...provided, backgroundColor: state.isSelected ? '#9091b655' : '#fff',
    })
};

export const CurrencySelect: FC<CurrencySelectProps> = ({ defaultCurrency, onChange }) => {
    const { all } = useContext(TokensContext);

    const options = useMemo((): Option[] => {
        const filtered = all.filter(t => t.assets?.pngUrl);
        const egld: Option = {
            value: 'EGLD',
            label: 'EGLD',
            icon: egldSymbol,
        };
        const mapped: Option[] = filtered.map(t => ({
            value: t.identifier,
            label: t.name,
            icon: t.assets?.svgUrl,
        }));
        return [egld, ...mapped];
    }, [all]);

    const onSelect = (selected: any) => onChange(selected.value);

    return (
        <Select defaultValue={defaultCurrency} options={options} components={{ Option, SingleValue }} styles={styles} onChange={onSelect}/>
    );
};
