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
      ${currentPage !== 1 ? `<a class="pagination-previous" href="?page=${currentPage-1}">Previous</a>` : ''}
      ${currentPage !== data.totalCount ? `<a class="pagination-next" href="?page=${currentPage+1}">Next page</a>` : ''}
      <ul class="pagination-list">
        ${currentPage !== 1 ? `<li><a class="pagination-link ${(currentPage === 1) ? 'is-current' : ''}" href="?page=1" aria-label="Goto page 1">1</a></li>` : ''}
        ${currentPage > 2 ? `<li><span class="pagination-link">&hellip;</span></li>` : ''}
        ${currentPage - 1 > 1 ? `<li><a class="pagination-link" href="?page=${currentPage-1}" aria-label="Goto page ${currentPage-1}">${currentPage-1}</a></li>` : ''}
        <li><a class="pagination-link is-current" href="?page=${currentPage}" aria-label="Goto page ${currentPage}">${currentPage}</a></li>
        ${currentPage + 1 <= data.totalCount ? `<li><a class="pagination-link" href="?page=${currentPage+1}" aria-label="Goto page ${currentPage+1}">${currentPage+1}</a></li>` : ''}
        ${currentPage < data.totalCount - 2 ? `<li><span class="pagination-link">&hellip;</span></li>` : ''}
        ${currentPage < data.totalCount - 1 ? `<li><a class="pagination-link ${(currentPage === data.totalCount) ? 'is-current' : ''}" href="?page=${data.totalCount}" aria-label="Goto page ${data.totalCount}">${data.totalCount}</a></li>` : ''}
      </ul>
    </nav>
    `;
  }catch (error) {
    return ''
  }
}