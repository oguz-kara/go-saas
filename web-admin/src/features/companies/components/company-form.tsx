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
import { useTranslations } from '@gocrm/hooks/use-translations'
import {
  CompanyFormValues,
  createCompanyFormSchema,
} from '@gocrm/features/companies/schemas/company-form.schema'
import { Loader2 } from 'lucide-react'
import { useGetAttributeTypesQuery } from '@gocrm/graphql/generated/hooks'
import { AttributeMultiSelect } from '@gocrm/features/attributes/components/attribute-multi-select'
import { useEffect } from 'react'

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
  console.log({ initialValues })
  const { translations } = useTranslations()
  const formSchema = createCompanyFormSchema(translations?.companyForm ?? {})

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website: '',
      industry: '',
      description: '',
      attributes: {},
      ...initialValues,
    },
  })

  const { data: attributeTypesData, loading: attributeTypesLoading } =
    useGetAttributeTypesQuery({
      variables: {
        args: {
          searchQuery: '',
        },
      },
    })
  const attributeTypes = attributeTypesData?.attributeTypes.items || []

  useEffect(() => {
    if (attributeTypesData) {
      console.log({ attributeTypesData })
    }
  }, [attributeTypesData])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations?.companyForm?.nameLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={translations?.companyForm?.namePlaceholder}
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
              <FormLabel>{translations?.companyForm?.websiteLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={translations?.companyForm?.websitePlaceholder}
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
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{translations?.companyForm?.industryLabel}</FormLabel>
              <FormControl>
                <Input
                  placeholder={translations?.companyForm?.industryPlaceholder}
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
                    translations?.companyForm?.descriptionPlaceholder
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

        <hr />

        {attributeTypesLoading && <p>Özellikler yükleniyor...</p>}
        {attributeTypes.map((attrType) => (
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
                    selectedValues={(field.value || []).filter(Boolean)}
                    onSelectionChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? translations?.companyForm?.submittingButton
            : translations?.companyForm?.submitButton}
        </Button>
      </form>
    </Form>
  )
}
