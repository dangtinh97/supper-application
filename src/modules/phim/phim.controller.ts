import { Controller, Get, Param, Query, Render } from '@nestjs/common';
import { dataHome, dataDetail } from 'src/data/home';
import * as _ from 'lodash';
import { PhimService } from './phim.service';

@Controller('/phim')
export class PhimController {
  constructor(public service: PhimService) {}

  @Get('')
  @Render('phim-home')
  async index(
    @Query('page') page: string,
    @Query('type') type: string,
    @Query('category') category: string,
    @Query('search') search: string,
  ) {
    page = page || '1';
    let url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
    if (type) {
      url = `https://phimapi.com/v1/api/the-loai/${type}?page=${page}`;
    }
    if (category) {
      url = `https://phimapi.com/v1/api/danh-sach/${category}?page=${page}`;
    }
    if(search && search.trim()!=''){
      url = `https://phimapi.com/v1/api/tim-kiem?keyword=${search.trim()}`;
    }

    if ((category && category == 'all') || (type && type === 'all')) {
      url = `https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
    }
    const dataCurl = await this.service.curlData(url);
    const imageCdn = _.get(
      dataCurl,
      'data.APP_DOMAIN_CDN_IMAGE',
      'https://phimimg.com',
    );
    let dataHome: any = {};
    if (url.includes('danh-sach/phim-moi-cap-nha')) {
      dataHome = dataCurl;
    }
    if (
      (url.includes('/the-loai/') ||
        url.includes('danh-sach/') ||
        url.includes('/tim-kiem?keyword=')) &&
      !url.includes('danh-sach/phim-moi-cap-nhat')
    ) {
      dataHome.pagination = dataCurl.data.params.pagination;
      dataHome.items = dataCurl.data.items;
    }
    //{id: 1, title: 'The Last Journey', year: 2023, genre: 'action', country: 'usa', rating: '4.8', poster: 'https://placehold.co/300x450'}
    const data = {
      x_data: {
        selectedGenre: category || 'all',
        selectedCountry: type || 'all',
        showFilters: false,
        currentPage: dataHome.pagination.currentPage,
        itemsPerPage: dataHome.pagination.totalPages,
        searchQuery: search || '',
        movies: dataHome.items.map((item, index) => {
          let poster = item.poster_url;
          if (!poster.includes('https')) {
            poster = `${imageCdn}/${poster}`;
          }
          return {
            id: index,
            title: item.name,
            year: item.year,
            genre: '',
            country: item.country[0].name,
            language: item.lang,
            poster: poster,
            categories: item.category.map((item) => item.name),
            slug: item.slug,
          };
        }),
      },
    };
    // console.log(JSON.stringify(data));
    return data;
  }

  @Get('/detail/:slug')
  @Render('phim-detail')
  async detail(@Param('slug') slug: string) {
    const url = `https://phimapi.com/phim/${slug}`;
    const dataDetail = await this.service.curlData(url);
    return {
      id: 1,
      title: _.get(dataDetail, 'movie.name'),
      year: _.get(dataDetail, 'movie.year'),
      genre: _.get(dataDetail, 'movie.lang'),
      country: _.get(dataDetail, 'movie.country.0.name'),
      rating: _.get(dataDetail, 'movie.tmdb.vote_average'),
      duration: _.get(dataDetail, 'movie.time'),
      director: _.get(dataDetail, 'movie.director.0'),
      cast: _.get(dataDetail, 'movie.actor'),
      description: _.get(dataDetail, 'movie.content'),
      poster: _.get(dataDetail, 'movie.poster_url'),
      gallery: [],
      episodes: _.get(dataDetail, 'episodes'),
    };
  }
}
