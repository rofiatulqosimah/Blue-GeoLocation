import { openDB } from 'idb';

const DB_NAME = 'blue-geolocation-db';
const STORE_NAME = 'locations';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveLocation(data) {
  const db = await getDB();
  await db.add(STORE_NAME, data);
}

export async function getAllLocations() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function deleteLocation(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
