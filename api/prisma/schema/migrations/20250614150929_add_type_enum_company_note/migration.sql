/*
  Warnings:

  - You are about to drop the `AttributeType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyNote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AttributeValueToCompany` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyNoteType" AS ENUM ('GENERAL', 'MEETING', 'CALL', 'FOLLOW_UP');

-- DropForeignKey
ALTER TABLE "public"."AttributeType" DROP CONSTRAINT "AttributeType_channelToken_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttributeValue" DROP CONSTRAINT "AttributeValue_attributeTypeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AttributeValue" DROP CONSTRAINT "AttributeValue_channelToken_fkey";

-- DropForeignKey
ALTER TABLE "public"."Company" DROP CONSTRAINT "Company_channelToken_fkey";

-- DropForeignKey
ALTER TABLE "public"."CompanyNote" DROP CONSTRAINT "CompanyNote_channelToken_fkey";

-- DropForeignKey
ALTER TABLE "public"."CompanyNote" DROP CONSTRAINT "CompanyNote_companyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CompanyNote" DROP CONSTRAINT "CompanyNote_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_channelToken_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AttributeValueToCompany" DROP CONSTRAINT "_AttributeValueToCompany_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AttributeValueToCompany" DROP CONSTRAINT "_AttributeValueToCompany_B_fkey";

-- DropTable
DROP TABLE "public"."AttributeType";

-- DropTable
DROP TABLE "public"."AttributeValue";

-- DropTable
DROP TABLE "public"."Channel";

-- DropTable
DROP TABLE "public"."Company";

-- DropTable
DROP TABLE "public"."CompanyNote";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."_AttributeValueToCompany";

-- CreateTable
CREATE TABLE "AttributeType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channelToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttributeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "attributeTypeId" TEXT NOT NULL,
    "channelToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelToken" TEXT NOT NULL,

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
    "industry" TEXT,
    "linkedinUrl" TEXT,
    "address" JSONB,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channelToken" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyNote" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "CompanyNoteType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelToken" TEXT NOT NULL,

    CONSTRAINT "CompanyNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AttributeValueToCompany" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AttributeValueToCompany_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttributeType_name_channelToken_key" ON "AttributeType"("name", "channelToken");

-- CreateIndex
CREATE INDEX "AttributeValue_attributeTypeId_idx" ON "AttributeValue"("attributeTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_value_attributeTypeId_key" ON "AttributeValue"("value", "attributeTypeId");

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

-- CreateIndex
CREATE INDEX "_AttributeValueToCompany_B_index" ON "_AttributeValueToCompany"("B");

-- AddForeignKey
ALTER TABLE "AttributeType" ADD CONSTRAINT "AttributeType_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_attributeTypeId_fkey" FOREIGN KEY ("attributeTypeId") REFERENCES "AttributeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeValue" ADD CONSTRAINT "AttributeValue_channelToken_fkey" FOREIGN KEY ("channelToken") REFERENCES "Channel"("token") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "_AttributeValueToCompany" ADD CONSTRAINT "_AttributeValueToCompany_A_fkey" FOREIGN KEY ("A") REFERENCES "AttributeValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttributeValueToCompany" ADD CONSTRAINT "_AttributeValueToCompany_B_fkey" FOREIGN KEY ("B") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
