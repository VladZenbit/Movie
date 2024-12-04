import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOkResponse,
  ApiConsumes,
  ApiExtraModels,
} from '@nestjs/swagger';
import { MovieEntity } from 'src/entities';

import { GetUser } from '../users/decorators/get-user.decorators';

import { CreateMovieDto } from './dto/create-movie-dto';
import { GetAllMoviesequestQuery } from './dto/get-all-movies-request.dto';
import { GetMovieResponseBodyDto } from './dto/get-movie-response-body-dto';
import { GetMoviesResponseBodyDto } from './dto/get-movies-response-body-dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieService } from './movie.service';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  private readonly movieService: MovieService;

  constructor(movieService: MovieService) {
    this.movieService = movieService;
  }

  @Post()
  @UseInterceptors(FileInterceptor('movieImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Create a new movie', type: MovieEntity })
  @ApiExtraModels(CreateMovieDto)
  async createMovie(
    @GetUser() user,
    @Body() body: CreateMovieDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '(image/png|image/jpeg|image/svg)' })
        .build({ fileIsRequired: false }),
    )
    movieImage?: Express.Multer.File,
  ): Promise<MovieEntity> {
    body.movieImage = movieImage;

    return this.movieService.createMovie(body, user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('movieImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Update a movie', type: MovieEntity })
  async updateMovie(
    @GetUser() user,
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '(image/png|image/jpeg|image/svg)' })
        .build({ fileIsRequired: false }),
    )
    movieImage?: Express.Multer.File,
  ): Promise<MovieEntity> {
    updateMovieDto.movieImage = movieImage;

    return this.movieService.updateMovie(id, updateMovieDto, user);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get a movie by ID', type: MovieEntity })
  async getMovieById(
    @Param('id') id: string,
  ): Promise<GetMovieResponseBodyDto> {
    const movie = await this.movieService.getMovieById(id);

    return new GetMovieResponseBodyDto(movie);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all movies (with optional pagination)',
    type: [MovieEntity],
  })
  async getAllMovies(
    @GetUser() user,
    @Query() query: GetAllMoviesequestQuery,
  ): Promise<GetMoviesResponseBodyDto> {
    const { page, take } = query;

    const { movies, count } = await this.movieService.getAllMovies(
      user.id,
      query,
    );

    return new GetMoviesResponseBodyDto({
      metadata: { itemsAmount: count, page, take },
      movies: movies,
    });
  }
}
