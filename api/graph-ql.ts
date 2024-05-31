import { GRAPH_URL, QUERY_PROFILES } from "../constant";

const getData = async (query: string) => {
  console.log("🥝Querying", GRAPH_URL);

  try {
    const headers = {
      "content-type": "application/json",
    };
    const requestBody = {
      extension: {},
      operationName: "MyQuery",
      query: query,
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    };
    const response = await fetch(GRAPH_URL, options);
    const responseJson = await response.json();
    console.log("RESPONSE FROM GRAPH_URL REQUEST", responseJson?.data);
  } catch (error) {
    console.log("ERROR DURING GRAPH_URL REQUEST", error);
    throw error;
  }
};

getData(QUERY_PROFILES)
  .then(() => console.log("✅"))
  .catch((error) => {
    console.log("❌", error);
  });
