export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function toJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = 'Erro na requisição';

    try {
      const data: { message?: string | string[] } = await response.json();
      if (Array.isArray(data.message)) {
        message = data.message.join(', ');
      } else if (data.message) {
        message = data.message;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return toJson<AuthResponse>(response);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return toJson<AuthResponse>(response);
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return toJson<AuthUser>(response);
}
