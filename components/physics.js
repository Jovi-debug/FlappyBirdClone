import { Dimensions } from "react-native";

// Get screen height and width
const { width, height } = Dimensions.get("window");

// Adjust bird size
const birdSize = 50;

// Function to handle physics updates
export default function Physics(entities, { events, dispatch }) {
  const bird = entities.bird;

  // Apply gravity effect to bird's velocity and update its position
  bird.velocity += 0.6; // Adjusted gravity for slower fall
  bird.position[1] += bird.velocity; // Update position based on velocity

  // Handle bird flap (jump) triggered by touch event
  events.forEach(event => {
    if (event.type === "flap") {
      bird.velocity = -10; // Increased flap speed for a higher jump
    }
  });

  // Update pipe positions and check for collisions
  [entities.pipe1Top, entities.pipe1Bottom, entities.pipe2Top, entities.pipe2Bottom].forEach(pipe => {
    pipe.position[0] -= 2; // Pipe movement speed

    // Reset pipe when it moves offscreen
    if (pipe.position[0] < -60) {
      pipe.position[0] = 360; // Reset pipe to right side of screen
      if (pipe.position[1] === 0) {
        // Increase score when top pipe resets
        dispatch({ type: "score" });
      }
    }
  });

  // Collision detection (bird vs pipes)
  const birdX = bird.position[0];
  const birdY = bird.position[1];

  [entities.pipe1Top, entities.pipe1Bottom, entities.pipe2Top, entities.pipe2Bottom].forEach(pipe => {
    const pipeX = pipe.position[0];
    const pipeHeight = pipe.height;
    const pipeY = pipe.position[1];
    const pipeWidth = 60;

    // Check collision with pipes
    if (
      birdX + birdSize > pipeX &&
      birdX < pipeX + pipeWidth &&
      ((pipeY === 0 && birdY < pipeHeight) || (pipeY !== 0 && birdY + birdSize > pipeY))
    ) {
      dispatch("game-over");
    }
  });

  // Collision detection with the floor or ceiling
  if (birdY > height || birdY < 0) {
    dispatch("game-over");
  }

  return entities;
}
