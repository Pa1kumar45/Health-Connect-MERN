export const getToken = (): string | null => {
  console.log('getToken');
  console.log(localStorage.getItem('token'));
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 