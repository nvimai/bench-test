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