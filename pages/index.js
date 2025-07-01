import { useState } from 'react';

const initialBoard = Array(9).fill(null);

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

export default function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerLine, setWinnerLine] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const winnerInfo = calculateWinner(board);
  const winner = winnerInfo?.winner;
  const line = winnerInfo?.line;

  const handleClick = (i) => {
    if (board[i] || winner || gameOver) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinnerLine(result.line);
    } else if (!hasAnyWinningPossibility(newBoard)) {
      setGameOver(true);
    }
  };

  const handleReset = () => {
    setBoard(initialBoard);
    setXIsNext(true);
    setWinnerLine(null);
    setGameOver(false);
  };

  const renderSquare = (i) => {
    const isWinningSquare = winnerLine?.includes(i);
    return (
      <button
        key={i}
        className={`w-20 h-20 border border-gray-400 text-2xl font-bold ${isWinningSquare ? 'bg-green-300' : ''}`}
        onClick={() => handleClick(i)}
      >
        {board[i]}
      </button>
    );
  };

  const renderStatus = () => {
    if (winner) return `Winner: ${winner}`;
    if (gameOver || board.every(Boolean)) return "It's a Draw!";
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Robert's Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-1">
        {board.map((_, i) => renderSquare(i))}
      </div>
      <p className="mt-4 text-xl">{renderStatus()}</p>
      {(winner || gameOver || board.every(Boolean)) && (
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleReset}>
          Play Again
        </button>
      )}
    </div>
  );
}

function calculateWinner(squares) {
  for (let [a, b, c] of winningCombos) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function hasAnyWinningPossibility(squares) {
  const players = ['X', 'O'];
  for (let player of players) {
    for (let [a, b, c] of winningCombos) {
      const line = [squares[a], squares[b], squares[c]];
      const canStillWin = line.filter(s => s === null || s === player).length === 3 ||
                          (line.filter(s => s === player).length === 2 && line.includes(null));
      if (canStillWin) return true;
    }
  }
  return false;
}
