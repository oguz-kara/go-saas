/**
 * Type-safe route builder utilities
 */

type RouteMetadata = {
  label: string
  labelKey: string
}

type StaticRouteFn = (() => string) & RouteMetadata & { path: string }

type DynamicRouteFn<T extends (...args: any[]) => string> = T &
  RouteMetadata & { path?: string }

/**
 * Creates a static route function with metadata
 */
const createRoute = (
  path: string,
  label: string,
  labelKey: string,
): StaticRouteFn => {
  const routeFn = () => path
  routeFn.path = path
  routeFn.label = label
  routeFn.labelKey = labelKey
  return routeFn as StaticRouteFn
}

/**
 * Creates a dynamic route function with metadata
 */
const createDynamicRoute = <T extends (...args: any[]) => string>(
  pathBuilder: T,
  label: string,
  labelKey: string,
): DynamicRouteFn<T> => {
  const routeFn = pathBuilder as DynamicRouteFn<T>
  routeFn.label = label
  routeFn.labelKey = labelKey
  return routeFn
}

/**
 * Type-safe route definitions
 * 
 * Usage:
 * - Static routes: routes.dashboard() → '/dashboard'
 * - Dynamic routes: routes.leads.detail('123') → '/leads/123'
 * - Metadata access: routes.dashboard.label, routes.dashboard.labelKey
 */
export const routes = {
  dashboard: createRoute('/dashboard', 'Dashboard', 'breadcrumb.dashboard'),

  leads: {
    list: createRoute('/leads', 'Leads', 'breadcrumb.leads'),
    new: createRoute('/leads/new', 'New Lead', 'breadcrumb.newLead'),
    active: createRoute('/leads/active', 'Active Leads', 'breadcrumb.activeLeads'),
    archive: createRoute('/leads/archive', 'Archived Leads', 'breadcrumb.archivedLeads'),
    detail: createDynamicRoute(
      (id: string) => `/leads/${id}`,
      'Lead Detail',
      'breadcrumb.leadDetail',
    ),
    edit: createDynamicRoute(
      (id: string) => `/leads/${id}/edit`,
      'Edit Lead',
      'breadcrumb.editLead',
    ),
  },

  companies: {
    list: createRoute('/companies', 'Companies', 'breadcrumb.companies'),
    detail: createDynamicRoute(
      (id: string) => `/companies/${id}/details`,
      'Company Detail',
      'breadcrumb.companyDetail',
    ),
  },

  settings: {
    root: createRoute('/settings', 'Settings', 'breadcrumb.settings'),
    account: createRoute(
      '/settings/account',
      'Account',
      'breadcrumb.account',
    ),
    general: createRoute(
      '/settings/general',
      'General',
      'breadcrumb.general',
    ),
    team: createRoute('/settings/team', 'Team', 'breadcrumb.team'),
    notifications: createRoute(
      '/settings/notifications',
      'Notifications',
      'breadcrumb.notifications',
    ),
    integrations: createRoute(
      '/settings/integrations',
      'Integrations',
      'breadcrumb.integrations',
    ),
    attributes: createRoute(
      '/settings/attributes',
      'Attributes',
      'breadcrumb.attributes',
    ),
    apiKeys: createRoute(
      '/settings/api-keys',
      'API Keys',
      'breadcrumb.apiKeys',
    ),
  },

  channels: createRoute('/channels', 'Channels', 'breadcrumb.channels'),

  support: createRoute('/support', 'Support', 'breadcrumb.support'),

  notifications: createRoute(
    '/notifications',
    'Notifications',
    'breadcrumb.notifications',
  ),

  home: createRoute('/', 'Home', 'breadcrumb.home'),

  login: createRoute('/login', 'Login', 'breadcrumb.login'),

  sessionExpired: createRoute(
    '/session-expired',
    'Session Expired',
    'breadcrumb.sessionExpired',
  ),
} as const

/**
 * Legacy compatibility exports (for gradual migration)
 * @deprecated Use the new routes object directly with function calls
 * 
 * Example: routes.companies.detail(id) instead of routes.companyDetails.replace(':id', id)
 */
export const legacyRoutes = {
  home: routes.home.path,
  dashboard: routes.dashboard.path,
  leads: routes.leads.list.path,
  newLead: routes.leads.new.path,
  companies: routes.companies.list.path,
  companyDetails: '/companies/:id/details', // Use routes.companies.detail(id) instead
  channels: routes.channels.path,
  attributes: routes.settings.attributes.path,
  settings: routes.settings.root.path,
  general: routes.settings.general.path,
  team: routes.settings.team.path,
  notifications: routes.settings.notifications.path,
}
