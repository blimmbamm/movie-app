import { json } from "react-router-dom";

const HEADER = {
  "Content-Type": "application/json",
};

const BACKEND_URL =
  "http://movie-app-tmdb-proxy-env-1.eba-q2wpn7ua.us-east-1.elasticbeanstalk.com";

async function fetchTmdbData(url, method, searchParams, body) {
  const tmdbUrl = new URL(url);

  for (const key in searchParams) {
    tmdbUrl.searchParams.append(key, searchParams[key]);
  }

  // tmdbUrl.searchParams.append("api_key", API_KEY);

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, method, searchParams, body }),
  });

  if (!response.ok) {
    // throw new Error("response is not ok");
    throw json({ message: "Response is not ok" }, { status: response.status });
  }

  const data = await response.json();
  console.log(response.status);

  return { data };
}

export default fetchTmdbData;
