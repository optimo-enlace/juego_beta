function startGame() {
            window.location.href = 'game.html';
        }

        function showInstructions() {
            document.getElementById('instructionsModal').style.display = 'flex';
        }

        function showCredits() {
            document.getElementById('creditsModal').style.display = 'flex';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }