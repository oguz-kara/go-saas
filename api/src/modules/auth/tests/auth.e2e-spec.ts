// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'
import { PrismaService } from 'src/common/services/prisma/prisma.service'
import { AppModule } from 'src/app.module'

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

    // Why: It's crucial that our E2E tests use the same validation rules as our
    // real application. We add the global ValidationPipe here to ensure that.
    app.useGlobalPipes(new ValidationPipe())

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
      const registerMutation = `
        mutation RegisterNewTenant($input: RegisterNewTenantInput!) {
          registerNewTenant(registerNewTenantInput: $input) {
            token
            user {
              id
              email
              name
            }
          }
        }
      `

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
          query: registerMutation,
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
})
