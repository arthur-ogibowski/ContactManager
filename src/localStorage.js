export const saveToLS = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
}

export const getFromLS = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}