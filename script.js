const priceElement = document.querySelector('.price-display .price');
const changeElement = document.querySelector('.price-display .change');
const openElement = document.getElementById('open');
const highElement = document.getElementById('high');
const lowElement = document.getElementById('low');
const positionList = document.getElementById('position-list');

let currentPrice = 45000.00; 
let positions = [];

function updatePrice() {
    const randomChange = (Math.random() * 0.002 - 0.001) * currentPrice; 
    const newPrice = currentPrice + randomChange;

    const percentageChange = (newPrice - currentPrice) / currentPrice * 100;
    
    if (percentageChange >= 0) {
        changeElement.classList.remove('negative');
        changeElement.classList.add('positive');
        changeElement.innerHTML = `(+${percentageChange.toFixed(2)}%)`;
    } else {
        changeElement.classList.remove('positive');
        changeElement.classList.add('negative');
        changeElement.innerHTML = `(${percentageChange.toFixed(2)}%)`;
    }

    priceElement.innerText = newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    
    if (newPrice > parseFloat(highElement.innerText.replace(/,/g, ''))) {
        highElement.innerText = newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    if (newPrice < parseFloat(lowElement.innerText.replace(/,/g, ''))) {
        lowElement.innerText = newPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    currentPrice = newPrice;
    updatePositions(); 
}

setInterval(updatePrice, 1000); 


function executeTrade(type) {
    const amount = parseFloat(document.getElementById('amount').value);
    const leverage = parseInt(document.getElementById('leverage').value);

    if (isNaN(amount) || amount <= 0) {
        alert("Noto'g'ri miqdor kiritildi!");
        return;
    }

    const trade = {
        id: Date.now(),
        type: type, 
        entryPrice: currentPrice,
        amount: amount,
        leverage: leverage,
        status: 'Ochiq'
    };

    positions.push(trade);
    alert(`${type} buyurtmasi ${amount}$ miqdorida (X${leverage}) narxida ${currentPrice.toFixed(2)}$ amalga oshirildi!`);
    
    document.querySelector('.no-position')?.remove(); 
    renderPositions();
}

function updatePositions() {
    positions.forEach(pos => {
        
        let pnl;
        if (pos.type === 'BUY') {
            pnl = (currentPrice - pos.entryPrice) * pos.amount / pos.entryPrice * pos.leverage;
        } else { 
            pnl = (pos.entryPrice - currentPrice) * pos.amount / pos.entryPrice * pos.leverage;
        }
        pos.pnl = pnl;
    });
    renderPositions();
}

function renderPositions() {
    positionList.innerHTML = '';
    
    if (positions.length === 0) {
        positionList.innerHTML = '<li class="no-position">Hozircha pozitsiyalar yo\'q.</li>';
        return;
    }

    positions.forEach(pos => {
        const pnlClass = pos.pnl >= 0 ? 'positive' : 'negative';
        const pnlText = pos.pnl ? pos.pnl.toFixed(2) + '$' : '0.00$';

        const li = document.createElement('li');
        li.innerHTML = `
            ${pos.type} | Kirish: ${pos.entryPrice.toFixed(2)}$ <br>
            Miqdor: ${pos.amount}$ (x${pos.leverage}) | P/L: <span class="${pnlClass}">${pnlText}</span>
        `;
        positionList.appendChild(li);
    });
}