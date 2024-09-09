import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getAll = () => {
  return axios.get(baseUrl);
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

const personService = {
  getAll,
  create,
  update,
  remove
};

export default personService;