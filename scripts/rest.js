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