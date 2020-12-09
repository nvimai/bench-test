document.addEventListener('DOMContentLoaded', () => {
  let params = new URLSearchParams(document.location.search);
  let page = Number.parseInt(params.get('page') || '1');
  controller({
    root: document.getElementById('root'), 
    page
  });
});

/**
 * Get data and render
 * @param {object} params
 */
async function controller({root, page}) {
  getData(page).then(data => {
    render(data);
  }).catch(error => {
    console.log(error)
    render({})
  });

  async function render(data) {
    root.querySelector('.transactions').innerHTML = (await transComponent({data})).trim();
    root.querySelector('.paginations').innerHTML = (await paginationComponent({currentPage: page})).trim();
  }
}

/**
 * Fetch data from REST api
 * @param {number} page 
 */
function getData(page = 1) {
  return new Promise((resolve, reject) => {
    try {
      fetch(`https://resttest.bench.co/transactions/${page}.json`)
      .then(async res => {
        if(!res.ok) {
          return reject('Not found')
        } else
        return resolve(await res.json())
      })
      .catch(error => reject(error))
    } catch(error) {
      reject(error)
    }
  })
}

/**
 * Get all transactions from REST api
 */

function getAllTransactions() {
  return new Promise((resolve, reject) => {
    try {
      // Get the first page to have the brief information
      fetch(`https://resttest.bench.co/transactions/1.json`)
      .then(async res => {
        let data = await res.json();
        let transactions = [...data.transactions];

        // Generate the array to fetch all pages
        let array = [...Array(data.totalCount-1).keys()].map(ele => ele + 2);

        // Fetch all pages and push them to data array
        Promise.all(
          array.map(page => {
            fetch(`https://resttest.bench.co/transactions/${page}.json`)
            .then(async item => {
              if(item.ok) {
                transactions.push(...(await item.json()).transactions);
              }
            })
          }))
        .then(() => {
          resolve(transactions)
        })
      })
      .catch(error => reject(error))
    } catch(error) {
      reject(error)
    }
  })
}

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
 * @param {string} value 
 * @param {string} currency 
 */
function currencyFormat(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}