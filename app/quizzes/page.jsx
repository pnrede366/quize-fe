"use client";

import { useEffect, useState } from "react";
import { notification } from "antd";
import Link from "next/link";
import { categoryAPI } from "../../utils/api";
import Input from "../../component/ui/Input";

export default function QuizzesPage() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to load categories",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(query)
      );
      setFilteredCategories(filtered);
    }
  };

  const getCategoryIcon = (name) => {
    const icons = {
      default: [
        "📚", "📝", "🎯", "🔬", "💡", "📈", "📖", "🧠", "🔎", "🧑‍💻", "📘", "🛠️", "✨"
      ][Math.floor(Math.random() * 13)],
    };
    const key = name.toLowerCase();
    return icons[key] || icons.default;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mb-4 text-6xl">📚</div>
          <p className="text-xl text-zinc-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-5xl font-bold text-zinc-100">Browse Quizzes</h1>
          <p className="text-lg text-zinc-400">Choose a category and start learning</p>
        </div>

        {/* Free Access Banner */}
        <div className="mb-8 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 p-6 text-center backdrop-blur-sm">
          <div className="mb-2 text-3xl">🎉</div>
          <h2 className="mb-2 text-xl font-bold text-zinc-100">
            Free Access - No Subscription Needed!
          </h2>
          <p className="text-zinc-300">
            These are community-generated quizzes. Play unlimited quizzes without premium subscription.
          </p>
        </div>

        {/* Search Box */}
        <div className="mb-8">
          <div className="mx-auto max-w-2xl">
            <Input
              type="text"
              placeholder="Search categories... (e.g., JavaScript, Python, Science)"
              value={searchQuery}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-center text-sm text-zinc-400">
              Found {filteredCategories.length} {filteredCategories.length === 1 ? "category" : "categories"}
            </p>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-8xl">📝</div>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">No Quizzes Yet</h2>
            <p className="mb-8 text-zinc-400">Be the first to generate a quiz!</p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white hover:bg-indigo-500"
            >
              Generate Quiz
            </Link>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-8xl">🔍</div>
            <h2 className="mb-4 text-2xl font-bold text-zinc-100">No Results Found</h2>
            <p className="mb-4 text-zinc-400">
              No categories match &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilteredCategories(categories);
              }}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                href={`/quizzes/${category._id}`}
                className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:scale-105 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative">
                  <div className="mb-4 text-6xl">{getCategoryIcon(category.name)}</div>
                  <h3 className="mb-2 text-xl font-bold text-zinc-100">{category.name}</h3>
                  {category.description && (
                    <p className="mb-4 text-sm text-zinc-400 line-clamp-2">{category.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                      {category.quizCount} {category.quizCount === 1 ? "quiz" : "quizzes"}
                    </span>
                    <span className="text-indigo-400 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

