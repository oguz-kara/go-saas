// src/features/companies/components/company-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@gocrm/components/ui/button'
import { Input } from '@gocrm/components/ui/input'
import { Textarea } from '@gocrm/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gocrm/components/ui/form'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gocrm/components/ui/tabs'
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  CompanyFormValues,
  companyFormSchema,
} from '@gocrm/features/companies/schemas/company-form.schema'
import { Loader2 } from 'lucide-react'
import {
  AttributeType,
  useGetAttributeGroupsQuery,
  useGetAttributeTypesQuery,
} from '@gocrm/graphql/generated/hooks'
import { AttributeMultiSelect } from '@gocrm/features/attributes/components/attribute-multi-select'
import { useMemo } from 'react'
import { CascadingAttributeFilter } from './cascading-attribute-filter'
import { SocialProfilesInput } from './social-profiles-input'

interface CompanyFormProps {
  onSubmit: (values: CompanyFormValues) => void
  isSubmitting: boolean
  initialValues?: Partial<CompanyFormValues>
}

export const CompanyForm = ({
  onSubmit,
  isSubmitting,
  initialValues,
}: CompanyFormProps) => {
  const { translations } = useTranslations()
  const formSchema = companyFormSchema(translations?.companyForm ?? {})

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website: '',
      description: '',
      taxId: '',
      phoneNumber: '',
      email: '',
      socialProfiles: {},
      addressLine1: '',
      addressLine2: '',
      postalCode: '',
      ...initialValues,
    },
  })

  const isDirty = form.formState.isDirty

  const { data: attributeGroupsData, loading: attributeGroupsLoading } =
    useGetAttributeGroupsQuery({
      variables: {
        take: 100,
        skip: 0,
      },
    })

  const { data: attributeTypesData, loading: attributeTypesLoading } =
    useGetAttributeTypesQuery({
      variables: {
        args: {
          searchQuery: '',
        },
        includeSystemDefined: true,
      },
    })

  const attributeGroups = useMemo(() => {
    return attributeGroupsData?.attributeGroups.items || []
  }, [attributeGroupsData])

  const attributeTypes = useMemo(() => {
    return attributeTypesData?.attributeTypes.items || []
  }, [attributeTypesData])

  const addressAttributes = useMemo(
    () =>
      attributeTypes.find(
        (attr) =>
          attributeGroups.find((g) => g.id === attr.groupId)?.code ===
          'adres-bilgileri',
      ) ?? undefined,
    [attributeTypes, attributeGroups],
  )

  const isLoading = attributeGroupsLoading || attributeTypesLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>{translations?.companyForm?.loadingText || 'Loading...'}</span>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log({ err }))}
        className="space-y-4"
      >
        <Tabs defaultValue={attributeGroups[0]?.code} className="w-full">
          <TabsList
            className="w-full overflow-x-auto whitespace-nowrap justify-start md:grid"
            style={{
              gridTemplateColumns: `repeat(${
                attributeGroups.length || 1
              }, minmax(0, 1fr))`,
            }}
          >
            {attributeGroups.map((group) => (
              <TabsTrigger key={group.id} value={group.code}>
                {group.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {attributeGroups.map((group) => {
            const groupAttributes = attributeTypes.filter(
              (attr) =>
                attr.groupId === group.id && attr.kind !== 'HIERARCHICAL',
            )

            return (
              <TabsContent
                key={group.id}
                value={group.code}
                className="space-y-4 border-b border-l border-r px-4 py-6"
              >
                {group.code === 'genel-bilgiler' && (
                  <>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.nameLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm?.namePlaceholder
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.websiteLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm?.websitePlaceholder
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.descriptionLabel}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={
                                translations?.companyForm
                                  ?.descriptionPlaceholder
                              }
                              className="resize-none"
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taxId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.taxIdLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm?.taxIdPlaceholder
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {group.code === 'iletisim-bilgileri' && (
                  <>
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.phoneNumberLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm
                                  ?.phoneNumberPlaceholder
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.emailLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm?.emailPlaceholder
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="socialProfiles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.socialProfilesLabel}
                          </FormLabel>
                          <FormControl>
                            <SocialProfilesInput
                              value={field.value ?? {}}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {group.code === 'adres-bilgileri' && (
                  <>
                    <FormField
                      control={form.control}
                      name="addressLine1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.addressLine1Label}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm
                                  ?.addressLine1Placeholder
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="addressLine2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.addressLine2Label}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm
                                  ?.addressLine2Placeholder
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {translations?.companyForm?.postalCodeLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                translations?.companyForm
                                  ?.postalCodePlaceholder || 'Posta Kodu'
                              }
                              {...field}
                              value={field.value ?? ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <hr />
                  </>
                )}

                {group.code === 'adres-bilgileri' && addressAttributes && (
                  <FormField
                    key={addressAttributes.id}
                    control={form.control}
                    name={`addressAttributeCodes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{addressAttributes.name}</FormLabel>
                        <FormControl>
                          <CascadingAttributeFilter
                            attributeType={addressAttributes as AttributeType}
                            hierarchy={[
                              {
                                level: 0,
                                label:
                                  translations?.address.country || 'Country',
                              },
                              {
                                level: 1,
                                label: translations?.address.city || 'City',
                              },
                              {
                                level: 2,
                                label:
                                  translations?.address.district || 'District',
                              },
                              {
                                level: 3,
                                label:
                                  translations?.address.neighborhood ||
                                  'Neighborhood',
                              },
                            ]}
                            selectedValues={field.value || []}
                            onChange={(values) => {
                              field.onChange(values)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {groupAttributes.map((attrType) => (
                  <FormField
                    key={attrType.id}
                    control={form.control}
                    name={`attributes.${attrType.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{attrType.name}</FormLabel>
                        <FormControl>
                          <AttributeMultiSelect
                            attributeTypeId={attrType.id}
                            selectedValues={(field.value || []).filter(
                              (value): value is { id: string; value: string } =>
                                value != null,
                            )}
                            onSelectionChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </TabsContent>
            )
          })}
        </Tabs>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? translations?.companyForm?.submittingButton
            : translations?.companyForm?.submitButton}
        </Button>
      </form>
    </Form>
  )
}
