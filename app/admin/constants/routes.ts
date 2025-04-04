type TRoutes = {
  ADMIN: string;
  ADMIN_LOGIN: string;
  BIENVENIDA: string;
  DASHBOARD: string;
  CATEGORY: string;
  ADD_CATEGORY: string;
  EDIT_CATEGORY: string;
  PRODUCT: string;
  ADD_PRODUCT: string;
  EDIT_PRODUCT: string;
  TAG: string;
  EDIT_TAG: string;
  MEDIA: string;
  CUSTOMER: string;
  ADD_CUSTOMER: string;
  EDIT_CUSTOMER: string;
  STAFF: string;
  ADD_STAFF: string;
  LIST_STAFF: string;
  EDIT_STAFF: string;
  ROLES_STAFF: string;
  EDIT_ROLES: string;
  CURRENCY: string;
  COUNTRY: string;
  EDIT_COUNTRY: string;
  ZONES: string;
  EDIT_ZONES: string;
  SHIPPING: string;
  ADD_SHIPPING: string;
  EDIT_SHIPPING: string;
};

const admin = "/admin";

const adminLogin = admin + "/login";

const bienvenida = admin + "/bienvenida";

const category = admin + "/categorias";
const addCategory = category + "/agregar";
const editCategory = category + "/editar";

const dashboard = admin + "/dashboard";

const tag = admin + "/etiquetas";
const editTag = tag + "/editar";

const media = admin + "/media";

const product = admin + "/productos";
const addProduct = product + "/agregar";
const editProduct = product + "/editar";

const customer = admin + "/clientes";
const addCustomer = customer + "/agregar";
const editCustomer = customer;

const setting = admin + "/settings";

const staff = setting + "/staff";
const listStaff = staff;
const editStaff = staff;
const addStaff = staff + "/agregar";
const rolesStaff = setting + "/roles";
const editRoles = rolesStaff;

const currencies = setting + "/monedas";

const countries = setting + "/paises";
const editCountry = setting + "/paises";
const zones = setting + "/zonas";
const editZones = setting + "/zonas";

const shipping = setting + "/envios";
const addShipping = shipping + "/agregar";
const editShipping = shipping;

export const ROUTES: TRoutes = {
  ADMIN: admin,
  ADMIN_LOGIN: adminLogin,
  BIENVENIDA: bienvenida,
  CATEGORY: category,
  ADD_CATEGORY: addCategory,
  EDIT_CATEGORY: editCategory,
  DASHBOARD: dashboard,
  PRODUCT: product,
  ADD_PRODUCT: addProduct,
  EDIT_PRODUCT: editProduct,
  TAG: tag,
  EDIT_TAG: editTag,
  MEDIA: media,
  CUSTOMER: customer,
  ADD_CUSTOMER: addCustomer,
  EDIT_CUSTOMER: editCustomer,
  STAFF: staff,
  LIST_STAFF: listStaff,
  ADD_STAFF: addStaff,
  EDIT_STAFF: editStaff,
  ROLES_STAFF: rolesStaff,
  EDIT_ROLES: editRoles,
  CURRENCY: currencies,
  COUNTRY: countries,
  EDIT_COUNTRY: editCountry,
  ZONES: zones,
  EDIT_ZONES: editZones,
  SHIPPING: shipping,
  ADD_SHIPPING: addShipping,
  EDIT_SHIPPING: editShipping,
};
