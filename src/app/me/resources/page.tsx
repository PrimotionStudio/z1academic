"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Play,
  Plus,
  FileText,
  Search,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { AddBookDialog } from "@/components/add-book-dialog";
import { AddVideoDialog } from "@/components/add-video-dialog";
import { Book, InputBook, InputVideo, Video } from "@/types/Resource";
import {
  addNewBook,
  addNewVideo,
  getAllBooks,
  getAllVideos,
} from "@/functions/Resource";
import { toast } from "sonner";

export default function ResourcesPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState(false);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Get unique departments and courses for filter options
  const departments = useMemo(() => {
    const bookDepts = books.map((book) => book.department);
    const videoDepts = videos.map((video) => video.course.departmentId);
    const allDepts = [...bookDepts, ...videoDepts];
    const uniqueDepts = allDepts.filter(
      (dept, index, self) =>
        index === self.findIndex((d) => d._id === dept._id),
    );
    return uniqueDepts;
  }, [books, videos]);

  const courses = useMemo(() => {
    return videos
      .map((video) => video.course)
      .filter(
        (course, index, self) =>
          index === self.findIndex((c) => c._id === course._id),
      );
  }, [videos]);

  // Filter and search logic
  const filteredResources = useMemo(() => {
    let filteredBooks = books;
    let filteredVideos = videos;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.shortDescription.toLowerCase().includes(query),
      );
      filteredVideos = filteredVideos.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.shortDescription.toLowerCase().includes(query) ||
          video.course.name.toLowerCase().includes(query) ||
          video.course.code.toLowerCase().includes(query),
      );
    }

    // Apply department filter
    if (selectedDepartment !== "all") {
      filteredBooks = filteredBooks.filter(
        (book) => book.department._id === selectedDepartment,
      );
      filteredVideos = filteredVideos.filter(
        (video) => video.course.departmentId._id === selectedDepartment,
      );
    }

    // Apply course filter
    if (selectedCourse !== "all") {
      filteredVideos = filteredVideos.filter(
        (video) => video.course._id === selectedCourse,
      );
    }

    // Apply type filter
    if (selectedType === "books") {
      filteredVideos = [];
    } else if (selectedType === "videos") {
      filteredBooks = [];
    }

    return { books: filteredBooks, videos: filteredVideos };
  }, [
    books,
    videos,
    searchQuery,
    selectedDepartment,
    selectedCourse,
    selectedType,
  ]);

  useEffect(() => {
    async function fetchData() {
      await Promise.all([
        getAllBooks()
          .then((books) => setBooks(books))
          .catch((error) => toast.error((error as Error).message)),
        getAllVideos()
          .then((videos) => setVideos(videos))
          .catch((error) => toast.error((error as Error).message)),
      ]);
    }
    fetchData();
  }, []);

  const handleAddBook = async (book: InputBook) => {
    await addNewBook(book)
      .then(() => getAllBooks().then((books) => setBooks(books)))
      .catch((error) => toast.error((error as Error).message));
  };

  const handleAddVideo = async (video: InputVideo) => {
    await addNewVideo(video)
      .then(() => getAllVideos().then((videos) => setVideos(videos)))
      .catch((error) => toast.error((error as Error).message));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("all");
    setSelectedCourse("all");
    setSelectedType("all");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedDepartment !== "all" ||
    selectedCourse !== "all" ||
    selectedType !== "all";

  const totalResults =
    filteredResources.books.length + filteredResources.videos.length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Learning Resources
          </h1>
          <p className="text-gray-600 text-lg">
            Access books, videos, and educational materials for your courses
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={() => setIsAddBookOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>

          <Button
            onClick={() => setIsAddVideoOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Video
          </Button>

          <Button
            asChild
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Link href="/me/resources/requests">
              <FileText className="h-4 w-4" />
              View Requests
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Search & Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="books">Books Only</SelectItem>
                <SelectItem value="videos">Videos Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept, i) => (
                  <SelectItem key={i} value={dept._id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Course Filter */}
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course, i) => (
                  <SelectItem key={i} value={course._id}>
                    {course.name} ({course.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters and Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {totalResults} result{totalResults !== 1 ? "s" : ""}
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear filters
                </Button>
              )}
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedType !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Type: {selectedType}
                    <button
                      onClick={() => setSelectedType("all")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedDepartment !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Dept:{" "}
                    {
                      departments.find((d) => d._id === selectedDepartment)
                        ?.name
                    }
                    <button
                      onClick={() => setSelectedDepartment("all")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCourse !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Course:{" "}
                    {courses.find((c) => c._id === selectedCourse)?.code}
                    <button
                      onClick={() => setSelectedCourse("all")}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* No Results Message */}
        {totalResults === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}

        {/* Books Section */}
        {filteredResources.books.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Books</h2>
              <Badge variant="secondary">
                {filteredResources.books.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.books.map((book) => (
                <Card
                  key={book._id}
                  className="hover:shadow-lg transition-shadow bg-white"
                >
                  <CardHeader className="p-4">
                    <div className="aspect-[3/4] bg-gray-200 rounded-md mb-3 overflow-hidden">
                      <img
                        src={book.coverImage || "/placeholder.svg"}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      by {book.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {book.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {book.department.name}
                      </Badge>
                      <Button size="sm" asChild>
                        <a
                          href={book.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {filteredResources.videos.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Play className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Videos</h2>
              <Badge variant="secondary">
                {filteredResources.videos.length}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.videos.map((video) => (
                <Card
                  key={video._id}
                  className="hover:shadow-lg transition-shadow bg-white"
                >
                  <CardHeader className="p-4">
                    <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden relative">
                      <img
                        src={video.coverImage || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {video.course.name} ({video.course.code})
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {video.course.departmentId.name}: {video.course.level}{" "}
                        Level
                      </Badge>
                      <Button size="sm" asChild>
                        <a
                          href={video.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Watch
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Dialogs */}
      <AddBookDialog
        open={isAddBookOpen}
        onOpenChange={setIsAddBookOpen}
        onAddBook={handleAddBook}
      />

      <AddVideoDialog
        open={isAddVideoOpen}
        onOpenChange={setIsAddVideoOpen}
        onAddVideo={handleAddVideo}
      />
    </div>
  );
}
