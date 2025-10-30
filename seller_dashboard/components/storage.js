export function read(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
}

export function write(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function findById(key, id) {
    return read(key).find(x => x.id === id);
}

export function saveOrUpdate(key, item) {
    const arr = read(key);
    const index = arr.findIndex(x => x.id === item.id);

    if(index >= 0) {
        arr[index] = item;
    } else {
        arr.push(item);
    }

    write(key, arr);
}

export function removeById(key, id) {
    const arr = read(key).filter(x => x.id !== id);
    write(key, arr);
}