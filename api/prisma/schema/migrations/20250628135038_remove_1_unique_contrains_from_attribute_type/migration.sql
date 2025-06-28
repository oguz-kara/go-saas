-- CreateEnum
CREATE TYPE "AttributeTypeKind" AS ENUM ('TEXT', 'SELECT', 'MULTI_SELECT', 'HIERARCHICAL');

-- CreateEnum
CREATE TYPE "AttributeDataType" AS ENUM ('TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'CURRENCY', 'USER');

-- CreateEnum
CREATE TYPE "AttributableType" AS ENUM ('COMPANY');

-- CreateEnum
CREATE TYPE "CompanyNoteType" AS ENUM ('GENERAL', 'MEETING', 'CALL', 'FOLLOW_UP');

-- CreateTable
CREATE TABLE "AttributeGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "order" INTEGER,
    "isSystemDefined" BOOLEAN NOT NULL DEFAULT false,
    "channelToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttributeGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "kind" "AttributeTypeKind" NOT NULL,
    "dataType" "AttributeDataType" NOT NULL,
    "isSystemDefined" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "config" JSONB,
    "channelToken" TEXT NOT NULL,
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttributeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB,
    "attributeTypeId" TEXT NOT NULL,
    "channelToken" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeTypeToEntityType" (
    "attributeTypeId" TEXT NOT NULL,
    "entityType" "AttributableType" NOT NULL,

    CONSTRAINT "AttributeTypeToEntityType_pkey" PRIMARY KEY ("attributeTypeId","entityType")
);

-- CreateTable
CREATE TABLE "AttributeAssignment" (
    "id" TEXT NOT NULL,
    "attributeValueId" TEXT NOT NULL,
    "attributableId" TEXT NOT NULL,
    "attributableType" "AttributableType" NOT NULL,
    "channelToken" TEXT NOT NULL,
    "assignedById" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT,

    CONSTRAINT "AttributeAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "channelToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "taxId" TEXT,
    "description" TEXT,
    "address" JSONB,
    "phoneNumber" TEXT,
    "email" TEXT,
    "linkedinUrl" TEXT,
    "socialProfiles" JSONB,
    "channelToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "CompanyNoteType",
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeGroup_name_channelToken_key" ON "AttributeGroup"("name", "channelToken");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeGroup_code_channelToken_key" ON "AttributeGroup"("code", "channelToken");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeType_name_channelToken_key" ON "AttributeType"("name", "channelToken");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeType_code_channelToken_key" ON "AttributeType"("code", "channelToken");

-- CreateIndex
CREATE INDEX "AttributeValue_attributeTypeId_idx" ON "AttributeValue"("attributeTypeId");

-- CreateIndex
CREATE INDEX "AttributeAssignment_attributableId_attributableType_idx" ON "AttributeAssignment"("attributableId", "attributableType");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeAssignment_attributeValueId_attributableId_attribu_key" ON "AttributeAssignment"("attributeValueId", "attributableId", "attributableType");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_token_key" ON "Channel"("token");

-- CreateIndex
CREATE INDEX "CompanyNote_companyId_idx" ON "CompanyNote"("companyId");

-- CreateIndex
CREATE INDEX "CompanyNote_userId_idx" ON "CompanyNote"("userId");

-- AddForeignKey
ALTER TABLE "AttributeGroup" ADD CONSTRAINT "AttributeGroup_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeType" ADD CONSTRAINT "AttributeType_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeType" ADD CONSTRAINT "AttributeType_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "AttributeGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeTypeId_fkey" FOREIGN KEY ("attributeTypeId") REFERENCES "AttributeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AttributeValue"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeTypeToEntityType" ADD CONSTRAINT "AttributeTypeToEntityType_attributeTypeId_fkey" FOREIGN KEY ("attributeTypeId") REFERENCES "AttributeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeAssignment" ADD CONSTRAINT "AttributeAssignment_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeAssignment" ADD CONSTRAINT "AttributeAssignment_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeAssignment" ADD CONSTRAINT "AttributeAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeAssignment" ADD CONSTRAINT "AttributeAssignment_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyNote" ADD CONSTRAINT "CompanyNote_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyNote" ADD CONSTRAINT "CompanyNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyNote" ADD CONSTRAINT "CompanyNote_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;
