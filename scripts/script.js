document.addEventListener('DOMContentLoaded', () => {
  let root = document.getElementById('root');
  transComponent({root})
});

/**
 * Fetch data from REST api
 * @param {Number} page 
 */
function getData(page = 1) {
  return new Promise((resolve, reject) => {
    fetch(`https://resttest.bench.co/transactions/${page}.json`)
    .then(res => res.json())
    .then(res => resolve(res))
    .catch(error => reject(error))
  })
}

/**
 * Render a row of table
 * @param {Object} transaction 
 */
function transRow(transaction) {
  if(transaction) {
    return `
      <tr>
        <td>${transaction.Date}</td>
        <td>${transaction.Company}</td>
        <td>${transaction.Ledger}</td>
        <td>${transaction.Amount}</td>
      </tr>
    `;
  } else {
    return ''
  }
}

/**
 * Render transactions table
 * @param {object} params 
 */
async function transComponent({root}) {
  try {
    let data = await getData(1);
    const transTable = `
      <table class="table w-100">
        <thead>
          <tr>
            <th>Data</th>
            <th>Company</th>
            <th>Account</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${data.transactions.map((item) => transRow(item)).join('')}
        </tbody>
      </table>
    `;
    
    var div = document.createElement('div');
    div.innerHTML = transTable.trim();
    root.querySelector('.transactions').prepend(div);
  } catch (error) {

  }
}