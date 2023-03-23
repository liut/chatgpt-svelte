export interface Response<T = any> {
  data: T;
  message: string | null;
  status: number;
}

export async function request<T = any>(uri: string, opt? = {}): Promise<Response<T>> {
  const resp = await fetch(uri, opt);
  if (resp.ok) {
    if (resp.status === 204) {
      return true;
    }
    const obj = await resp.json();
    return obj;
  }
  console.log('fetch fail', uri, opt, resp);
  if (resp.status === 401) {
    window.location.href = '/auth/login';
    return;
  }
  if (resp.status >= 500) {
    console.log(resp.text);
  }

  const result = await resp.json();
  if (result.message) {
    throw new Error(result.message);
  }
  const text = await resp.text();
  throw new Error(text);
}

export interface User {
  avatar?: string;
  name: string;
  uid?: string;
}

export async function me(): Promise<User> {
  const res = await request('/api/me');
  return res.data;
}

export interface Message {
  content: string;
  role?: string;
  id?: string;
}

export async function welcome(): Promise<Message> {
  const res = await request('/api/welcome');
  return res.data;
}
