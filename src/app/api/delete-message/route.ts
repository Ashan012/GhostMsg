import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const queryParams = searchParams.get("id");

  try {
    const deleteMessage = await UserModel.updateOne(
      { "message._id": queryParams },
      { $pull: { message: { _id: queryParams } } }
    );

    if (deleteMessage) {
      return NextResponse.json(
        {
          success: true,
          message: "Delete Message Successfully",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error in Delete Message ",
        error,
      },
      { status: 401 }
    );
  }
}
