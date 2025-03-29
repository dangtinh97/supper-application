import { Controller, Get, Render } from '@nestjs/common';
import { dataHome } from 'src/data/home';

@Controller('/phim')
export class PhimController {
  constructor() {}

  @Get('/')
  @Render('phim-home')
  async index() {
    //{id: 1, title: 'The Last Journey', year: 2023, genre: 'action', country: 'usa', rating: '4.8', poster: 'https://placehold.co/300x450'}
    const data = {
      x_data: {
        selectedGenre: 'all',
        selectedCountry: 'all',
        showFilters: false,
        currentPage: dataHome.pagination.currentPage,
        itemsPerPage: dataHome.pagination.totalItemsPerPage,
        movies: dataHome.items.map((item, index) => {
          return {
            id: index,
            title: item.name,
            year: item.year,
            genre: '',
            country: '',
            rating: '4.8',
            poster: item.poster_url,
            categories: item.category.map((item) => item.name),
            slug: item.slug,
          };
        }),
      },
    };
    console.log(JSON.stringify(data.x_data.movies));
    // console.log(JSON.stringify(data));
    return data;
  }
}
