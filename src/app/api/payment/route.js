import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getUserSession } from "@/lib/core/session";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const user = await getUserSession();
    const formData = await request.formData();
    const price = formData.get("price");
    const className = formData.get("className");
    const classId = formData.get("classId");

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,

      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price_data: {
            currency: "usd",
            unit_amount: Number(price) * 100, // Convert dollars to cents
            product_data: {
              name: className,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        price: Number(price),
        userId: user?.id,
        userEmail: user?.email,
        className,
        userName: user?.name,
        classId,
        userName: user?.name,
        transactionId: `txn_${Date.now()}`, // Unique transaction ID
      },
      mode: "payment",
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Hello from the payment API!" });
}




// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import Stripe from "stripe";
// import { getUserSession } from "@/lib/core/session";

// export const dynamic = "force-dynamic";

// export async function POST(request) {
//   try {
//     const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

//     if (!stripeSecretKey) {
//       return NextResponse.json(
//         { error: "STRIPE_SECRET_KEY is missing in environment variables." },
//         { status: 500 },
//       );
//     }

//     const stripe = new Stripe(stripeSecretKey);

//     const headersList = await headers();
//     const origin =
//       headersList.get("origin") ||
//       process.env.BETTER_AUTH_URL ||
//       process.env.NEXT_PUBLIC_CLIENT_URL;

//     const user = await getUserSession();

//     if (!user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized. Please login first." },
//         { status: 401 },
//       );
//     }

//     const formData = await request.formData();

//     const price = formData.get("price");
//     const className = formData.get("className");
//     const classId = formData.get("classId");

//     const amount = Number(price);

//     if (!amount || amount <= 0) {
//       return NextResponse.json(
//         { error: "Invalid class price." },
//         { status: 400 },
//       );
//     }

//     if (!className || !classId) {
//       return NextResponse.json(
//         { error: "Class information is missing." },
//         { status: 400 },
//       );
//     }

//     const session = await stripe.checkout.sessions.create({
//       customer_email: user.email,

//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             unit_amount: Math.round(amount * 100),
//             product_data: {
//               name: String(className),
//             },
//           },
//           quantity: 1,
//         },
//       ],

//       metadata: {
//         price: String(amount),
//         userId: String(user.id),
//         userEmail: String(user.email),
//         userName: String(user.name || ""),
//         className: String(className),
//         classId: String(classId),
//         transactionId: `txn_${Date.now()}`,
//       },

//       mode: "payment",
//       success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${origin}/all-classes/${classId}`,
//     });

//     return NextResponse.redirect(session.url, 303);
//   } catch (err) {
//     return NextResponse.json(
//       { error: err.message || "Payment failed." },
//       { status: err.statusCode || 500 },
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json({ message: "Hello from the payment API!" });
// }
