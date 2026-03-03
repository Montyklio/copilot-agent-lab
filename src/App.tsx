import { useBingoGame } from './hooks/useBingoGame';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { BingoModal } from './components/BingoModal';
import { NameCaptureModal } from './components/NameCaptureModal';
import { ConnectionsView } from './components/ConnectionsView';

function App() {
  const {
    gameState,
    board,
    winningSquareIds,
    showBingoModal,
    showNameCaptureModal,
    showConnectionsView,
    selectedSquareId,
    connections,
    startGame,
    handleSquareClick,
    handleNameSave,
    handleNameSkip,
    handleUnmarkSquare,
    cancelNameCapture,
    resetGame,
    dismissModal,
    openConnectionsView,
    closeConnectionsView,
    editConnection,
  } = useBingoGame();

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} />;
  }

  const selectedSquare = selectedSquareId !== null
    ? board.find((s) => s.id === selectedSquareId)
    : undefined;

  return (
    <>
      <GameScreen
        board={board}
        winningSquareIds={winningSquareIds}
        hasBingo={gameState === 'bingo'}
        onSquareClick={handleSquareClick}
        onReset={resetGame}
        onOpenConnections={openConnectionsView}
        connectionCount={connections.length}
      />
      {showBingoModal && (
        <BingoModal onDismiss={dismissModal} />
      )}
      {showNameCaptureModal && selectedSquare && (
        <NameCaptureModal
          promptText={selectedSquare.text}
          existingName={selectedSquare.personName}
          isMarked={selectedSquare.isMarked}
          onSave={handleNameSave}
          onSkip={handleNameSkip}
          onUnmark={selectedSquare.isMarked ? handleUnmarkSquare : undefined}
          onCancel={cancelNameCapture}
        />
      )}
      {showConnectionsView && (
        <ConnectionsView
          connections={connections}
          onClose={closeConnectionsView}
          onEditConnection={editConnection}
        />
      )}
    </>
  );
}

export default App;
