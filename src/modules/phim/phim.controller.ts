import { Controller, Get, Param, Render } from "@nestjs/common";
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
            country: item.country[0].name,
            language: item.lang,
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

  @Get('/detail/:slug')
  @Render('phim-detail')
  async detail(@Param('slug') slug: string) {
    return {};
  }
}
