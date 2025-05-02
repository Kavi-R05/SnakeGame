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

        if (isFood) {
          className += " food";
        }
        if (isSnake) {
          className += " snake";
        }
        if (isSnakeHead) {
          className += " snakeHead";
        }

        const cell = <div className={className} key={`${row}-${col}`}></div>;
        cellArray.push(cell);
      }
    }
    return cellArray;
  }
  const cells = Board();

  function gameOver() {
    setSnake(initialSnakePosition);
    setScore(0);
  }

  function updateGame() {
    if (
      snake[0].x < 0 ||
      snake[0].x >= totalGridSize ||
      snake[0].y < 0 ||
      snake[0].y >= totalGridSize
    ) {
      gameOver();
      return;
    }

    let isBit = snake
      .slice(1)
      .some((ele) => ele.x === snake[0].x && ele.y === snake[0].y);
    if (isBit) {
      gameOver();
      return;
    }

    let newSnake = [...snake];

    switch (direction) {
      case "LEFT":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y - 1 });
        break;
      case "RIGHT":
        newSnake.unshift({ x: newSnake[0].x, y: newSnake[0].y + 1 });
        break;
      case "UP":
        newSnake.unshift({ x: newSnake[0].x - 1, y: newSnake[0].y });
        break;
      case "DOWN":
        newSnake.unshift({ x: newSnake[0].x + 1, y: newSnake[0].y });
        break;
    }
    let isAteFood = newSnake[0].x === food.x && newSnake[0].y === food.y;
    if (isAteFood) {
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
    let xPosition = Math.floor(Math.random() * totalGridSize);
    let yPosition = Math.floor(Math.random() * totalGridSize);

    setFood({ x: xPosition, y: yPosition });
  }

  return (
    <div className="board-container">
      <div className="score" alt="score">
        Score: <span>{score}</span>
      </div>
      <div className="board">{cells}</div>
    </div>
  );
};

export default SnakeBoard;
