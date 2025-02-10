"use client";
import { useEffect, useState } from "react";
import { fetchDishes, fetchDishSuggestions } from "../services/api";
import Link from "next/link";
import { debounce } from "lodash";

export default function Home() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const limit = 10;

  useEffect(() => {
    const getDishes = async () => {
      try {
        setLoading(true);
        const data = await fetchDishes((page - 1) * limit, nameSearch, ingredientSearch);
        setDishes(data.dishes);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      } finally {
        setLoading(false);
      }
    };
    getDishes();
  }, [page, nameSearch, ingredientSearch]);

  const totalPages = Math.ceil(totalCount / limit);

  const fetchSuggestions = debounce(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const results = await fetchDishSuggestions(query);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  }, 300);

  const handleNameSearchChange = (e) => {
    const value = e.target.value;
    setNameSearch(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setNameSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      {/* Full-width Background */}
      <div
        className="absolute top-0 left-0 w-screen h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/bg.jpg)' }}
      />

      {/* Main Content */}
      <div className="relative p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-beige-300 to-white mb-6 text-center">
          Dish Explorer
        </h1>

        {/* Dish Name Search Input */}
        <div className="relative mb-6 w-full">
          <input
            type="text"
            placeholder="Search by dish name..."
            value={nameSearch}
            onChange={handleNameSearchChange}
            className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          />
          {showSuggestions && (
            <ul className="absolute left-0 right-0 mt-2 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto w-full">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-700"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ingredient Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by ingredient..."
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-600 rounded-lg text-white bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <p className="text-center text-gray-400">Loading dishes...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dishes.map((dish) => (
                <div
                  key={dish._id}
                  className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 hover:shadow-2xl"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    <Link href={`/dishes/${dish._id}`} className="hover:text-blue-600">
                      {dish.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-700 mt-1"><strong>Diet:</strong> {dish.diet}</p>
                  <p className="text-sm text-gray-700 mt-1"><strong>Prep Time:</strong> {dish.prep_time} mins</p>
                  <p className="text-sm text-gray-800 mt-2">
                    <strong>Ingredients:</strong> {dish.ingredients.join(", ")}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-all duration-300 ease-in-out"
              >
                ← Previous
              </button>
              <span className="text-lg font-medium text-white">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 hover:bg-blue-700 transition-all duration-300 ease-in-out"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}