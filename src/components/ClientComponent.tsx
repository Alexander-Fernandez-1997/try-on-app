"use client";

import { useState } from "react";

export default function ClientComponent({
  onSubmit,
}: {
  onSubmit: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onSubmit(); // This will call the server-side logic passed from the server component
    setLoading(false);
  };

  return (
    <div>
      <h1>This is a mock test</h1>
      <button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  );
}
