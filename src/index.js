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

  imageApiService.query = e.currentTarget.elements.searchQuery.value.trim();
  imageApiService.startPage();

  loadMoreBtn.classList.add('is-hidden');

  try {
    /*Проверка на пустую строку */
    if (!imageApiService.query) {
      gallery.innerHTML = '';
      loadMoreBtn.classList.add('is-hidden');
      Notify.failure('Please, enter a request.');
      return;
    }

    const response = await imageApiService.fetchImages();

    if (response.totalHits > 40) {
      loadMoreBtn.classList.remove('is-hidden');
    }

    if (response.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      renderMarkupImages(response.hits);
    }
  } catch (error) {
    console.log(error);
  }
}

async function clickLoadMore() {
  try {
    const response = await imageApiService.fetchImages();
    renderMarkupImages(response.hits);
      scroll();
      /*Прячем кнопку подгрузки картинок если картинок больше нет */
    const currentHits = response.hits.length;
    console.log(currentHits);
    if (currentHits < 40) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreBtn.classList.add('is-hidden');
      }      
  } catch (error) {    
    console.log(error);
  }
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
/*Прокрутка после рендера новых картинок */

function scroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
