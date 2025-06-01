"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Fee, InputFee } from "@/types/Fee";
import { addNewFee, getAllFee, editFee as EditFee } from "@/functions/Fee";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [newFee, setNewFee] = useState<InputFee>({
    label: "",
    amount: 1000,
  });
  const [editFee, setEditFee] = useState<InputFee & { feeId: string }>({
    feeId: "",
    label: "",
    amount: 1000,
  });

  async function getFees() {
    await getAllFee()
      .then((fees) => setFees(fees))
      .catch((error) => toast.error((error as Error).message));
  }
  useEffect(() => {
    getFees();
  }, []);

  async function addFee() {
    try {
      if (!newFee.label) throw new Error("Label is required");
      if (newFee.amount < 100) throw new Error("Minimum amount of ₦100");
      await addNewFee(newFee).then(async (message) => {
        await getFees();
        toast.success(message);
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function editFeeId() {
    try {
      if (!editFee.feeId) throw new Error("Fee must have an Id");
      if (!editFee.label) throw new Error("Label is required");
      if (editFee.amount < 100) throw new Error("Minimum amount of ₦100");
      await EditFee(editFee.feeId, editFee).then(async (message) => {
        await getFees();
        toast.success(message);
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold lg:text-3xl lg:font-bold">
            Fees
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size={"sm"}>
              <Plus /> Fee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new fee</DialogTitle>
              <DialogDescription>
                Add new fees. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Input
                  id="label"
                  value={newFee.label}
                  onChange={(e) =>
                    setNewFee({ ...newFee, label: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={newFee.amount}
                  onChange={(e) =>
                    setNewFee({ ...newFee, amount: Number(e.target.value) })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit" onClick={addFee}>
                  Save
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>All Fees</CardTitle>
          <CardDescription>View and manage all fees.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.length > 0 ? (
                  fees.map((fee, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{fee.label}</TableCell>
                      <TableCell>
                        ₦{Number(fee.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{formatDate(fee.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          onOpenChange={(open) =>
                            !open &&
                            setEditFee({
                              feeId: "",
                              label: "",
                              amount: 1000,
                            })
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size="sm"
                              onClick={() => {
                                setEditFee({
                                  feeId: fee._id,
                                  label: fee.label,
                                  amount: fee.amount,
                                });
                              }}
                            >
                              <Edit /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit fee</DialogTitle>
                              <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="label" className="text-right">
                                  Label
                                </Label>
                                <Input
                                  id="label"
                                  value={editFee.label}
                                  onChange={(e) =>
                                    setEditFee({
                                      ...editFee,
                                      label: e.target.value,
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="amount" className="text-right">
                                  Amount
                                </Label>
                                <Input
                                  id="amount"
                                  type="number"
                                  value={editFee.amount}
                                  onChange={(e) =>
                                    setEditFee({
                                      ...editFee,
                                      amount: Number(e.target.value),
                                    })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="submit" onClick={editFeeId}>
                                  Save
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No fee found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
