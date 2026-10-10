import { z } from "zod";

const today = () => new Date().toISOString().slice(0, 10);

export const issueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(1000, "La description ne doit pas dépasser 1000 caractères"),
  device: z
    .string()
    .trim()
    .min(2, "L'appareil ou le site doit contenir au moins 2 caractères")
    .max(100, "L'appareil ou le site ne doit pas dépasser 100 caractères"),
  urgency: z.string().min(1, "Choisissez un niveau d'urgence"),
  assignee: z.string().min(1, "Choisissez un responsable"),
  due_date: z
    .string()
    .optional()
    .refine(
      (value) => !value || value >= today(),
      "L'échéance doit être dans le futur"
    ),
});
