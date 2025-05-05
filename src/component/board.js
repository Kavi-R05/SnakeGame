import React, { useState, useEffect } from "react";
import "./board.css";

const SnakeBoard = () => {
  const totalGridSize = 20;

  const initialSnakePosition = [
    { x: Math.floor(totalGridSize / 2), y: Math.floor(totalGridSize / 2) },
    { x: Math.floor(totalGridSize / 2), y: Math.floor(totalGridSize / 2) + 1 },
  ];

  const [food, setFood] = useState({ x: 5, y: 5 });
  const [snake, setSnake] = useState(initialSnakePosition);
  const [direction, setDirection] = useState("LEFT");
  const [score, setScore] = useState(0);

  function Board() {
    const cellArray = [];
    for (let row = 0; row < totalGridSize; row++) {
      for (let col = 0; col < totalGridSize; col++) {
        let className = "cell";

        let isFood = food.x === row && food.y === col;
        let isSnake = snake.some((ele) => ele.x === row && ele.y === col);
        let isSnakeHead = snake[0].x === row && snake[0].y === col;

        if (isFood) className += " food";
        if (isSnake) className += " snake";
        if (isSnakeHead) className += " snakeHead";

        cellArray.push(<div className={className} key={`${row}-${col}`}></div>);
      }
    }
    return cellArray;
  }

  function resetGame() {
    setSnake(initialSnakePosition);
    setScore(0);
    setDirection("LEFT");
    setFood({ x: 5, y: 5 });
  }

  function updateGame() {
    let newSnake = [...snake];
    let head = { ...newSnake[0] };

    switch (direction) {
      case "LEFT":
        head.y -= 1;
        break;
      case "RIGHT":
        head.y += 1;
        break;
      case "UP":
        head.x -= 1;
        break;
      case "DOWN":
        head.x += 1;
        break;
    }

    // Wrap around logic
    head.x = (head.x + totalGridSize) % totalGridSize;
    head.y = (head.y + totalGridSize) % totalGridSize;

    newSnake.unshift(head);

    // Check self-collision
    if (newSnake.slice(1).some((ele) => ele.x === head.x && ele.y === head.y)) {
      resetGame();
      return;
    }

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      eatFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  useEffect(() => {
    const interval = setInterval(updateGame, 200);
    return () => clearInterval(interval);
  }, [snake, direction]);

  function updateDirection(e) {
    let code = e.code;
    switch (code) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", updateDirection);
    return () => document.removeEventListener("keydown", updateDirection);
  }, [direction]);

  function eatFood() {
    let xPosition, yPosition;
    do {
      xPosition = Math.floor(Math.random() * totalGridSize);
      yPosition = Math.floor(Math.random() * totalGridSize);
    } while (snake.some((seg) => seg.x === xPosition && seg.y === yPosition)); // avoid placing on snake

    setFood({ x: xPosition, y: yPosition });
  }

  return (
    <div className="board-container">
      <div className="score" alt="score">
        Score: <span>{score}</span>
      </div>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
      <div className="board">{Board()}</div>
    </div>
  );
};

export default SnakeBoard;
