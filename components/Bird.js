import React from "react";
import { View } from "react-native";

export default function Bird(props) {
  const width = 50;
  const height = 50;
  const x = props.position[0];
  const y = props.position[1];

  return (
    <View
      style={{
        position: "absolute",
        width: width,
        height: height,
        backgroundColor: "yellow",
        borderRadius: 25,
        left: x,
        top: y,
      }}
    />
  );
}
