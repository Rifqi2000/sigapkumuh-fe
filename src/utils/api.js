import axios from 'axios';

export const fetchFilteredData = async (filters) => {
  // Hilangkan nilai kosong dari filters
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined && v !== '')
  );

  const query = new URLSearchParams(cleanFilters).toString();
  const res = await axios.get(`${process.env.REACT_APP_API_URL}?${query}`);
  return res.data;
};
