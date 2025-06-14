// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { AppModule } from 'src/app.module'
import { registerNewTenantMutationGql } from '../gql/register-new-tenant.mutation-gql'
import { meQueryGql } from '../gql/me.query-gql'
import { loginMutationGql } from '../gql/login.mutation-gql'
import { logoutMutationGql } from '../gql/logout.mutation-gql'
import { registerUserMutationGql } from '../gql/register-user.mutation-gql'

describe('AuthResolver (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  // --- Setup ---
  // Why: beforeAll is used to set up things once for the entire test file.
  // Since starting a NestJS application is slow, we do it only once.
  beforeAll(async () => {
    // Why: We create a TestingModule that mirrors our actual application by
    // importing the root AppModule. This ensures all modules, resolvers, services, etc., are loaded.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    // Why: We create a full NestJS application instance. This is like running
    // `npm run start:dev`, but in a controlled test environment.
    app = moduleFixture.createNestApplication()

    // Why: This starts the application, listening for requests.
    await app.init()

    // Why: We get a direct handle to the PrismaService so we can set up data
    // in our database for tests and clean it up afterward.
    prisma = moduleFixture.get<PrismaService>(PrismaService)
  })

  // Why: After all tests are done, we close the application to free up resources.
  afterAll(async () => {
    await app.close()
  })

  // Why: We ensure the database is wiped clean before each test to guarantee
  // that tests are isolated and don't influence each other.
  beforeEach(async () => {
    await prisma.companyNote.deleteMany()
    await prisma.company.deleteMany()
    await prisma.user.deleteMany()
    await prisma.channel.deleteMany()
  })

  describe('Mutation: registerNewTenant', () => {
    it('should register a new tenant, user, and channel, and return an auth token', async () => {
      // ARRANGE
      // Why: We define our GraphQL mutation as a string, exactly as a
      // frontend client would.

      const input = {
        email: 'tenant.admin@e2e.com',
        password: 'Password123!',
        userName: 'E2E Admin',
        tenantName: 'E2E Tenant',
      }

      // ACT
      // Why: We use `supertest` to send a POST request to the /graphql endpoint.
      // This simulates a real client request over the network.
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .send({
          query: registerNewTenantMutationGql,
          variables: { input },
        })

      // ASSERT
      // Why: For an E2E test, we first check the HTTP response itself.
      expect(response.status).toBe(200)

      // Why: Then, we check the body of the response to ensure it contains the
      // data we expect, matching the shape of our GraphQL query.
      const responseData = response.body.data.registerNewTenant
      expect(responseData.token).toEqual(expect.any(String))
      expect(responseData.user.email).toBe(input.email)
      expect(responseData.user.name).toBe(input.userName)

      // Why: Finally, we assert the database state to confirm the "side effect"
      // of the mutation. This proves the entire stack worked correctly.
      const userInDb = await prisma.user.findUnique({
        where: { email: input.email },
      })
      const channelInDb = await prisma.channel.findFirst({
        where: { name: input.tenantName },
      })

      expect(userInDb).toBeDefined()
      expect(channelInDb).toBeDefined()
      expect(userInDb?.channelToken).toBe(channelInDb?.token)
    })
  })

  describe('Query: me', () => {
    let authToken: string
    let userEmail: string

    // ARRANGE
    // Why: To test a protected query, we must first have a logged-in user.
    // We can reuse our registerNewTenant logic to create a user and get a token.
    beforeEach(async () => {
      const input = {
        email: 'me.user@e2e.com',
        password: 'Password123!',
        userName: 'Me User',
        tenantName: 'Me Tenant',
      }
      userEmail = input.email
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .send({ query: registerNewTenantMutationGql, variables: { input } })
      authToken = response.body.data.registerNewTenant.token
    })

    it('should return the current user for an authenticated request', async () => {
      // ARRANGE
      const meQuery = meQueryGql

      // ACT
      // Why: This is the key step for testing protected resources. We add the
      // Authorization header to our request, just like a real frontend would.
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ query: meQuery })

      // ASSERT
      expect(response.status).toBe(200)
      expect(response.body.data.me.email).toBe(userEmail)
    })

    it('should return an unauthorized error for an unauthenticated request', async () => {
      // ARRANGE
      const meQuery = meQueryGql

      // ACT
      // Why: We intentionally DO NOT set the Authorization header.
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .send({ query: meQuery })

      // ASSERT
      // Why: This proves our `@ProtectResource()` guard works. We don't get data;
      // instead, we get a specific error message in the 'errors' array of the
      // GraphQL response.
      expect(response.status).toBe(200) // GraphQL often returns 200 even for auth errors
      expect(response.body.data.me).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].message).toContain('Access denied')
    })
  })

  // Add this describe block inside describe('AuthResolver (E2E)', () => { ... })

  describe('Mutation: loginUser', () => {
    const credentials = {
      email: 'login.user@e2e.com',
      password: 'Password123!',
    }

    // ARRANGE
    // Why: To test login, a user must already exist. We run the registration
    // logic once before these tests to create the user in the database.
    beforeEach(async () => {
      const input = {
        ...credentials,
        userName: 'Login User',
        tenantName: 'Login Tenant',
      }
      await request(app.getHttpServer())
        .post('/admin-api')
        .send({ query: registerNewTenantMutationGql, variables: { input } })
    })

    it('should log in an existing user and return a new auth token', async () => {
      // ACT
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .send({
          query: loginMutationGql,
          variables: { input: credentials },
        })

      // ASSERT
      expect(response.status).toBe(200)
      const responseData = response.body.data.loginUser
      expect(responseData.token).toEqual(expect.any(String))
      expect(responseData.user.email).toBe(credentials.email)
    })

    it('should return an error for invalid credentials', async () => {
      // ACT
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .send({
          query: loginMutationGql,
          variables: {
            input: { email: credentials.email, password: 'wrong-password' },
          },
        })

      // ASSERT
      // Why: This tests our error handling flow. The service throws an
      // InvalidCredentialsError, which GraphQL catches and places in the 'errors'
      // part of the response. This test proves that the entire error handling
      // chain is working correctly.
      expect(response.status).toBe(200)
      expect(response.body.data).toBeNull()
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors[0].message).toContain(
        'Invalid email or password.',
      )
    })
  })

  // Add this describe block inside describe('AuthResolver (E2E)', () => { ... })

  describe('Mutation: logoutUser', () => {
    it('should successfully log out an authenticated user', async () => {
      // ARRANGE: First, register and get a token.
      const registerMutation = registerNewTenantMutationGql

      const input = {
        email: 'logout.user@e2e.com',
        password: 'Password123!',
        userName: 'Logout User',
        tenantName: 'Logout Tenant',
      }
      const registerResponse = await request(app.getHttpServer())
        .post('/admin-api')
        .send({ query: registerMutation, variables: { input } })
      const authToken = registerResponse.body.data.registerNewTenant.token

      // ACT

      const logoutResponse = await request(app.getHttpServer())
        .post('/admin-api')
        .set('Authorization', `Bearer ${authToken}`) // Must be authenticated
        .send({ query: logoutMutationGql })

      // ASSERT
      expect(logoutResponse.status).toBe(200)
      expect(logoutResponse.body.data.logoutUser.success).toBe(true)
    })
  })

  // Add this describe block inside describe('AuthResolver (E2E)', () => { ... })

  describe('Mutation: registerUser', () => {
    it('should register a new user to an existing channel', async () => {
      // ARRANGE
      // Why: The `registerUser` mutation requires an existing `channelToken`.
      // For an E2E test, we must create a real channel in the database first
      // to get a valid token. This verifies the foreign key relationship.
      const channel = await prisma.channel.create({
        data: { name: 'Shared Channel', token: 'shared-token-123' },
      })

      const registerMutation = registerUserMutationGql
      const input = {
        email: 'new.employee@e2e.com',
        password: 'Password123!',
        name: 'New Employee',
      }

      // ACT
      const response = await request(app.getHttpServer())
        .post('/admin-api')
        .send({
          query: registerMutation,
          variables: { input, token: channel.token },
        })


      // ASSERT
      expect(response.status).toBe(200)
      const responseData = response.body.data.registerUser
      expect(responseData.token).toBeDefined()
      expect(responseData.user.email).toBe(input.email)

      const userInDb = await prisma.user.findUnique({
        where: { email: input.email },
      })
      expect(userInDb).toBeDefined()
      expect(userInDb?.channelToken).toBe(channel.token)
    })
  })
})
