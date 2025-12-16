import { z } from "zod";

const EntrySchema = z.object({
  uid: z.string().min(1),
  feature: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
  }),
  model: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    trained: z.string().min(1),
    data: z.string().min(1),
    dataDescription: z.string().optional(),
  }),
  compliance: z.object({
    retention: z.string().min(1),
    logging: z.string().min(1),
    loggingDescription: z.string().min(1),
    regions: z.string().min(1),
    regionsDescription: z.string().min(1),
    pii: z.string().min(1),
    piiDescription: z.string().min(1),
  }),
  outputs: z.object({
    settings: z.string().min(1),
    human: z.string().min(1),
    humanDescription: z.string().optional(),
    guardrails: z.string().optional(),
    risks: z.string().optional(),
    outcomes: z.string().optional(),
  }),
  permissions: z.number().int(),
});

type EntrySchemaType = z.infer<typeof EntrySchema>;

const HeadersSchema = z.object({
  headers: z.object({
    model: z.string().min(1),
    compliance: z.string().min(1),
    outputs: z.string().min(1),
  }),
  labels: z.object({
    baseModel: z.string().min(1),
    dataTraining: z.string().min(1),
    dataSharing: z.string().min(1),
    dataRetention: z.string().min(1),
    piiHandling: z.string().min(1),
    outputSettings: z.string().min(1),
    humanReview: z.string().min(1),
    outputGuardrails: z.string().min(1),
    outputRisks: z.string().min(1),
    outputOutcomes: z.string().min(1),
  })
})

type HeadersSchemaType = z.infer<typeof HeadersSchema>;

export { EntrySchema, type EntrySchemaType, HeadersSchema, type HeadersSchemaType };