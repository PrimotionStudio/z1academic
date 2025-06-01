"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  activatePeriod,
  addNewPeriod,
  editPeriod,
  getAllPeriods,
} from "@/functions/Period";
import {
  activateSession,
  addNewSession,
  editSession,
  getAllSessions,
} from "@/functions/Session";
import { Period } from "@/types/Period";
import { Session } from "@/types/Session";
import { Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AcademicSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSessionName, setNewSessionName] = useState("");
  const [editSessionName, setEditSessionName] = useState("");
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false);
  const [isEditSessionDialogOpen, setIsEditSessionDialogOpen] = useState(false);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [editPeriodName, setEditPeriodName] = useState("");
  const [editingPeriod, setEditingPeriod] = useState<Session | null>(null);
  const [isAddPeriodDialogOpen, setIsAddPeriodDialogOpen] = useState(false);
  const [isEditPeriodDialogOpen, setIsEditPeriodDialogOpen] = useState(false);

  async function getSessions() {
    getAllSessions()
      .then((sessions) => setSessions(sessions))
      .catch((error) => toast.error((error as Error).message));
  }
  async function getPeriods() {
    getAllPeriods()
      .then((periods) => setPeriods(periods))
      .catch((error) => toast.error((error as Error).message));
  }

  useEffect(() => {
    getSessions();
    getPeriods();
  }, []);

  async function handleActivateSession(sessionId: string) {
    await activateSession(sessionId)
      .then((message) => {
        toast.success(message);
        getSessions();
      })
      .catch((error) => toast.error((error as Error).message));
  }

  async function handleAddSession() {
    if (!newSessionName.trim()) return;
    await addNewSession(newSessionName)
      .then((message) => {
        toast.success(message);
        setIsAddSessionDialogOpen(false);
        setNewSessionName("");
        getSessions();
      })
      .catch((error) => toast.error((error as Error).message));
  }

  function handleEditSession(session: Session) {
    setEditingSession(session);
    setEditSessionName(session.name);
    setIsEditSessionDialogOpen(true);
  }

  async function handleUpdateSession() {
    if (!editingSession || !editSessionName.trim()) return;
    await editSession(editingSession._id, editSessionName)
      .then((message) => {
        toast.success(message);
        setIsEditSessionDialogOpen(false);
        setEditingSession(null);
        setEditSessionName("");
        getSessions();
      })
      .catch((error) => toast.error((error as Error).message));
  }

  async function handleActivatePeriod(periodId: string) {
    await activatePeriod(periodId)
      .then((message) => {
        toast.success(message);
        getPeriods();
      })
      .catch((error) => toast.error((error as Error).message));
  }

  async function handleAddPeriod() {
    if (!newPeriodName.trim()) return;
    await addNewPeriod(newPeriodName)
      .then((message) => {
        toast.success(message);
        setIsAddPeriodDialogOpen(false);
        setNewPeriodName("");
        getPeriods();
      })
      .catch((error) => toast.error((error as Error).message));
  }

  function handleEditPeriod(periodId: Period) {
    setEditingPeriod(periodId);
    setEditPeriodName(periodId.name);
    setIsEditPeriodDialogOpen(true);
  }

  async function handleUpdatePeriod() {
    if (!editingPeriod || !editPeriodName.trim()) return;
    await editPeriod(editingPeriod._id, editPeriodName)
      .then((message) => {
        toast.success(message);
        setIsEditPeriodDialogOpen(false);
        setEditingPeriod(null);
        setEditPeriodName("");
        getPeriods();
      })
      .catch((error) => toast.error((error as Error).message));
  }
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Tabs defaultValue="session">
        <TabsList className="bg-white">
          <TabsTrigger value="session">Academic Sessions</TabsTrigger>
          <TabsTrigger value="period">Academic Semester</TabsTrigger>
        </TabsList>
        <TabsContent value="session">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Academic Sessions
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your institution's academic sessions (e.g., 2025/2026).
              </p>
            </div>

            <Dialog
              open={isAddSessionDialogOpen}
              onOpenChange={setIsAddSessionDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4" />
                  Session
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Session</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new academic session.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="session-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="session-name"
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      placeholder="e.g., 2028/2029"
                      className="col-span-3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddSession();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="flex gap-x-4">
                  <DialogClose>Cancel</DialogClose>
                  <Button
                    type="button"
                    onClick={handleAddSession}
                    disabled={!newSessionName.trim()}
                  >
                    Add Session
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {sessions.map((session, i) => (
              <Card
                key={i}
                className="border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {session.name}
                      </h3>
                      {session.isActive && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={session.isActive}
                          onCheckedChange={() =>
                            handleActivateSession(session._id)
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm text-gray-600">
                          {session.isActive ? "Active" : "Set Active"}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSession(session)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit session</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog
            open={isEditSessionDialogOpen}
            onOpenChange={setIsEditSessionDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Session</DialogTitle>
                <DialogDescription>
                  Update the name for this academic session.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-session-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-session-name"
                    value={editSessionName}
                    onChange={(e) => setEditSessionName(e.target.value)}
                    className="col-span-3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateSession();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditSessionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateSession}
                  disabled={!editSessionName.trim()}
                >
                  Update Session
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {sessions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-900 text-lg">
                No academic sessions found.
              </p>
              <p className="text-gray-900 text-sm mt-1">
                Click "+ Session" to create your first session.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="period">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Academic Semester
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your institution's academic periods (e.g., 1st Semester).
              </p>
            </div>

            <Dialog
              open={isAddPeriodDialogOpen}
              onOpenChange={setIsAddPeriodDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4" />
                  Semester
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Semester</DialogTitle>
                  <DialogDescription>
                    Enter the name for the new academic semester.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="period-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="period-name"
                      value={newPeriodName}
                      onChange={(e) => setNewPeriodName(e.target.value)}
                      placeholder="e.g., 1st Semester"
                      className="col-span-3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddPeriod();
                        }
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="flex gap-x-4">
                  <DialogClose>Cancel</DialogClose>
                  <Button
                    type="button"
                    onClick={handleAddPeriod}
                    disabled={!newPeriodName.trim()}
                  >
                    Add Semester
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {periods.map((period, i) => (
              <Card
                key={i}
                className="border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {period.name}
                      </h3>
                      {period.isActive && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={period.isActive}
                          onCheckedChange={() =>
                            handleActivatePeriod(period._id)
                          }
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <span className="text-sm text-gray-600">
                          {period.isActive ? "Active" : "Set Active"}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPeriod(period)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="sr-only">Edit Semester</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog
            open={isEditPeriodDialogOpen}
            onOpenChange={setIsEditPeriodDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Semester</DialogTitle>
                <DialogDescription>
                  Update the name for this academic semester.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-period-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-period-name"
                    value={editPeriodName}
                    onChange={(e) => setEditPeriodName(e.target.value)}
                    className="col-span-3"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdatePeriod();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditPeriodDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdatePeriod}
                  disabled={!editPeriodName.trim()}
                >
                  Update Semester
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {periods.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-900 text-lg">
                No academic semester found.
              </p>
              <p className="text-gray-900 text-sm mt-1">
                Click "+ Semester" to create your first semester.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
