import { z } from "zod";

type Translate = (key: string) => string;

export function buildSignInSchema(t: Translate) {
  return z.object({
    email: z
      .string()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });
}

export type SignInFormValues = z.infer<ReturnType<typeof buildSignInSchema>>;

export function buildSignUpSchema(t: Translate) {
  return z
    .object({
      fullName: z
        .string()
        .trim()
        .min(1, t("fullNameRequired"))
        .refine((value) => value.trim().split(/\s+/).length >= 2, {
          message: t("fullNameRequired"),
        }),
      email: z
        .string()
        .min(1, t("emailRequired"))
        .email(t("emailInvalid")),
      password: z
        .string()
        .min(1, t("passwordRequired"))
        .min(8, t("passwordTooShort"))
        .regex(/[A-Z]/, t("passwordNeedsUppercase"))
        .regex(/[0-9]/, t("passwordNeedsNumber")),
      termsAccepted: z.boolean().refine((value) => value, {
        message: t("termsRequired"),
      }),
      companyMode: z.enum(["create", "join"]),
      newCompanyName: z.string().trim().optional(),
      companyId: z.string().trim().optional(),
      hasPendingInvite: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (data.hasPendingInvite) return;

      if (data.companyMode === "create" && !data.newCompanyName) {
        ctx.addIssue({
          code: "custom",
          path: ["newCompanyName"],
          message: t("newCompanyNameRequired"),
        });
      }

      if (data.companyMode === "join" && !data.companyId) {
        ctx.addIssue({
          code: "custom",
          path: ["companyId"],
          message: t("companyIdRequired"),
        });
      }
    });
}

export type SignUpFormValues = z.infer<ReturnType<typeof buildSignUpSchema>>;

export function buildProfileSchema(t: Translate) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, t("nameRequired"))
      .max(50, t("nameTooLong")),
    surname: z
      .string()
      .trim()
      .min(1, t("surnameRequired"))
      .max(50, t("surnameTooLong")),
  });
}

export type ProfileFormValues = z.infer<ReturnType<typeof buildProfileSchema>>;

export function buildInviteSchema(t: Translate) {
  return z.object({
    memberEmail: z
      .string()
      .min(1, t("memberEmailRequired"))
      .email(t("memberEmailInvalid")),
  });
}

export type InviteFormValues = z.infer<ReturnType<typeof buildInviteSchema>>;
