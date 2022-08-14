import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { ImageApiService } from './js/fetchImages';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let lightboxGallery = new SimpleLightbox('.gallery a');
const imageApiService = new ImageApiService();

form.addEventListener('submit', onSearchBtnClick);
loadMoreBtn.addEventListener('click', clickLoadMore);

async function onSearchBtnClick(e) {
  e.preventDefault();
  gallery.innerHTML = '';

  imageApiService.query = e.currentTarget.elements.searchQuery.value;
  imageApiService.startPage();

  try {
    const response = await imageApiService.fetchImages();
    if (response.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (response.totalHits < imageApiService.per_page) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      renderMarkupImages(response.hits);
    } else {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      renderMarkupImages(response.hits);
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function clickLoadMore() {
  const response = await imageApiService.fetchImages();
  renderMarkupImages(response.hits);
}

function renderMarkupImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
       <a class="image-link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightboxGallery.refresh();
}
