import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { db } from "../db"; // make sure db = openDatabaseSync("shop.db")

export default function AddProduct() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id ? parseInt(params.id as string) : null;

  const [name, setName] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  // Load product data if editing
  useEffect(() => {
    const loadProduct = async () => {
      if (productId) {
        try {
          const rows = await db.getAllAsync("SELECT * FROM products WHERE id = ?;", [productId]);
          if (rows.length > 0) {
            const p = rows[0];
            setName(p.name);
            setBuyingPrice(p.buying_price.toString());
            setSellingPrice(p.selling_price.toString());
          }
        } catch (err) {
          console.error("Error loading product:", err);
        }
      }
    };
    loadProduct();
  }, [productId]);

  const saveProduct = async () => {
    if (!name || !buyingPrice || !sellingPrice) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }

    const buy = parseFloat(buyingPrice);
    const sell = parseFloat(sellingPrice);

    if (isNaN(buy) || isNaN(sell)) {
      Alert.alert("Validation Error", "Buying and selling prices must be numbers.");
      return;
    }

    try {
      if (productId) {
        // Update existing product
        await db.runAsync(
          "UPDATE products SET name = ?, buying_price = ?, selling_price = ? WHERE id = ?;",
          [name, buy, sell, productId]
        );
        Alert.alert("Success", "Product updated successfully");
      } else {
        // Insert new product
        await db.runAsync(
          "INSERT INTO products (name, buying_price, selling_price) VALUES (?, ?, ?);",
          [name, buy, sell]
        );
        Alert.alert("Success", "Product added successfully");
      }

      router.back(); // go back to products list
    } catch (err) {
      console.error("Error saving product:", err);
      Alert.alert("Error", "An error occurred while saving the product.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        {productId ? "Edit Product" : "Add New Product"}
      </Text>

      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 8, marginBottom: 15 }}
        placeholder="Enter product name"
      />

      <Text>Buying Price (TZS)</Text>
      <TextInput
        value={buyingPrice}
        onChangeText={setBuyingPrice}
        style={{ borderWidth: 1, padding: 8, marginBottom: 15 }}
        placeholder="Enter buying price"
        keyboardType="numeric"
      />

      <Text>Selling Price (TZS)</Text>
      <TextInput
        value={sellingPrice}
        onChangeText={setSellingPrice}
        style={{ borderWidth: 1, padding: 8, marginBottom: 20 }}
        placeholder="Enter selling price"
        keyboardType="numeric"
      />

      <Button title={productId ? "Update Product" : "Add Product"} onPress={saveProduct} />
    </View>
  );
}
