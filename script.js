class SlotMachine {
    constructor() {
        this.symbols = ['🍒', '🍋', '🍊', '🍉', '🍇', '💎', '7️⃣', '🎰'];
        this.slots = Array.from(document.querySelectorAll('.slot'));
        this.spinButton = document.getElementById('spinButton');
        this.autoSpinButton = document.getElementById('autoSpinButton');
        this.betAmountInput = document.getElementById('betAmount');
        this.balanceDisplay = document.getElementById('balance');
        this.resultDisplay = document.getElementById('result');
        
        this.balance = 100.00;
        this.isSpinning = false;
        this.autoSpinInterval = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        this.autoSpinButton.addEventListener('click', () => this.toggleAutoSpin());
        this.betAmountInput.addEventListener('change', () => this.validateBetAmount());
    }

    validateBetAmount() {
        let value = parseFloat(this.betAmountInput.value);
        if (value < 0.10) value = 0.10;
        if (value > 100.00) value = 100.00;
        this.betAmountInput.value = value.toFixed(2);
    }

    async spin() {
        if (this.isSpinning) return;

        const betAmount = parseFloat(this.betAmountInput.value);
        if (betAmount > this.balance) {
            alert('Saldo insuficiente!');
            return;
        }

        this.isSpinning = true;
        this.balance -= betAmount;
        this.updateBalance();
        this.resultDisplay.textContent = 'Girando...';
        this.resultDisplay.classList.remove('winning');

        // Start spinning all slots independently
        const spinPromises = this.slots.map((slot, index) => {
            return this.spinSlot(slot, 1000 + Math.random() * 1500);
        });

        // Wait for all slots to finish spinning
        const results = await Promise.all(spinPromises);
        
        // Check for wins
        const prize = this.checkWin();
        if (prize > 0) {
            const winAmount = betAmount * prize;
            this.balance += winAmount;
            this.resultDisplay.textContent = `Você ganhou! +R$ ${winAmount.toFixed(2)}`;
            this.resultDisplay.classList.add('winning');
        } else {
            this.resultDisplay.textContent = 'Tente novamente!';
        }

        this.updateBalance();
        this.isSpinning = false;
    }

    async spinSlot(slot, duration) {
        return new Promise(resolve => {
            slot.classList.add('spinning');
            
            const startTime = Date.now();
            const animate = () => {
                const currentTime = Date.now();
                const elapsed = currentTime - startTime;

                if (elapsed < duration) {
                    slot.textContent = this.getRandomSymbol();
                    requestAnimationFrame(animate);
                } else {
                    const finalSymbol = this.getRandomSymbol();
                    slot.textContent = finalSymbol;
                    slot.classList.remove('spinning');
                    resolve(finalSymbol);
                }
            };

            requestAnimationFrame(animate);
        });
    }

    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    checkWin() {
        let maxPrize = 0;

        // Check rows
        for (let row = 0; row < 3; row++) {
            const rowSlots = this.slots.slice(row * 4, (row + 1) * 4);
            const rowSymbols = rowSlots.map(slot => slot.textContent);
            if (rowSymbols.every(symbol => symbol === rowSymbols[0])) {
                maxPrize = Math.max(maxPrize, this.calculatePrize(rowSymbols[0]));
            }
        }

        // Check columns
        for (let col = 0; col < 4; col++) {
            const colSymbols = [
                this.slots[col].textContent,
                this.slots[col + 4].textContent,
                this.slots[col + 8].textContent
            ];
            if (colSymbols.every(symbol => symbol === colSymbols[0])) {
                maxPrize = Math.max(maxPrize, this.calculatePrize(colSymbols[0]));
            }
        }

        return maxPrize;
    }

    calculatePrize(symbol) {
        const prizes = {
            '🍒': 1,
            '🍋': 2,
            '🍊': 3,
            '🍉': 4,
            '🍇': 5,
            '💎': 50,
            '7️⃣': 100,
            '🎰': 500
        };
        return prizes[symbol] || 0;
    }

    toggleAutoSpin() {
        if (this.autoSpinInterval) {
            clearInterval(this.autoSpinInterval);
            this.autoSpinInterval = null;
            this.autoSpinButton.textContent = '🔄 Giro Automático';
            this.autoSpinButton.classList.remove('active');
        } else {
            this.autoSpinInterval = setInterval(() => {
                if (!this.isSpinning) this.spin();
            }, 3000);
            this.autoSpinButton.textContent = '⏹ Parar Auto Giro';
            this.autoSpinButton.classList.add('active');
        }
    }

    updateBalance() {
        this.balanceDisplay.textContent = this.balance.toFixed(2);
    }
}

// Initialize the slot machine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const slotMachine = new SlotMachine();
});