
type Method = "GET" | "POST" | "PUT" | "DELETE";

export const apiRequest = async (
    endpoint: string,
    method: Method = "GET",
    data?: any,
    headers?: HeadersInit
  ) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  
    try {
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...headers,
        },
       
      };
  
      // Check if the data is FormData, if so, don't set Content-Type
      if (data instanceof FormData) {
        requestOptions.body = data;
      } else if (data) {
        requestOptions.headers = {
          ...requestOptions.headers,
          "Content-Type": "application/json",
        };
        // requestOptions.body = JSON.stringify(data);
      }
  
      const response = await fetch(`${API_URL}${endpoint}`, requestOptions);
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }
  
      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || "Request failed");
    }
  };
  