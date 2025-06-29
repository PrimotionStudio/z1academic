"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen, Play, Check, X, Clock } from "lucide-react";
import Link from "next/link";
import { Book, Video } from "@/types/Resource";
import {
  approveBook,
  approveVideo,
  deleteBook,
  deleteVideo,
  getAllUnpublishedBooks,
  getAllUnpublishedVideos,
} from "@/functions/Resource";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function RequestsPage() {
  const [requestedBooks, setRequestedBooks] = useState<Book[]>([]);
  const [requestedVideos, setRequestedVideos] = useState<Video[]>([]);

  useEffect(() => {
    async function fetchData() {
      await Promise.all([
        getAllUnpublishedBooks()
          .then((books) => setRequestedBooks(books))
          .catch((error) => toast.error((error as Error).message)),
        getAllUnpublishedVideos()
          .then((videos) => setRequestedVideos(videos))
          .catch((error) => toast.error((error as Error).message)),
      ]);
    }
    fetchData();
  }, []);

  const handleApproveBook = (bookId: string) => {
    approveBook(bookId)
      .then(() =>
        getAllUnpublishedBooks().then((books) => setRequestedBooks(books)),
      )
      .catch((error) => toast.error((error as Error).message));
  };

  const handleRejectBook = (bookId: string) => {
    deleteBook(bookId)
      .then(() =>
        getAllUnpublishedBooks().then((books) => setRequestedBooks(books)),
      )
      .catch((error) => toast.error((error as Error).message));
  };

  const handleApproveVideo = (videoId: string) => {
    approveVideo(videoId)
      .then(() =>
        getAllUnpublishedVideos().then((videos) => setRequestedVideos(videos)),
      )
      .catch((error) => toast.error((error as Error).message));
  };

  const handleRejectVideo = (videoId: string) => {
    deleteVideo(videoId)
      .then(() =>
        getAllUnpublishedVideos().then((videos) => setRequestedVideos(videos)),
      )
      .catch((error) => toast.error((error as Error).message));
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/me/resources" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Resources
              </Link>
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Resource Requests
          </h1>
          <p className="text-gray-600 text-lg">
            Review and manage resource requests from lecturers
          </p>
        </div>

        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white">
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Book Requests ({requestedBooks.length})
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Video Requests ({requestedVideos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books">
            <div className="space-y-6">
              {requestedBooks.length === 0 ? (
                <Card className="bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No book requests
                    </h3>
                    <p className="text-gray-600 text-center">
                      There are currently no pending book requests from
                      lecturers.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                requestedBooks.map((book, i) => (
                  <Card key={i} className="bg-white">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {book.title}
                          </CardTitle>
                          <CardDescription className="text-base mb-3">
                            by {book.author}
                          </CardDescription>
                          <p className="text-gray-600 mb-4">
                            {book.shortDescription}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">
                              {book.department.name}
                            </Badge>
                            <Badge
                              variant={
                                book.publishedStatus === "published"
                                  ? "default"
                                  : "secondary"
                              }
                              className="flex items-center gap-1"
                            >
                              {book.publishedStatus === "published" ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Approved
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                            </Badge>
                          </div>

                          <div className="text-sm text-gray-500">
                            <p>Requested by: {book.requestedBy?.fullName}</p>
                            <p>Date: {formatDate(book.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {book.publishedStatus === "unpublished" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveBook(book._id)}
                                className="flex items-center gap-2"
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectBook(book._id)}
                                className="flex items-center gap-2 bg-red-700"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="space-y-6">
              {requestedVideos.length === 0 ? (
                <Card className="bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Play className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No video requests
                    </h3>
                    <p className="text-gray-600 text-center">
                      There are currently no pending video requests from
                      lecturers.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                requestedVideos.map((video) => (
                  <Card key={video._id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {video.title}
                          </CardTitle>
                          <CardDescription className="text-base mb-3">
                            {video.course.name} ({video.course.code})
                          </CardDescription>
                          <p className="text-gray-600 mb-4">
                            {video.shortDescription}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">
                              Level {video.course.level}
                            </Badge>
                            <Badge variant="outline">
                              {video.course.departmentId.name}
                            </Badge>
                            <Badge
                              variant={
                                video.publishedStatus === "published"
                                  ? "default"
                                  : "secondary"
                              }
                              className="flex items-center gap-1"
                            >
                              {video.publishedStatus === "published" ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Approved
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </>
                              )}
                            </Badge>
                          </div>

                          <div className="text-sm text-gray-500">
                            <p>Requested by: {video.requestedBy?.fullName}</p>
                            <p>Date: {formatDate(video.createdAt)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {video.publishedStatus === "unpublished" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApproveVideo(video._id)}
                                className="flex items-center gap-2"
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectVideo(video._id)}
                                className="flex items-center gap-2 bg-red-700"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
