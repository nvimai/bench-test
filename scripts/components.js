/**
 * Render a row of table
 * @param {object} transaction 
 */
function transRow(transaction) {
  if(transaction) {
    return `
      <tr>
        <td>${dateFormat(transaction.Date)}</td>
        <td>${transaction.Company}</td>
        <td>${transaction.Ledger}</td>
        <td class="has-text-right">${currencyFormat(transaction.Amount)}</td>
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
async function transComponent({data}) {
  try {
    getAllTransactions().then(transactions => {
      let sum = transactions.reduce((pre, cur) => pre + Number.parseFloat(cur.Amount), 0);
      document.getElementById('total').innerHTML = currencyFormat(sum);
    })
    
    return `
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Company</th>
            <th>Account</th>
            <th class="has-text-right" id="total"></th>
          </tr>
        </thead>
        <tbody>
          ${data?.transactions?.map((item) => transRow(item)).join('') || '<tr><td><i>Empty</i></td></tr>'}
        </tbody>
      </table>
    `;
  } catch (error) {
    return '<p>Something went wrong!!!</p>';
  }
}

/**
 * Render the pagination section
 * @param {object} params
 */
async function paginationComponent({currentPage}) {
  try {
    let data = await getData(1);
    return `
    <nav class="pagination is-centered is-small" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        ${
          [...Array(data.totalCount).keys()].map((idx) => {
            return `<li><a class="pagination-link ${(idx+1 === currentPage) ? 'is-current' : ''}" href="?page=${idx+1}" aria-label="Goto page ${idx+1}">${idx+1}</a></li>`
          }).join('')
        }
      </ul>
    </nav>
    `;
  }catch (error) {
    return ''
  }
}