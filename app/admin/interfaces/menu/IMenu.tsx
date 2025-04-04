import { BiCollection } from "react-icons/bi";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { IoFlagOutline } from "react-icons/io5";
import {
  LuShip,
  LuTags,
  LuFiles,
  LuFileImage,
  LuFile,
  LuUser,
} from "react-icons/lu";
import {
  MdOutlineCurrencyExchange,
  MdOutlineSpaceDashboard,
  MdPayment,
} from "react-icons/md";
import { RiStore2Line, RiGlobalLine, RiPaletteLine } from "react-icons/ri";

export interface IMenu {
  path: string;
  name: string;
  icon: JSX.Element;
}

export const menu: IMenu[] = [
  {
    path: "/admin/dashboard",
    name: "dashboard",
    icon: (
      <MdOutlineSpaceDashboard width={12} height={12} className="color-icon" />
    ),
  },
  {
    path: "/admin/pages",
    name: "páginas",
    icon: <LuFiles width={12} height={12} className="color-icon" />,
  },
  {
    path: "/admin/collections",
    name: "colecciones",
    icon: <BiCollection width={12} height={12} className="color-icon" />,
  },
  {
    path: "/admin/single-post",
    name: "tipos únicos",
    icon: <LuFile width={12} height={12} className="color-icon" />,
  },
  {
    path: "/admin/media",
    name: "media",
    icon: <LuFileImage width={12} height={12} className="color-icon" />,
  },
  {
    path: "/admin/suscribers",
    name: "suscriptores",
    icon: <LuUser width={11} height={11} className="color-icon" />,
  },
  {
    path: "/admin/tema",
    name: "tema",
    icon: <RiPaletteLine width={11} height={11} className="color-icon" />,
  },
];
export const menuSetting = [
  {
    path: "/admin/settings/tienda",
    name: "Mi Tienda",
    icon: <RiStore2Line width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/monedas",
    name: "monedas",
    icon: (
      <MdOutlineCurrencyExchange
        width={15}
        height={15}
        className="text-white"
      />
    ),
  },
  {
    path: "/admin/settings/staff",
    name: "administradores",
    icon: <LuUser width={16} height={16} className="text-white" />,
  },
  {
    path: "/admin/settings/roles",
    name: "roles",
    icon: <LuUser width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/envios",
    name: "métodos de envío",
    icon: <LuShip width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/payments",
    name: "pagos",
    icon: <MdPayment width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/tax-category",
    name: "Tax categorías",
    icon: <LuTags width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/tax-rates",
    name: "Tax Rates",
    icon: <HiOutlineReceiptTax width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/paises",
    name: "Países",
    icon: <IoFlagOutline width={15} height={15} className="text-white" />,
  },
  {
    path: "/admin/settings/zonas",
    name: "Zonas",
    icon: <RiGlobalLine width={15} height={15} className="text-white" />,
  },
];
