'use client';

import { useState, useRef } from "react";
import { DVDDoc } from "../lib/types";
import Button from "../components/Button";
import Title from "../components/Title";
import Input from "../components/Input";

import { SlArrowUpCircle } from "react-icons/sl";
import { SlArrowDownCircle } from "react-icons/sl";

// Add 'DVD-' prefix to the DVD name and 0s if needed
import { fixName } from "../lib/functions";

export default function BrowseDVDs() {

  const [fiveDvds, setFiveDvds] = useState<DVDDoc[] | null>(null);
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(2);

  const dvdName = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    setMessage("");
    setFiveDvds(null);

    const nameOK = fixName(dvdName.current!.value);

    if (!nameOK) {
      setMessage("Error: Please enter a valid DVD name.");
      return;
    }

    dvdName.current!.value = nameOK;

    try {
      const response = await fetch("/api/browse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dvdName: dvdName.current?.value }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData.error || "Unknown error occurred.");
        return;
      }

      const data = await response.json();
      setFiveDvds(data.dvds);
    } catch (err) {
      console.error("Error fetching data:", err);
      setMessage("Failed to fetch data.");
    }
  };

  function changeIndex(index: number) {
    setActiveIndex(index);
  }

  function incrementIndexCollection() {
    const numericPart = parseInt(dvdName.current!.value.replace("DVD-", ""), 10) + 5;
    let newName = ""
    if (numericPart < 10) {
      newName = "DVD-" + "00" + String(numericPart);
    } else {
      newName = numericPart < 100 ? "DVD-" + "0" + String(numericPart) : "DVD-" + String(numericPart);
    }
    dvdName.current!.value = newName;
    handleSearch();
  }

  function decrementIndexcollection() {
    const numericPart = parseInt(dvdName.current!.value.replace("DVD-", ""), 10) - 5;
    let newName = ""
    if (numericPart < 10) {
      newName = "DVD-" + "00" + String(numericPart);
    } else {
      newName = numericPart < 100 ? "DVD-" + "0" + String(numericPart) : "DVD-" + String(numericPart);
    }
    dvdName.current!.value = newName;
    handleSearch();
  }

  return (
    <div data-id="browse-page"
      className="w-full h-full flex flex-col items-center justify-center p-4 space-y-5  text-[#86745C]">
      <div className="flex flex-col items-center justify-center ">
        <Title>Browse DVDs</Title>
        <div className="flex space-x-3">
          <Input reference={dvdName} placeHol="Enter DVD name" func={handleSearch} />
          <Button func={handleSearch}>
            Search DVD
          </Button>
        </div>
      </div>

      {message && <p>{message}</p>}

      {fiveDvds && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex  flex-col justify-center items-center">
            <SlArrowUpCircle
              onClick={decrementIndexcollection}
              className="text-2xl text-yellow-300 my-1 hover:cursor-crosshair hover:text-red-500" />
            <ul >
              {fiveDvds.map((dvd, index) => (
                <li
                  onClick={() => changeIndex(index)}
                  className={`flex justify-start items-center space-x-3 text-2xl hover:cursor-pointer
                    ${activeIndex === index ? "text-red-500" : "text-yellow-400"}`}
                  key={index}>
                  <strong>{dvd.name}</strong>
                  <p>{dvd.comment !== "comment" ? `(${dvd.comment})` : ""}</p>
                </li>
              ))}
            </ul>
            <SlArrowDownCircle
              onClick={incrementIndexCollection}
              className="text-2xl text-yellow-300 my-1 hover:cursor-crosshair hover:text-red-500" />
          </div>
          {/* List the contents of each DVD */}
          <div className="flex  flex-col">
            <ul className="mt-5">
              {fiveDvds[activeIndex].contents.map((item, index) => (
                <li
                  className="text-lg font-bold mb-1"
                  key={index}>
                  {item.type === "directory" ? "📁" : "📄"} {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>)
}