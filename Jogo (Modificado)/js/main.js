document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startMessage = document.getElementById('start-message');
    const playerNameInput = document.getElementById('player-name');

    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            localStorage.setItem('playerName', playerName);
            startMessage.style.display = 'none';

            //inicializa o jogo
            const game = new GameEngine();
        } else {
            alert('Por favor, insira o nome do jogador.');
        }
    });
});
