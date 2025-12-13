const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface SweetsResponse {
  success: boolean;
  count: number;
  data: Sweet[];
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Get authorization header with token
 */
const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (
    username: string,
    email: string,
    password: string,
    role?: string
  ) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });
    return handleResponse<AuthResponse>(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(response);
  },
};

// Sweets API
export const sweetsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      headers: getAuthHeader(),
    });
    return handleResponse<SweetsResponse>(response);
  },

  search: async (params: {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.name) searchParams.append("name", params.name);
    if (params.category) searchParams.append("category", params.category);
    if (params.minPrice !== undefined)
      searchParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice !== undefined)
      searchParams.append("maxPrice", params.maxPrice.toString());

    const response = await fetch(
      `${API_BASE_URL}/sweets/search?${searchParams}`,
      {
        headers: getAuthHeader(),
      }
    );
    return handleResponse<SweetsResponse>(response);
  },

  create: async (sweet: Omit<Sweet, "_id" | "createdAt" | "updatedAt">) => {
    const response = await fetch(`${API_BASE_URL}/sweets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(sweet),
    });
    return handleResponse<{ success: boolean; message: string; data: Sweet }>(
      response
    );
  },

  update: async (id: string, sweet: Partial<Sweet>) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(sweet),
    });
    return handleResponse<{ success: boolean; message: string; data: Sweet }>(
      response
    );
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean; message: string }>(response);
  },

  purchase: async (id: string, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<{ success: boolean; message: string; data: Sweet }>(
      response
    );
  },

  restock: async (id: string, quantity: number) => {
    const response = await fetch(`${API_BASE_URL}/sweets/${id}/restock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ quantity }),
    });
    return handleResponse<{ success: boolean; message: string; data: Sweet }>(
      response
    );
  },
};
