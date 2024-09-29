import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const TabStructure = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="Home" />
    </Tabs>
  );
};

export default TabStructure;

const styles = StyleSheet.create({});
