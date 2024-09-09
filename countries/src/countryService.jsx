import axios from 'axios';
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';
const apiKey = import.meta.env.VITE_SOME_KEY;

const getAll = () => {
  return axios.get(`${baseUrl}/all`);
};

const getWeather = (capital) => {
  return axios.get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${capital}`);
};

const create = (personObject) => {
  return axios.post(baseUrl, personObject);
};

const update = (id, personObject) => {
  return axios.put(`${baseUrl}/${id}`, personObject);
};

const remove = (id) => {
  console.log(id)
  return axios.delete(`${baseUrl}/${id}`)

};

const countryService = {
  getAll,
  create,
  update,
  remove,
  getWeather
};

export default countryService;