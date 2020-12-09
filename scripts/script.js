document.addEventListener('DOMContentLoaded', () => {
  let page = Number.parseInt(document.location.search?.split('page=')[1] || '1');
  controller({
    root: document.getElementById('root'), 
    page
  });
});

async function controller({root, page}) {
  let data = await getData(page);
  render(data);
  // getData()

  async function render(data) {
    root.querySelector('.transactions').innerHTML = (await transComponent({data})).trim();
    root.querySelector('.paginations').innerHTML = (await paginationComponent({data, currentPage: page})).trim();
  }
}

/**
 * Fetch data from REST api
 * @param {Number} page 
 */
function getData(page) {
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
function transComponent({data}) {
  try {
    return `
      <table class="table">
        <thead>
          <tr>
            <th>Date</th>
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
  } catch (error) {
    return '';
  }
}

async function paginationComponent({data, currentPage}) {
  try {
    return `
    <nav class="pagination is-centered is-small" role="navigation" aria-label="pagination">
      <ul class="pagination-list">
        ${
          [...Array(data.totalCount).keys()].map((idx) => {
            return `<li><a class="pagination-link ${(idx+1 === currentPage) ? 'is-current' : ''}" href="/?page=${idx+1}" aria-label="Goto page ${idx+1}">${idx+1}</a></li>`
          }).join('')
        }
      </ul>
    </nav>
    `;
  }catch (error) {
    return ''
  }
}
/**
 * Format the date string
 * @param {string} date 
 */
function dateFormat(date) {
  let options = { year: 'numeric', month: 'short', day: '2-digit' };
  let _date  = new Date(date);
  return _date.toLocaleDateString("en-US", options)
}

/**
 * Format the currency string
 * @param {String} value 
 * @param {String} currency 
 */
function currencyFormat(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}