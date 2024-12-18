"use client";

import { useState, useRef, useEffect } from "react";

import { useSearchParams } from "next/navigation";

import { DirectoryItem } from "../lib/types";
import { DVDDoc } from "../lib/types";
import Button from "../components/Button";
import Title from "../components/Title";
import Input from "../components/Input";

// Add 'DVD-' prefix to the DVD name and 0s if needed
import { fixName } from "../lib/functions";

import { Suspense } from "react";

export default function DvdContentsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DvdContentsPage />
    </Suspense>
  );
}


function DvdContentsPage() {
  const [dvdData, setDvdData] = useState<DVDDoc | null>(null);
  const [message, setMessage] = useState("");

  const searchParams = useSearchParams();
  const property1 = searchParams.get("name");

  const initialVal = property1 ? property1 : null;

  const dvdName = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dvdName.current) {
      dvdName.current.value = initialVal || "";
      if (initialVal) {
        handleSearch();
      }
    }
  }, [initialVal]);

  // Function to handle the search for a DVD by name
  const handleSearch = async () => {
    setMessage("");
    setDvdData(null);

    const nameOK = fixName(dvdName.current!.value);

    if (!nameOK) {
      setMessage("Error: Please enter a valid DVD name.");
      return;
    }

    dvdName.current!.value = nameOK;

    try {
      const response = await fetch("/api/dvdByName", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: dvdName.current!.value }),
      });

      const result = await response.json();

      if (response.ok && result.exists) {
        setDvdData(result.dvd);

      } else {
        setMessage("Error: DVD not found.");
      }
    } catch (error) {
      console.error("Error fetching DVD contents:", error);
      setMessage("Error: while searching for the DVD.");
    }
  };


  // Recursive function to render the contents of the DVD
  const renderContents = (contents: DirectoryItem[]) => (
    <ul>
      {contents.map((item, index) => (
        <li
          className={`text-lg font-bold mb-1 ${item.type === "directory" ? "underline underline-offset-8" : ""}`}
          key={index}>
          {item.type === "directory" ? "📁" : "📄"} {item.name}
          {item.type === "directory" && item.contents && renderContents(item.contents)}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      data-id="oneDvd-page"
      className="w-full h-full flex flex-col items-center justify-center p-4 space-y-5  text-[#86745C]">
      <div className="flex flex-col items-center justify-center ">
        <Title>DVD Contents Viewer</Title>
        <Input reference={dvdName} placeHol="Enter DVD name" func={handleSearch} />

        <div className="flex items-center justify-center space-x-5 mt-3">
          <Button func={handleSearch}>
            Search DVD
          </Button>
        </div>

        {message && <p className={`text-2xl text-[#CECAA7] ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>{message}</p>}

      </div>

      {dvdData && (
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl mb-5 font-bold">Contents of: <span className="text-[#CECAA7]">{dvdData.name}</span></h2>
          {renderContents(dvdData.contents)}
        </div>
      )}
    </div>
  );
}
