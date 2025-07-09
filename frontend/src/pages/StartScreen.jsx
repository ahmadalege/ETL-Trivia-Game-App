import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function StartScreen({ onStart }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        setCategories(data.categories);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    }
    fetchCategories();
  }, []);

  const handleStart = () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    onStart(selectedCategory);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg mt-16">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-[#FF6F3C]">
        Choose Your Quiz Category
      </h1>
      <select
        className="w-full p-4 border border-gray-300 rounded mb-8 text-lg"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">-- Select Category --</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button
        onClick={handleStart}
        className="w-full bg-[#00B8A9] hover:bg-[#009688] text-white py-4 rounded font-bold text-xl transition"
      >
        Start Quiz
      </button>
    </div>
  );
}
