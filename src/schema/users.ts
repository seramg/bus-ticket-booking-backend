import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().refine((value) => value.trim() !== "", {
    message: "name should not be empty",
  }),
  email: z.string().email({
    message: "email must be an email",
  }),

  password: z.string().refine((password) => {
    // Password complexity requirements: 1 uppercase, 1 lowercase, 1 number, 1 special character
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    return (
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharRegex.test(password)
    );
  }, "password is not strong enough"),
  phone: z.string().refine((value) => value.trim() !== "", {
    message: "phone should not be empty",
  }),
});

export const SignInSchema = z.object({
  email: z.string().email({
    message: "email must be an email",
  }),

  password: z.string().refine((password) => {
    // Password complexity requirements: 1 uppercase, 1 lowercase, 1 number, 1 special character
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    return (
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharRegex.test(password)
    );
  }, "password is not strong enough"),
});

export const ListUsersSchema = z.object({
  page: z
    .string()
    .min(1, { message: "page should not be empty" })
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message: "page must be a number conforming to the specified constraints",
    })
    .refine((value) => parseInt(value, 10) >= 1, {
      message: "page must not be less than 1",
    }),
  pageSize: z
    .string()
    .min(1, { message: "page should not be empty" })
    .refine((value) => !isNaN(parseInt(value, 10)), {
      message:
        "pageSize must be a number conforming to the specified constraints",
    })
    .refine((value) => parseInt(value, 10) >= 1, {
      message: "pageSize must be greater than or equal to 1",
    }),
});
