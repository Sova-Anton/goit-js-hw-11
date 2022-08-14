import axios from 'axios';
export class ImageApiService {
  BASE_URL = 'https://pixabay.com/api/';
  API_KEY = '29223502-b1dc9d1d2c960e384c4942ba7';

  searchParams = new URLSearchParams({
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

  async fetchImages() {
    const response = await axios.get(
      `${this.BASE_URL}?key=${this.API_KEY}&q=${this.searchQuery}&${this.searchParams}&page=${this.page}&per_page=${this.per_page}`
    );
    this.page += 1;
    return response.data;
  }

  startPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
