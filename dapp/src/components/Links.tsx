import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

const CustomNavLink: FC<NavLinkProps> = ({ to, children }) => (
    <NavLink to={to}
        className="text-hint hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
        activeClassName="!text-primary">{children}</NavLink>
);

export const Links = () => (
    <div className="hidden md:block">
        <div className="ml-10 flex items-baseline space-x-4">
            <CustomNavLink to="/fund">Fund</CustomNavLink>
            <CustomNavLink to="/kickstart">Kickstart</CustomNavLink>
            <CustomNavLink to="/tip">Tip</CustomNavLink>
            <CustomNavLink to="/barter">Barter</CustomNavLink>
        </div>
    </div>
);
