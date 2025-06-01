"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOneTransaction } from "@/functions/Transaction";
import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types/Transactions";
import { CheckCircle, Clock, Printer, XCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyPaymentPage() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState<Transaction>();

  useEffect(() => {
    (async () => {
      if (typeof transactionId !== "string") return;
      await getOneTransaction(transactionId)
        .then((transaction) => setTransaction(transaction))
        .catch((error) => toast.error((error as Error).message));
    })();
  }, [transactionId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Success
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg bg-white pt-0">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg p-3">
            <CardTitle className="text-2xl font-bold">
              {process.env.NEXT_PUBLIC_SCHOOL_NAME}
            </CardTitle>
            <div className="mt-2">
              <h2 className="text-xl font-semibold">Payment Receipt</h2>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {transaction && getStatusIcon(transaction.status)}
                <span className="font-medium">Transaction Status</span>
              </div>
              {transaction && getStatusBadge(transaction.status)}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono text-sm font-medium">
                    {transaction?.transactionId}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {transaction && formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₦
                    {transaction && Number(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Student Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">
                      {transaction?.userId.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-blue-600">
                      {transaction?.userId.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{transaction?.userId.phone}</p>
                  </div>
                </div>
                <div>
                  {transaction?.userId && (
                    <Image
                      src={transaction.userId.photo}
                      alt={transaction.userId.fullName}
                      width={100}
                      height={100}
                      className="object-cover rounded-circle"
                    />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                This is an official receipt from{" "}
                {process.env.NEXT_PUBLIC_SCHOOL_NAME}
              </p>
              <p>
                For questions regarding this transaction, please contact the
                Finance Office
              </p>
              <p className="font-mono text-xs">
                Receipt generated on {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex justify-center mt-6 print:hidden">
              <Button
                variant={"ghost"}
                onClick={() => typeof window !== "undefined" && window.print()}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
