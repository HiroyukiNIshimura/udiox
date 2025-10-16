import z from 'zod';

export const Tag = z.object({
  explanation: z.string().describe('タグの説明'),
  output: z.string().nonempty().describe('タグの出力'),
});

export const PromptSchema = z.object({
  theme: z.string().nonempty().describe('曲のテーマ'),
  reason: z.string().describe('プロンプトの作成理由'),
  tags: z.array(Tag).describe('関連するタグのリスト'),
});

export type PromptType = z.infer<typeof PromptSchema>;
export type TagType = z.infer<typeof Tag>;

export const getResponseFormat = (
  schema: z.ZodSchema,
  name: string,
): {
  type: 'json_schema';
  json_schema: {
    name: string;
    strict: boolean;
    schema: any;
  };
} => {
  return {
    type: 'json_schema',
    json_schema: {
      name: name,
      strict: true,
      schema: z.toJSONSchema(schema),
    },
  };
};
export const getTextFormat = (
  schema: z.ZodSchema,
  name: string,
): {
  type: 'json_schema';
  name: string;
  strict: boolean;
  schema: any;
} => {
  return {
    type: 'json_schema',
    name,
    strict: true,
    schema: z.toJSONSchema(schema),
  };
};
