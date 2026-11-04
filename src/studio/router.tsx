import { forwardRef } from 'react';
import { NavLink, useParams, type NavLinkProps } from 'react-router-dom';
export { useParams };
type Props = Omit<NavLinkProps, 'to' | 'className'> & { to: string; params?: { filmId: string }; activeOptions?: { exact: boolean }; className?: string };
export const Link = forwardRef<HTMLAnchorElement, Props>(function Link({to, params, activeOptions, className, ...props}, ref) {
 return <NavLink {...props} ref={ref} to={params ? to.replace('$filmId',params.filmId) : to} end={activeOptions?.exact} className={({isActive}) => `${className ?? ''}${isActive ? ' text-primary' : ''}`} />;
});
