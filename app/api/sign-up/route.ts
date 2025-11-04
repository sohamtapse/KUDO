import User from "../../../models/user.model";
import { NextResponse } from "next/server";
import connect from "@/db/db"; // your mongoose connection file

export async function POST(req: Request) {
  const { email, password, username } = await req.json();

  try {
    await connect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await User.hashPassword(password);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    const token = newUser.generateJWT();

    const response = NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      secure: false,
      sameSite: "strict",
    });

    return response;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      return NextResponse.json(
        { message: "Error signing in", error: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Error signing in", error: "Unknown error" },
      { status: 500 }
    );
  }
}
