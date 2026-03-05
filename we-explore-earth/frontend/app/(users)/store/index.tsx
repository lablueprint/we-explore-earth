import { Product } from "../../components/Store/types";
import React, { useState } from "react";
import { View, Text, ScrollView, Alert, Button } from "react-native";
import StoreItemCard from "../../components/Store/ItemCard";

export default function StorePage() {

  const [points, setPoints] = useState(500);

  const [products, setProducts] = useState<Product[]>([
    {
      name: "We Explore Earth T-Shirt",
      description: "Official project T-shirt",
      price: 100,
      inventory: 5,
    },
    {
      name: "VIP Event Pass",
      description: "Skip the line at our next event",
      price: 200,
      inventory: 2,
    },
    {
      name: "Sticker Pack",
      description: "Limited edition WEE stickers",
      price: 50,
      inventory: 10,
    },
  ]);

  function handlePurchase(index: number) {
    const product = products[index];

    if (product.inventory === 0) {
      Alert.alert("Out of stock!");
      return;
    }

    if (points < product.price) {
      Alert.alert("Not enough points!");
      return;
    }

    const updatedProducts = [...products];
    updatedProducts[index].inventory -= 1;

    setProducts(updatedProducts);
    setPoints(prev => prev - product.price);

    Alert.alert("Success!", `You bought ${product.name}`);
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Store
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Your Points: {points}
      </Text>

      {products.map((product, index) => (
        <StoreItemCard
          key={index}
          product={product}
          onPurchase={() => handlePurchase(index)}
        />
      ))}
    </ScrollView>
  );
}