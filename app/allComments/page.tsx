"use client";

import { useEffect, useState } from "react";
import Title from "../components/Title";

import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface DVDComment {
  name: string;
  comment: string;
}

export default function AllCommentsPage() {
  const [comments, setComments] = useState<DVDComment[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  const navigate = useRouter();

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch("/api/allComments");
        // The API answers 404 when no DVD has a comment: that's an empty list, not an error
        if (!response.ok && response.status !== 404) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setComments(data.dvds || []);
        setStatus("ok");
      } catch (error) {
        console.error("Error fetching comments:", error);
        setStatus("error");
      }
    }

    fetchComments();
  }, []);

  if (status !== "ok" || comments.length === 0) {
    return (
      <div
        data-id="comments-page"
        className="flex flex-col justify-center items-center">
        <Title>
          {status === "loading" ? "Loading..."
            : status === "error" ? "Could not load the comments."
              : "No DVD has a comment yet."}
        </Title>
      </div>
    )
  }

  return (
    <div
      data-id="comments-page"
      className="flex flex-col justify-center items-center">
      <Title>All DVD Comments</Title>
      <ul>
        {comments.map((dvd, index) => (
          <li
            onClick={() => navigate.push(`/oneDvd?name=${dvd.name}`)}
            key={index} className=" hover:cursor-pointer text-2xl text-[#86745C] p-2">
            <strong>{dvd.name}</strong>: {dvd.comment}
          </li>
        ))}
      </ul>

    </div>
  );
}
