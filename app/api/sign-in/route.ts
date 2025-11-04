import { NextResponse } from "next/server";
import connect from "@/db/db"; // your mongoose connection file
import User from "../../../models/user.model";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    await connect();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await user.isValidPassword(password);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = user.generateJWT();

    const response = NextResponse.json(
      { message: "Signed in successfully" },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
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
