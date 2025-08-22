import { openDatabaseSync } from "expo-sqlite";

export const db = openDatabaseSync("shop.db");

export const setupDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      buying_price REAL,
      selling_price REAL
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      quantity INTEGER,
      selling_price REAL,
      total REAL,
      profit REAL,
      timestamp TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      start_time TEXT,
      end_time TEXT,
      opening_cash REAL,
      closing_cash REAL,
      expected_cash REAL,
      difference REAL
    );
  `);
};
