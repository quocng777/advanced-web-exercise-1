import { useState } from "react";
import "./App.css";


function Square({ value, onSquareClick, winSquares, idx }) {
  const winIndex = winSquares?.findIndex((square) => square == idx);
  let isWinSquare = false;

  if (winIndex != undefined && winIndex !== -1) {
    isWinSquare = true;
  }

  return (
    <button
      className={`square ${isWinSquare ? "win-square" : undefined}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (currentMove >= 9 && !winner) {
    status = "Draw";
  } else if (winner) {
    status = "Winner: " + winner.winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((_, row) => {
          return (
            <div key={row} className="board-row">
              {Array(3)
                .fill(null)
                .map((_, index) => (
                  <Square
                    idx={row * 3 + index}
                    value={squares[row * 3 + index]}
                    onSquareClick={() => handleClick(row * 3 + index)}
                    winSquares={winner?.squares}
                  />
                ))}
            </div>
          );
        })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isAscOrder, setIsAscOrder] = useState(true);
  const [locations, setLocaltion] = useState([]);

  function handlePlay(nextSquares, move) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    let row = move % 3;
    let col = move - 3 * row;
    setLocaltion((prev) => {
      return [
        ...locations,
        {
          row,
          col,
        },
      ];
    });
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const handleOrderClick = () => {
    setIsAscOrder(!isAscOrder);
  };

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0 && move == currentMove) {
      description =
        "You are at move #" +
        move +
        ` at location (${locations[move - 1].row}, ${locations[move - 1].col})`;
      return (
        <li key={move}>
          <p> {description}</p>
        </li>
      );
    }
    if (move > 0) {
      description =
        "Go to move #" +
        move +
        ` at location (${locations[move - 1].row}, ${locations[move - 1].col})`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (!isAscOrder) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          currentMove={currentMove}
        />
      </div>
      <div className="game-info">
        <button onClick={handleOrderClick}>
          Sort by: {isAscOrder ? "ASC" : "DESC"}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        squares: [a, b, c],
      };
    }
  }
  return null;
}
