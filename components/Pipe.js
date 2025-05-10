import React from "react";
import { View } from "react-native";

export default function Pipe(props) {
  const width = 60;
  const height = props.height;
  const x = props.position[0];
  const y = props.position[1];
  const color = props.color;

  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: color,
        width: width,
        height: height,
        left: x,
        top: y,
      }}
    />
  );
}
