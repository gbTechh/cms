// Librería de componentes del sitio público. Todo client-safe (sin imports
// de servidor/Prisma) — se pueden usar en cualquier archivo de
// app/frontend/. Para traer datos, ver app/frontend/data/client.server.ts.
export { cn } from "./cn";
export { Text, type TextProps } from "./Text";
export { LinkText, type LinkTextProps } from "./LinkText";
export { Heading, type HeadingProps } from "./Heading";
export { Price, formatPrice, type PriceProps } from "./Price";
export { Badge, type BadgeProps } from "./Badge";
export { Avatar, type AvatarProps } from "./Avatar";
export { Rating, type RatingProps } from "./Rating";
export { Button, ButtonLink, type ButtonProps, type ButtonLinkProps } from "./Button";
export { Card, CardLink, CardArt, type CardProps, type CardLinkProps } from "./Card";
export { Section, SectionHeader, type SectionProps, type SectionHeaderProps } from "./Section";
export { Grid } from "./Grid";
export { Stat, type StatProps } from "./Stat";
export { Specs, Spec, type SpecProps } from "./Specs";
export { Accordion, AccordionItem, type AccordionItemProps } from "./Accordion";
export { Sidebar, SidebarPerson, type SidebarPersonProps } from "./Sidebar";
export { Pagination, type PaginationProps } from "./Pagination";
export { EmptyState } from "./EmptyState";
export { RichText, type RichTextProps } from "./RichText";
export { Nav, type NavProps, type NavLink } from "./Nav";
export { Footer, type FooterProps, type FooterColumn } from "./Footer";
