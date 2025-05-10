import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Physics from "../components/physics";
import Bird from "../components/Bird";
import Pipe from "../components/Pipe";
import { FontAwesome } from "@expo/vector-icons";  // Importing FontAwesome for icons

export default function GameScreen({ navigation }) {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(true);
  const [paused, setPaused] = useState(false);

  const engineRef = useRef(null);

  // Event handling (game over or score)
  const onEvent = (event) => {
    if (event === "game-over") {
      setGameOver(true);
      setRunning(false); // Stop the game
    } else if (event.type === "score") {
      setScore((prev) => prev + 1); // Increase score
    }
  };

  // Handle touch event (bird jump)
  const handleTouch = () => {
    if (engineRef.current) {
      // Dispatch a "flap" event to make the bird jump
      engineRef.current.dispatch({ type: "flap" });
    }
  };

  // Pause game logic
  const handlePause = () => {
    setPaused(true); // Set the game to paused state
  };

  const handleResume = () => {
    setPaused(false); // Resume the game
  };

  const handleHome = () => {
    navigation.navigate("Home"); // Navigate to home screen
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
    <ImageBackground source={require("../assets/bgImg.jpg")} style={styles.background}>
      {gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setGameOver(false);
              setScore(0);
              setRunning(true);
            }}
          >
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleHome}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : paused ? (
        // Paused screen
        <View style={styles.pauseMenu}>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={handleResume}>
            <Text style={styles.buttonText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleHome}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Game screen when running
        <TouchableWithoutFeedback onPress={handleTouch}>
          <View style={styles.game}>
            <GameEngine
              ref={engineRef}
              style={styles.game}
              entities={{
                bird: { position: [50, 300], velocity: 0, renderer: <Bird /> },
                pipe1Top: { position: [300, 0], height: 200, color: "green", renderer: <Pipe /> },
                pipe1Bottom: { position: [300, 400], height: 400, color: "green", renderer: <Pipe /> },
                pipe2Top: { position: [500, 0], height: 150, color: "green", renderer: <Pipe /> },
                pipe2Bottom: { position: [500, 450], height: 350, color: "green", renderer: <Pipe /> },
              }}
              systems={[Physics]}
              onEvent={onEvent}
              running={running}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
      
      {/* Pause button at top-right with an icon */}
      {!paused && (
        <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
          <FontAwesome name="pause" size={30} color="white" />
        </TouchableOpacity>
      )}
      
      {/* Score displayed in real-time at top-left */}
      <Text style={styles.scoreRealTime}>Score: {score}</Text>
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
    borderRadius: 10,
    padding: 20,
    margin: 20,
  },
  pauseMenu: {
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 36,
    color: "white",
    marginBottom: 20,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: 24,
    color: "white",
    marginBottom: 40,
  },
  score: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: 200,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  pauseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 30,
    padding: 10,
  },
  scoreRealTime: {
    position: "absolute",
    top: 50,
    left: 20,
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});
