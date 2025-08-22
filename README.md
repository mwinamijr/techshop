# TechShop POS App

A simple **Point-of-Sale (POS) application** built with **React Native (Expo)** using **SQLite** for local storage.  
This app allows shop owners to track products, sales, profit, and manage daily cash sessions with automatic reconciliation.

---

## Features

- **Products Management**
  - Quick-sale buttons for products.
  - Tracks quantity, selling price, and profit automatically.

- **Dashboard**
  - Displays total sales and total profit for the current day.

- **Session Management**
  - Start and close daily sessions with opening and closing cash.
  - Automatically calculates expected cash and differences.

- **Reports**
  - View historical sessions with sales, cash, and profit summaries.

- **Offline-first**
  - Works fully offline using SQLite.

---

## Tech Stack

- **React Native / Expo**
- **Expo Router (app/tabs format)** for navigation
- **SQLite** (`expo-sqlite`) for local database
- **Hermes** JS engine support

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd shop-pos
