export type Routes = Record<string, string>

export const routes: Routes = {
  home: '/',
  companyDetails: '/companies/:id/details',
  companies: '/companies',
  channels: '/channels',
  attributes: '/settings/attributes',
}
