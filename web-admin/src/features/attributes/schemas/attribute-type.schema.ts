import { z } from 'zod'
import {
  AttributeTypeKind,
  AttributeDataType,
  AttributableType,
} from '@gocrm/graphql/generated/hooks'
import { Translations } from '@gocrm/lib/i18n'

export const attributeTypeSchema = (t: Translations['formErrors']) =>
  z.object({
    name: z
      .string()
      .min(1, t?.required || 'Name is required')
      .max(100),
    kind: z.nativeEnum(AttributeTypeKind),
    dataType: z.nativeEnum(AttributeDataType),
    groupId: z.string().optional().nullable(),
    availableFor: z
      .array(z.nativeEnum(AttributableType))
      .min(
        1,
        t?.atLeastOneTypeMustBeSelected || 'At least one type must be selected',
      ),
  })

export type AttributeTypeSchema = z.infer<
  ReturnType<typeof attributeTypeSchema>
>
