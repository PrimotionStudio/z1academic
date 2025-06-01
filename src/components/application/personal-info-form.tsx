"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nigerianStates, getLGAs } from "@/lib/nigeria-data";
import {
  InputApplicationData,
  ApplicationFormProps,
} from "@/types/Application";
import { validatePersonalInfoForm } from "@/functions/Application";
import { toast } from "sonner";

export function PersonalInfoForm({
  applicationData,
  updateData,
  onNext,
}: ApplicationFormProps) {
  const handleNext = () => {
    try {
      if (validatePersonalInfoForm(applicationData)) onNext();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Personal Information</div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="program">Program</Label>
          <Select
            value={applicationData.program}
            onValueChange={(value) => updateData({ program: value })}
          >
            <SelectTrigger id="program">
              <SelectValue placeholder="Select a program" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bsc-computer-science">
                BSc. Computer Science
              </SelectItem>
              <SelectItem value="bsc-engineering">BSc. Engineering</SelectItem>
              <SelectItem value="bsc-mathematics">BSc. Mathematics</SelectItem>
              <SelectItem value="bsc-physics">BSc. Physics</SelectItem>
              <SelectItem value="bsc-economics">BSc. Economics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={applicationData.dateOfBirth}
            onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="stateOfOrigin">State of Origin</Label>
          <Select
            value={applicationData.stateOfOrigin}
            onValueChange={(value) => {
              updateData({ stateOfOrigin: value, lga: "" });
            }}
          >
            <SelectTrigger id="stateOfOrigin">
              <SelectValue placeholder="Select state of origin" />
            </SelectTrigger>
            <SelectContent>
              {nigerianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="lga">Local Government Area (LGA)</Label>
          <Select
            value={applicationData.lga}
            onValueChange={(value) => updateData({ lga: value })}
            disabled={!applicationData.stateOfOrigin}
          >
            <SelectTrigger id="lga">
              <SelectValue placeholder="Select LGA" />
            </SelectTrigger>
            <SelectContent>
              {applicationData.stateOfOrigin &&
                getLGAs(applicationData.stateOfOrigin).map((lga) => (
                  <SelectItem key={lga} value={lga}>
                    {lga}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contactAddress">Contact Address</Label>
          <Input
            id="contactAddress"
            value={applicationData.contactAddress}
            onChange={(e) => updateData({ contactAddress: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="nextOfKin">Next of Kin</Label>
          <Input
            id="nextOfKin"
            value={applicationData.nextOfKin}
            onChange={(e) => updateData({ nextOfKin: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="nextOfKinPhone">Next of Kin Phone</Label>
          <Input
            id="nextOfKinPhone"
            value={applicationData.nextOfKinPhone}
            onChange={(e) => updateData({ nextOfKinPhone: e.target.value })}
            placeholder="e.g., 08012345678"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
}
