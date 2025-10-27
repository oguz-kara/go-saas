// test/company.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { CreateCompanyInput } from 'src/modules/company/api/graphql/dto/create-company.input'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { AppModule } from 'src/app.module'
import { registerNewTenantMutationGql } from 'src/modules/auth/gql/register-new-tenant.mutation-gql'
import { getCompanyQuery } from '../gql/get-company.query-gql'
import { createCompanyMutation } from '../gql/create-company.mutation-gql'
import { updateMutation } from '../gql/update-company.mutation-gql'
import { deleteCompanyMutation } from '../gql/delete-company.mutation-gql'
import { getCompaniesWithNotesQuery } from '../gql/get-companies-with-notes.query-gql'
import { AuthenticationPayloadObject } from 'src/modules/auth/api/graphql/dto/authetication-payload.object-type'

describe('CompanyResolver (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  const GQL_ENDPOINT = '/admin-api'

  // --- Test Setup for Authentication and Multi-Tenancy ---
  // Why: We need to hold the state for two separate, authenticated users (tenants)
  // to prove that data is properly isolated between them.
  let tenantA_token: string
  let tenantA_channelToken: string
  let tenantB_token: string
  let tenantA: AuthenticationPayloadObject

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
    prisma = moduleFixture.get<PrismaService>(PrismaService)
  })

  afterAll(async () => {
    await app.close()
  })

  // Why: Before each test, we wipe the database and create two fresh tenants.
  // This gives us clean auth tokens for each test and ensures total isolation.
  beforeEach(async () => {
    await prisma.companyNote.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
    await prisma.channel.deleteMany()

    // Helper function to register a tenant and get its tokens
    const registerTenant = async (email: string, tenantName: string) => {
      const input = {
        email,
        password: 'Password123!',
        userName: 'Admin',
        tenantName,
      }
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({ query: registerNewTenantMutationGql, variables: { input } })

      return response.body.data.registerNewTenant
    }

    tenantA = await registerTenant('admin-a@e2e.com', 'Tenant A')
    tenantA_token = tenantA.token

    const userWithChannelToken = await prisma.user.findFirst({
      where: {
        id: tenantA.user.id,
      },
    })

    tenantA_channelToken = userWithChannelToken?.channelToken || ''

    const tenantB = await registerTenant('admin-b@e2e.com', 'Tenant B')
    tenantB_token = tenantB.token
  })

  // --- Testing createCompany and getCompanyById ---
  describe('createCompany and getCompanyById', () => {
    it('should allow an authenticated user to create and retrieve a company', async () => {
      // ARRANGE
      const input: CreateCompanyInput = {
        name: 'Tenant A Corp',
        website: 'https://tenant-a.com',
      }

      // ACT 1: Create the company
      const createResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: createCompanyMutation, variables: { input } })

      // ASSERT 1
      const createdCompany = createResponse.body.data.createCompany
      expect(createdCompany.name).toBe('Tenant A Corp')
      const companyId = createdCompany.id

      // ACT 2: Retrieve the same company
      const getResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: getCompanyQuery, variables: { id: companyId } })

      // ASSERT 2
      const fetchedCompany = getResponse.body.data.company
      expect(fetchedCompany.id).toBe(companyId)
      expect(fetchedCompany.channelToken).toBe(tenantA_channelToken)
    })

    it('should NOT allow a user from another tenant to retrieve the company', async () => {
      // Why: This is our critical multi-tenancy security test. We prove that even
      // if a user from Tenant B knows the ID of a company in Tenant A, the service
      // layer correctly prevents them from accessing it.

      // ARRANGE: Create a company as Tenant A
      const createResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({
          query: createCompanyMutation,
          variables: { input: { name: 'Private Corp' } },
        })
      const companyId = createResponse.body.data.createCompany.id

      // ACT: Try to fetch it as Tenant B
      const getResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantB_token}`) // Using Tenant B's token
        .send({ query: getCompanyQuery, variables: { id: companyId } })

      // ASSERT
      // The query succeeds but returns null because the record was not found for this tenant.
      expect(getResponse.body.data.company).toBeNull()
    })
  })

  // --- Testing updateCompany and deleteCompany ---
  describe('updateCompany and deleteCompany', () => {
    let companyId: string

    beforeEach(async () => {
      // ARRANGE: Create a company to modify in these tests
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({
          query: createCompanyMutation,
          variables: { input: { name: 'Updatable Inc.' } },
        })
      companyId = response.body.data.createCompany.id
    })

    it('should allow a user to update their own company', async () => {
      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({
          query: updateMutation,
          variables: { id: companyId, input: { name: 'Name Is Updated' } },
        })

      // ASSERT
      expect(response.body.data.updateCompany.name).toBe('Name Is Updated')
    })

    it('should allow a user to soft delete their own company', async () => {
      // ACT

      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: deleteCompanyMutation, variables: { id: companyId } })

      // ASSERT
      expect(response.body.data.deleteCompany.deletedAt).not.toBeNull()

      // Verify it's gone from standard queries
      const getResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: getCompanyQuery, variables: { id: companyId } })

      expect(getResponse.body.data.company).toBeNull()
    })
  })

  // --- Testing @ResolveField('notes') ---
  describe('getCompanies with nested notes resolver', () => {
    it('should retrieve companies and their associated notes', async () => {
      // ARRANGE
      // Create a company
      const createCompanyResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({
          query: createCompanyMutation,
          variables: { input: { name: 'Company With Notes' } },
        })
      const companyId = createCompanyResponse.body.data.createCompany.id

      // Directly use Prisma to add notes (simpler than making another mutation for the test)
      await prisma.companyNote.createMany({
        data: [
          {
            content: 'Note 1',
            companyId,
            channelToken: tenantA_channelToken,
            userId: tenantA.user.id,
          },
          {
            content: 'Note 2',
            companyId,
            channelToken: tenantA_channelToken,
            userId: tenantA.user.id,
          },
        ],
      })

      // ACT
      // Why: This query tests the @ResolveField. It asks for companies, and for each
      // company, it asks for the `notes` field. This triggers the `getNotesForCompany`
      // method on the `CompanyResolver`.

      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: getCompaniesWithNotesQuery })

      // ASSERT
      const companyData = response.body.data.companies.items[0]
      expect(companyData.name).toBe('Company With Notes')
      expect(companyData.notes.totalCount).toBe(2)
      expect(companyData.notes.items.length).toBe(2)
      expect(companyData.notes.items[0].content).toBe('Note 1')
      expect(companyData.notes.items[1].content).toBe('Note 2')
    })
  })
})
