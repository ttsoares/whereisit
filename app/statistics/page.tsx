'use client'

import { useState, useEffect } from "react";
import Title from "../components/Title";

export default function FileStatistics() {
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Fetch total file statistics from the API
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getDvds");
        const data = await response.json();

        setTotalFiles(data.totalFiles);
        const rounded = Math.round(data.totalSize)
        setTotalSize(rounded);
      } catch (error) {
        console.error("Error fetching file statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  function nFormatter(num: number, digits: number) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: " Kb" },
      { value: 1e6, symbol: " Mb" },
      { value: 1e9, symbol: " Gb" },
      { value: 1e12, symbol: " Tb" },
      { value: 1e15, symbol: " Pb" },
    ];
    // Remove trailing zeros from the string representation of a number
    // e.g. "100.00" -> "100"
    // e.g. "100.10" -> "100.1"
    // e.g. "100.01" -> "100.01"
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast(item => num >= item.value);
    return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
  }

  return (
    <div
      data-id="totals-page"
      className="w-full h-full flex flex-col items-center justify-center p-4 space-y-10 mt-20 text-[#86745C]" >
      <Title>Totals</Title>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <p className="text-4xl p-10">Number of files: <strong data-id="total-files">{totalFiles}</strong></p>
          <p className="text-4xl p-10">Sum of files sizes: <strong data-id="total-size"> {nFormatter(totalSize, 2)}</strong></p>
        </div>
      )}
    </div>
  );
}
