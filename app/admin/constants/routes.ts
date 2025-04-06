type TRoutes = {
  ADMIN: string;
  ADMIN_LOGIN: string;
  BIENVENIDA: string;
  DASHBOARD: string;
  PAGES: string;
  ADD_PAGES: string;
  EDIT_PAGES: string;
  COLLECTIONS: string;
  ADD_COLLECTIONS: string;
  EDIT_COLLECTIONS: string;
  SINGLE_POST: string;
  ADD_SINGLE_POST: string;
  EDIT_SINGLE_POST: string;
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
  FIELDS: string;
  ADD_FIELDS: string;
  EDIT_FIELDS: string;
  TEMA: string;
  MENU: string;
  TEMPLATES: string;
  STYLES: string;
};

const admin = "/admin";

const adminLogin = admin + "/login";

const bienvenida = admin + "/bienvenida";

const dashboard = admin + "/dashboard";

const tag = admin + "/etiquetas";
const editTag = tag + "/editar";

const media = admin + "/media";

const pages = admin + "/pages";
const addPages = pages + "/add";
const editPages = pages;

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

const fields = admin + "/fields";
const addFields = fields + "/add";
const editFields = fields;

const collections = admin + "/collections";
const addCollections = collections + "/new";
const editCollections = collections;

const singlePost = admin + "/single-post";
const addSinglePost = singlePost + "/add";
const editSinglePost = singlePost;

const tema = admin + "/tema";
const menu = tema + "/menu";
const templates = tema + "/menu";
const styles = tema + "/menu";

export const ROUTES: TRoutes = {
  ADMIN: admin,
  ADMIN_LOGIN: adminLogin,
  BIENVENIDA: bienvenida,

  DASHBOARD: dashboard,

  TAG: tag,
  EDIT_TAG: editTag,
  MEDIA: media,
  PAGES: pages,
  ADD_PAGES: addPages,
  EDIT_PAGES: editPages,
  COLLECTIONS: collections,
  ADD_COLLECTIONS: addCollections,
  EDIT_COLLECTIONS: editCollections,
  SINGLE_POST: singlePost,
  ADD_SINGLE_POST: addSinglePost,
  EDIT_SINGLE_POST: editSinglePost,
  FIELDS: fields,
  ADD_FIELDS: addFields,
  EDIT_FIELDS: editFields,
  CUSTOMER: customer,
  ADD_CUSTOMER: addCustomer,
  EDIT_CUSTOMER: editCustomer,
  STAFF: staff,
  LIST_STAFF: listStaff,
  ADD_STAFF: addStaff,
  EDIT_STAFF: editStaff,
  ROLES_STAFF: rolesStaff,
  EDIT_ROLES: editRoles,
  TEMA: tema,
  MENU: menu,
  TEMPLATES: templates,
  STYLES: styles,
};
