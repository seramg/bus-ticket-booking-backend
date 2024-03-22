import { Response, Request, NextFunction } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { ACCESS_TOKEN } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignInSchema, SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { email, password, name, phone } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new BadRequestsException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }

  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      role: "USER",
      phone,
    },
  });

  res.json({
    success: true,
    message: "Registration successful! Please verify your email.",
    data: {
      user: {
        passwordChanged: false, // Assuming this field is not set initially
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: user.password,
        // Include other fields as needed
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = SignInSchema.parse(req.body);

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException(
      "Invalid credentials",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    ACCESS_TOKEN,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    ACCESS_TOKEN,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    message: "Email verified and login",
    data: {
      accessToken,
      refreshToken,
      firstName: user.name, // Assuming firstName is a property of the user object
      email: user.email,
      role: user.role, // Assuming user role is needed in the response
    },
  });
};

export const logout = (req: Request, res: Response) => {
  try {
    console.log('req')
    console.log(req);

    // Respond with a success message
    return res.json({ success: true, message: "User logged out", data: {} });
  } catch (error: any) {
    // Handle any potential errors
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
