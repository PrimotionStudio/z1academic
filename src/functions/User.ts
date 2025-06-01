import { LoginUser, InputRegisterUser, UserEditInfo } from "@/types/User";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function validateRegisterUserForm(user: InputRegisterUser) {
  if (user.fullName.trim().length < 2)
    throw new Error("Name must be at least 2 characters");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email))
    throw new Error("Please enter a valid email address");

  if (user.phone.trim().length < 10)
    throw new Error("Please enter a valid phone number");

  if (user.password.length < 8)
    throw new Error("Password must be at least 8 characters");

  if (user.password !== user.confirmPassword)
    throw new Error("Passwords must match");

  return true;
}

export function validateLoginUserForm(user: LoginUser) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email))
    throw new Error("Please enter a valid email address");
  return true;
}

export function validateForgotUserForm(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    throw new Error("Please enter a valid email address");
  return true;
}

export async function registerUser(user: InputRegisterUser) {
  validateRegisterUserForm(user);
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data.message;
}

export async function activateUser(token: string) {
  const response = await fetch(`/api/activate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);

  return data.message;
}

export async function loginUser(user: LoginUser) {
  validateLoginUserForm(user);
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function forgotUser(email: string) {
  validateForgotUserForm(email);
  const response = await fetch("/api/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export function getUserIdFromCookie(request: NextRequest) {
  const token = request.cookies.get("token");
  if (!token) throw new Error("Unauthorized");
  const decoded = jwt.verify(token.value, process.env.AUTH_SECRET!) as {
    _id: string;
  };
  if (!decoded._id) throw new Error("Unauthorized");
  return decoded._id;
}

export function validateEditUserForm(user: UserEditInfo) {
  if (!user.fullName.trim()) throw new Error("Full name is required");
  else if (user.fullName.trim().length < 4)
    throw new Error("Full name must be at least 4 characters");
  if (!user.email.trim()) throw new Error("Email is required");
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email))
      throw new Error("Please enter a valid email address");
  }
  return true;
}

export function validateChangePasswordForm(
  newPassword: string,
  confirmPassword: string,
) {
  if (newPassword.length < 8)
    throw new Error("Password must be at least 8 characters");
  if (newPassword !== confirmPassword) throw new Error("Passwords must match");

  return true;
}

export async function changePassword(
  password: string,
  newPassword: string,
  confirmPassword: string,
) {
  const response = await fetch("/api/me/change-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, newPassword, confirmPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}

export async function fetchEmailByToken(resetToken: string) {
  const response = await fetch(`/api/reset?resetToken=${resetToken}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.email;
}

export async function resetPassword(
  email: string,
  resetToken: string,
  password: string,
  confirmPassword: string,
) {
  if (password.length < 8)
    throw new Error("Password must be at least 8 characters");
  if (password !== confirmPassword) throw new Error("Passwords must match");

  const response = await fetch("/api/reset", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      resetToken,
      password,
      confirmPassword,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.message;
}
