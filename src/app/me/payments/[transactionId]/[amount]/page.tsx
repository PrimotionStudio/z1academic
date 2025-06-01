"use client";
import crypto from "crypto";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Copy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function RedirectPage() {
  const router = useRouter();
  const params = useParams();
  const { transactionId, amount } = params;
  const [countdown, setCountdown] = useState(5);
  const [copied, setCopied] = useState(false);

  const product_id = process.env.NEXT_PUBLIC_QT_MERCHANT_CODE!;
  const pay_item_id = process.env.NEXT_PUBLIC_QT_PAY_ID!;
  const mac_key = process.env.NEXT_PUBLIC_QT_DATA_REF!;
  const redirect_url = `${process.env.NEXT_PUBLIC_REDIRECT_URL}/payments/verify`;
  const currency = "566";
  const amountKobo = (Number(amount) * 100).toString();

  const hashString = `${transactionId}${product_id}${pay_item_id}${amountKobo}${redirect_url}${mac_key}`;
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/me");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  const copyTransactionId = async () => {
    await navigator.clipboard.writeText(transactionId as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    // <div>
    //   <form
    //     id="interswitchForm"
    //     method="post"
    //     action="https://newwebpay.qa.interswitchng.com/collections/w/pay"
    //   >
    //     <input type="text" name="product_id" value={product_id} />
    //     <input type="text" name="pay_item_id" value={pay_item_id} />
    //     <input type="text" name="amount" value={amountKobo} />
    //     <input type="text" name="currency" value={currency} />
    //     <input type="text" name="txn_ref" value={transactionId} />
    //     <input type="text" name="site_redirect_url" value={redirect_url} />
    //     <input type="text" name="hash" value={hash} />
    //     <input type="submit" value="Submit" />
    //   </form>
    //   <script
    //       dangerouslySetInnerHTML={{
    //         __html: `document.getElementById('interswitchForm').submit()`,
    //       }}
    //     />
    // </div>
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg bg-white">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
            <p className="text-3xl font-bold text-green-600">
              ₦{Number(amount).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-2">Transaction ID</p>
            <div className="flex items-center justify-between bg-white rounded border p-2">
              <span className="text-sm font-mono text-gray-800">
                {transactionId}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyTransactionId}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1">
                Transaction ID copied!
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              Redirecting to dashboard in {countdown} seconds...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <Button className="w-full" asChild>
            <Link href="/me/applications">
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
