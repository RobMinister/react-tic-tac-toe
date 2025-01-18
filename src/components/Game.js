import React, { useState } from 'react';

function Game() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);

    const calculateWinner = (squares) => {
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
        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const isBoardFull = (squares) => squares.every((square) => square !== null);

    const minimax = (squares, isMaximizing) => {
        const winner = calculateWinner(squares);
        if (winner === 'X') return -10;
        if (winner === 'O') return 10;
        if (isBoardFull(squares)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (!squares[i]) {
                    squares[i] = 'O';
                    const score = minimax(squares, false);
                    squares[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < squares.length; i++) {
                if (!squares[i]) {
                    squares[i] = 'X';
                    const score = minimax(squares, true);
                    squares[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const getBestMove = (currentBoard) => {
        let bestScore = -Infinity;
        let move = null;
        for (let i = 0; i < currentBoard.length; i++) {
            if (!currentBoard[i]) {
                const newBoard = [...currentBoard];
                newBoard[i] = 'O';
                const score = minimax(newBoard, false);
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const handleClick = (index) => {
        if (board[index] || calculateWinner(board) || !isPlayerTurn) return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setIsPlayerTurn(false);

        // Let the computer make its move
        setTimeout(() => {
            const winner = calculateWinner(newBoard);
            if (!winner && !isBoardFull(newBoard)) {
                const bestMove = getBestMove(newBoard);
                if (bestMove !== null) {
                    const updatedBoard = [...newBoard];
                    updatedBoard[bestMove] = 'O';
                    setBoard(updatedBoard);
                }
            }
            setIsPlayerTurn(true);
        }, 500);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
    };

    const renderSquare = (index) => (
        <button className="square" onClick={() => handleClick(index)}>
            {board[index]}
        </button>
    );

    const renderBoard = () => (
        <div className="board">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => renderSquare(index))}
        </div>
    );

    const winner = calculateWinner(board);
    const status = winner
        ? `Winner: ${winner}`
        : isBoardFull(board)
        ? 'Draw!'
        : '';

    return (
        <div className="game">
            <h1>Tic-Tac-Toe</h1>
            {status && <div className="status">{status}</div>}
            {renderBoard()}
            {(winner || isBoardFull(board)) && (
                <button className="play-again" onClick={resetGame}>
                    Play Again
                </button>
            )}
        </div>
    );
}

export default Game;
