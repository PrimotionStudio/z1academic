import { getUserIdFromCookie } from "@/functions/User";
import User from "@/models/User";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { transactionId, amount } = await request.json();

  const product_id = process.env.QT_MERCHANT_CODE!;
  const pay_item_id = process.env.QT_PAY_ID!;
  const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`;
  const mac_key = process.env.QT_DATA_REF!;
  const currency = "566";
  const amountInKobo = (amount * 100).toString();

  const hashString = `${transactionId}${product_id}${pay_item_id}${amountInKobo}${redirect_url}${mac_key}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <body>
        <form id="interswitchForm" method="post" action="https://webpay.interswitchng.com/pay">
          <input type="hidden" name="product_id"        value="${product_id}" />
          <input type="hidden" name="pay_item_id"       value="${pay_item_id}" />
          <input type="hidden" name="amount"            value="${amountInKobo}" />
          <input type="hidden" name="currency"          value="${currency}" />
          <input type="hidden" name="txn_ref"           value="${transactionId}" />
          <input type="hidden" name="site_redirect_url" value="${redirect_url}" />
          <input type="hidden" name="hash"              value="${hash}" />
        </form>
        <script>
          document.getElementById('interswitchForm').submit();
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference");
    if (!reference) throw new Error("Cannot verify transaction");
    return NextResponse.json({ message: "Transaction verified successful" });
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message, error },
      { status: 400 },
    );
  }
}
