"use client";

import { useState, useRef } from "react";
import Button from "../components/Button";
import Title from "../components/Title";
import Input from "../components/Input";

interface SearchResult {
  name: string;
  path: string;
  size?: number;
}

interface DisplayResult {
  first: string;
  dvdName: string;
  last: string;
}


export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [newResults, setNewResults] = useState<DisplayResult[]>([]);
  const [message, setMessage] = useState("");
  const [checkUniqies, setCheckUniques] = useState(false);

  const query = useRef<HTMLInputElement>(null);

  const handleSearchClick = async () => {
    if (!query.current?.value.trim()) {
      setMessage("Please enter a search term.");
      return;
    }

    setMessage("Searching...");
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.current?.value.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setResults(result.results);
        //----------------
        const transformedArray: DisplayResult[] = result.results.map((item: SearchResult) => {
          const match = item.path.match(/(.*?\/)?(DVD-\d+)(\/.*)?/);
          if (!match) {
            throw new Error(`Invalid format: ${item}`);
          }
          const before = match[1]?.slice(0, -1) || ""; // Remove trailing "/" if present
          const dvdPart = match[2];
          const after = match[3]?.slice(1) || ""; // Remove leading "/" if present
          const veryLast = after.split("/").pop();
          return {
            first: before,
            dvdName: dvdPart,
            last: veryLast,
          };
        });

        if (checkUniqies) {
          const uniques: DisplayResult[] = [];
          transformedArray.forEach((item: DisplayResult) => {
            if (!uniques.some((uniqueItem: DisplayResult) => uniqueItem.last === item.last)) { uniques.push(item); }
          })
          setNewResults([...uniques]);
        } else {
          setNewResults([...transformedArray]);
        }

        setMessage(result.results.length > 0 ? "" : "No files found.");
      } else {
        setMessage(result.error || "Search failed.");
      }
    } catch (error) {
      console.error("Error searching files:", error);
      setMessage("An error occurred during the search.");
    }
  };

  const handleChange = () => {
    setCheckUniques(!checkUniqies);
    // handleSearchClick();
  };

  return (
    <div
      data-id="search-page"
      className=" flex w-full px-10 flex-col items-center justify-center m-auto mt-5">
      <div className="flex flex-col items-center justify-center space-x-5">
        <Title>
          File Search
        </Title>
        <Input reference={query} placeHol="String to search" func={handleSearchClick}>
        </Input>
        <div className="space-x-5 mt-3">
          <Button func={handleSearchClick}>
            Search
          </Button>
          <Button func={() => { setResults([]); query.current!.value = ""; setMessage("") }}>
            Clear
          </Button>
          <label>
            <input type="checkbox"
              checked={checkUniqies}
              onChange={handleChange}
            />
            Unique?
          </label>

        </div>
      </div>
      {message && <p>{message}</p>}

      {results.length === 0 && (
        <p className="mt-20 text-3xl font-bold ">For example, try: *Tesla*</p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-3xl my-2 font-bold text-[#CECAA7]">
            {checkUniqies ? "Unique results:" : "All"}
            <span className="ml-2 text-4xl">{newResults.length}</span>
          </h2>
          <ul
            data-id="search-results"
            className="flex flex-col items-center justify-center">
            {newResults.map((result, index) => (
              <li
                className="px-1 transform transition duration-500 hover:scale-125 hover:cursor-pointer hover:font-extrabold bg-[#514e32] text-white font-bold hover:p-3 flex"
                key={index}>
                <span className="mr-2 font-bold text-red-500 text-2xl">{result.dvdName}</span>
                <span>{result.last}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
