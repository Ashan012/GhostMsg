import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const currentUser = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "User not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    // const userMessages = await UserModel.aggregate([
    //   {
    //     $match: {
    //       _id: userId,
    //     },
    //   },
    //   { $unwind: "$messages" },
    //   {
    //     $sort: {
    //       "messages.CreatedAt": -1,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       messages: {
    //         $push: "$messages",
    //       },
    //     },
    //   },
    // ]);

    // if (!userMessages || userMessages.length === 0) {
    //   return Response.json(
    //     {
    //       success: "false",
    //       message: "User message not found",
    //     },
    //     { status: 401 }
    //   );
    // }
    const user = await UserModel.findById(currentUser?._id);

    if (user) {
      const userMessages = user?.message;

      return Response.json(
        {
          success: "true",
          message: userMessages,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: "false",
        message: "User message not found",
      },
      { status: 401 }
    );
  }
}
