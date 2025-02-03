import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        Authorization: `your-auth-token-here`, // Temporary (Replace with dynamic token handling)
    },
});

export const fetchDishes = async (skip, name, ingredients) => {
    ingredients = ingredients.trim().replace(/\s+/g, ' ').split(' ').join(',')
    let query = "";
    if (skip) {
        query += `?skip=${skip}`
    }
    if (ingredients) {
        query = `?skip=0&ingredients=${ingredients}`
    }
    if (name) {
        query = `?skip=0&name=${name}`
    }
    if (name && ingredients) {
        query = `?skip=0&name=${name}&ingredients=${ingredients}`
    }
    const response = await API.get(`/dish${query}`);
    return response.data.data;
};
