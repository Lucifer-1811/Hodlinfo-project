window.onload = async function() {
    try {
      const response = await fetch('http://localhost:3000/tickers');
      const data = await response.json();
      const table = document.getElementById('ticker-table');
  
      data.forEach((ticker, index) => {
        const row = document.createElement('tr');
  
        const cellIndex = document.createElement('td');
        cellIndex.textContent = index + 1;
        row.appendChild(cellIndex);
  
        const cellName = document.createElement('td');
        cellName.textContent = ticker.name;
        row.appendChild(cellName);
  
        const cellLast = document.createElement('td');
        cellLast.textContent = `₹ ${ticker.last.toLocaleString('en-IN')}`;
        row.appendChild(cellLast);
  
        const cellBuySell = document.createElement('td');
        cellBuySell.textContent = `₹ ${ticker.buy.toLocaleString('en-IN')} / ₹ ${ticker.sell.toLocaleString('en-IN')}`;
        row.appendChild(cellBuySell);
  
        const cellDifference = document.createElement('td');
        cellDifference.textContent = `${ticker.difference.toFixed(2)} %`;
        row.appendChild(cellDifference);
  
        const cellSavings = document.createElement('td');
        cellSavings.textContent = `₹ ${ticker.savings.toLocaleString('en-IN')}`;
        row.appendChild(cellSavings);
  
        table.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };