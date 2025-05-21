

import React, { useEffect, useState } from "react";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/book`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Fetch failed: ${res.status} - ${text}`);
        }
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("API Error:", err.message);
        setError(err.message);
      }
    };

    fetchBooks();
  }, [baseUrl]);

  return (
    <div>
      <h2>Book List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {books.map((book) => (
          <li key={book._id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
