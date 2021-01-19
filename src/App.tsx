import React, { useState, useRef, useCallback, useEffect } from "react";
import useBookSearch from "./useBookSearch";

export default function App() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    console.log("pageNumber : ", pageNumber);
  }, [pageNumber]);

  const { books, hasMore, loading, error } = useBookSearch(query, pageNumber);

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        // @ts-ignore: Object is possibly 'null'.
        observer.current.disconnect();
      }
      // @ts-ignore: Object is possibly 'null'.
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      // @ts-ignore: Object is possibly 'null'.
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  function handleSearch(e: any) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book.key}>
              {book.title}
            </div>
          );
        } else {
          return <div key={book.key}>{book.title}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </>
  );
}
