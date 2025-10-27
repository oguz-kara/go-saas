// test/company-note.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { AppModule } from 'src/app.module'
import { AddCompanyNoteInput } from '../api/graphql/dto/add-company-note.input'
import { UpdateCompanyNoteInput } from '../api/graphql/dto/update-company-note.input'
import { registerNewTenantMutationGql } from 'src/modules/auth/gql/register-new-tenant.mutation-gql'
import { createCompanyMutation } from '../gql/create-company.mutation-gql'
import { addNoteMutation } from '../gql/add-note-to-company.mutation-gql'
import { updateNoteMutation } from '../gql/update-note.mutation-gql'
import { deleteNoteMutation } from '../gql/delete-company-note.mutation-gql'

describe('CompanyNoteResolver (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  const GQL_ENDPOINT = '/admin-api'

  // --- Test Setup for Authentication and Multi-Tenancy ---
  let tenantA_token: string
  let tenantB_token: string
  let companyInTenantA_id: string
  let companyInTenantB_id: string

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

  beforeEach(async () => {
    await prisma.companyNote.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
    await prisma.channel.deleteMany()

    // Helper to register a tenant and create a company for them
    const setupTenant = async (
      email: string,
      tenantName: string,
      companyName: string,
    ) => {
      // Register tenant to get token

      const registerInput = {
        email,
        password: 'Password123!',
        userName: 'Admin',
        tenantName,
      }
      const registerResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .send({
          query: registerNewTenantMutationGql,
          variables: { input: registerInput },
        })
      const token = registerResponse.body.data.registerNewTenant.token

      // Create a company for this tenant

      const createCompanyResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: createCompanyMutation,
          variables: { input: { name: companyName } },
        })
      const companyId = createCompanyResponse.body.data.createCompany.id

      return { token, companyId }
    }

    const tenantA = await setupTenant(
      'note-admin-a@e2e.com',
      'Note Tenant A',
      'Company A',
    )
    tenantA_token = tenantA.token
    companyInTenantA_id = tenantA.companyId

    const tenantB = await setupTenant(
      'note-admin-b@e2e.com',
      'Note Tenant B',
      'Company B',
    )
    tenantB_token = tenantB.token
    companyInTenantB_id = tenantB.companyId
  })

  // --- Testing `addNoteToCompany` ---
  describe('Mutation: addNoteToCompany', () => {
    it('should allow an authenticated user to add a note to their own company', async () => {
      // ARRANGE
      const input: AddCompanyNoteInput = { content: 'This is a valid note.' }

      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({
          query: addNoteMutation,
          variables: { companyId: companyInTenantA_id, input },
        })

      // ASSERT
      expect(response.status).toBe(200)
      const createdNote = response.body.data.addNoteToCompany
      expect(createdNote.content).toBe(input.content)
      expect(createdNote.companyId).toBe(companyInTenantA_id)

      const noteInDb = await prisma.companyNote.findUnique({
        where: { id: createdNote.id },
      })
      expect(noteInDb).toBeDefined()
    })

    it('should NOT allow a user to add a note to a company in another tenant', async () => {
      // Why: This is a critical multi-tenancy test. We prove that the service layer
      // correctly checks if the target company belongs to the user's channel before
      // allowing the write operation.

      // ARRANGE
      const input: AddCompanyNoteInput = { content: 'This note should fail.' }

      // ACT: User A tries to add a note to Company B
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`) // Authenticated as Tenant A
        .send({
          query: addNoteMutation,
          variables: { companyId: companyInTenantB_id, input }, // Targeting Tenant B's company
        })

      // ASSERT
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      // The service should throw `CompanyNotFoundError` because the company is not found *for this tenant*.
      expect(response.body.errors[0].message).toContain(
        `Company not found with ID: ${companyInTenantB_id}`,
      )
    })
  })

  // --- Testing `updateCompanyNote` and `deleteCompanyNote` ---
  describe('update and delete a CompanyNote', () => {
    let noteId: string

    // ARRANGE: Create a note as Tenant A before each test in this block
    beforeEach(async () => {
      const addNoteResponse = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({
          query: addNoteMutation,
          variables: {
            companyId: companyInTenantA_id,
            input: { content: 'Original note content' },
          },
        })
      noteId = addNoteResponse.body.data.addNoteToCompany.id
    })

    it('should allow a user to update their own note', async () => {
      // ACT

      const input: UpdateCompanyNoteInput = {
        content: 'This content has been updated.',
      }
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: updateNoteMutation, variables: { noteId, input } })

      // ASSERT
      expect(response.body.data.updateCompanyNote.content).toBe(input.content)
    })

    it('should NOT allow a user to delete a note from another tenant', async () => {
      // Why: Another critical security test. Can User B delete User A's note?
      // The service logic must scope the delete operation to the user's channel.

      // ACT
      const response = await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantB_token}`) // Authenticated as Tenant B
        .send({ query: deleteNoteMutation, variables: { noteId } }) // Targeting Tenant A's note

      // ASSERT
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      // The service should not find the note within Tenant B's scope.
      expect(response.body.errors[0].message).toContain(
        `Note not found with ID: ${noteId}`,
      )
    })

    it('should allow a user to hard delete their own note', async () => {
      // ACT
      const deleteNoteMutation = `...` // Same as above
      await request(app.getHttpServer())
        .post(GQL_ENDPOINT)
        .set('Authorization', `Bearer ${tenantA_token}`)
        .send({ query: deleteNoteMutation, variables: { noteId } })

      // ASSERT: Verify it's gone from the database
      const noteInDb = await prisma.companyNote.findUnique({
        where: { id: noteId },
      })
      expect(noteInDb).toBeNull()
    })
  })
})
