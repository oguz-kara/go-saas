'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AttributeType,
  AttributeDataType,
  AttributeTypeKind,
  AttributableType,
  GetAttributeArchitectureQuery,
} from '@gocrm/graphql/generated/hooks'
import { useTranslations } from '@gocrm/hooks/use-translations'
import { Button } from '@gocrm/components/ui/button'
import { Input } from '@gocrm/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gocrm/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gocrm/components/ui/form'
import { Checkbox } from '@gocrm/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { kindToTextMapper } from '../mappers/kind-to-text.mapper'
import { dataTypeToTextMapper } from '../mappers/data-type-to-text.mapper'
import { StringValues } from '@gocrm/lib/i18n/types'
import { attributableToTextMapper } from '../mappers/attributable-to-text.mapper'
import {
  attributeTypeSchema,
  AttributeTypeSchema,
} from '../schemas/attribute-type.schema'

interface AttributeTypeFormProps {
  onSubmit: (values: AttributeTypeSchema) => void
  onCancel: () => void
  isLoading: boolean
  initialData?: AttributeType | null
  attributeGroups: GetAttributeArchitectureQuery['attributeGroups']['items']
  isEditMode: boolean
}

export const AttributeTypeForm = ({
  onSubmit,
  onCancel,
  isLoading,
  initialData,
  attributeGroups,
  isEditMode,
}: AttributeTypeFormProps) => {
  console.log({ initialData })
  const { translations } = useTranslations()
  const t = translations?.attributeStudio
  const formErrors = translations?.formErrors

  const form = useForm<AttributeTypeSchema>({
    resolver: zodResolver(attributeTypeSchema(formErrors as StringValues)),
    defaultValues: {
      name: '',
      kind: initialData?.kind || AttributeTypeKind.Text,
      dataType: initialData?.dataType || AttributeDataType.Text,
      groupId: initialData?.groupId || undefined,
      availableFor: initialData?.availableFor as AttributableType[],
    },
  })

  const isDirty = form.formState.isDirty

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        kind: initialData.kind,
        dataType: initialData.dataType,
        groupId: initialData.group?.id || null,
        availableFor: initialData.availableFor as AttributableType[],
      })
    } else {
      form.reset({
        name: '',
        kind: AttributeTypeKind.Text,
        dataType: AttributeDataType.Text,
        groupId: attributeGroups[0]?.id || undefined,
        availableFor: [AttributableType.Company],
      })
    }
  }, [initialData, form, attributeGroups])

  const handleFormSubmit = form.handleSubmit((values) => {
    onSubmit(values)
  })

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t?.typeNameLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={t?.typeNamePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t?.groupLabel}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? undefined}
                  value={field.value ?? undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t?.groupPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {attributeGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t?.kindLabel}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t?.kindPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AttributeTypeKind).map((kind) => (
                      <SelectItem key={kind} value={kind}>
                        {kindToTextMapper(kind, t as StringValues)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t?.dataTypeLabel}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t?.dataTypePlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AttributeDataType).map((dataType) => (
                      <SelectItem key={dataType} value={dataType}>
                        {dataTypeToTextMapper(dataType, t as StringValues)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFor"
            render={() => (
              <FormItem>
                <FormLabel>{t?.availableForLabel}</FormLabel>
                <div className="space-y-2">
                  {Object.values(AttributableType).map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="availableFor"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: AttributableType) =>
                                            value !== item,
                                        ),
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {attributableToTextMapper(
                                item,
                                t as StringValues,
                              )}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t?.cancel}
          </Button>
          <Button type="submit" disabled={isLoading || !isDirty}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? t?.update : t?.create}
          </Button>
        </div>
      </form>
    </Form>
  )
}
