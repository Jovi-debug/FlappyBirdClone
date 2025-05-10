import { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet, ImageBackground, TouchableWithoutFeedback } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Physics from "../components/physics";
import Bird from "../components/Bird";
import Pipe from "../components/Pipe";

export default function GameScreen({ navigation }) {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);

  const engineRef = useRef(null);

  // Event handling (game over or score)
  const onEvent = (event) => {
    if (event === "game-over") {
      setGameOver(true);
      setRunning(false);  // Stop the game
    } else if (event.type === "score") {
      setScore((prev) => prev + 1);  // Increase score
    }
  };

  // Handle touch event (bird jump)
  const handleTouch = () => {
    if (engineRef.current) {
      // Dispatch a "flap" event to make the bird jump
      engineRef.current.dispatch({ type: "flap" });
    }
  };

  useEffect(() => {
    // Ensures the game engine is fully initialized before trying to access entities
    if (engineRef.current && engineRef.current.entities) {
      const bird = engineRef.current.entities.bird;
      if (bird) {
        console.log("Bird entity is available:", bird);
      }
    }
  }, [engineRef.current]); // Runs every time the engineRef changes

  return (
    <ImageBackground
      source={require("../assets/bgImg.jpg")}
      style={styles.background}
    >
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Button
            title="Restart"
            onPress={() => {
              setGameOver(false);
              setScore(0);
              setRunning(true);
            }}
          />
          <Button
            title="Back to Home"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      ) : (
        // Make the whole game screen touchable to detect jumps
        <TouchableWithoutFeedback onPress={handleTouch}>
          <View style={styles.game}>
            <GameEngine
              ref={engineRef}
              style={styles.game}
              entities={{
                bird: { position: [50, 300], velocity: 0, renderer: <Bird /> },
                pipe1Top: {
                  position: [300, 0],
                  height: 200,
                  color: "green",
                  renderer: <Pipe />,
                },
                pipe1Bottom: {
                  position: [300, 400],
                  height: 400,
                  color: "green",
                  renderer: <Pipe />,
                },
                pipe2Top: {
                  position: [500, 0],
                  height: 150,
                  color: "green",
                  renderer: <Pipe />,
                },
                pipe2Bottom: {
                  position: [500, 450],
                  height: 350,
                  color: "green",
                  renderer: <Pipe />,
                },
              }}
              systems={[Physics]}
              onEvent={onEvent}
              running={running}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  game: {
    width: "100%",
    height: "100%",
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  gameOverText: {
    fontSize: 36,
    color: "white",
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 24,
    color: "white",
    marginBottom: 40,
  },
});