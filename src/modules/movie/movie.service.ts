import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity, UserEntity } from 'src/entities';
import { Repository } from 'typeorm';

import { FilesService } from '../files/files.service';

import { CreateMovieDto } from './dto/create-movie-dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly fileService: FilesService,
  ) {}

  async createMovie(
    createMovieDto: CreateMovieDto,
    user: UserEntity,
  ): Promise<MovieEntity> {
    const { movieImage } = createMovieDto;

    const { key } = await this.fileService.uploadFile(movieImage, 'movie');

    const movie = this.movieRepository.create({
      ...createMovieDto,
      user,
      imageUrl: key,
    });

    return this.movieRepository.save(movie);
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMovieDto,
    user: UserEntity,
  ): Promise<MovieEntity> {
    const { movieImage } = updateMovieDto;
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    if (movieImage) {
      if (movie.imageUrl) {
        await this.fileService.deleteFile(movie.imageUrl);
      }

      const { key } = await this.fileService.uploadFile(movieImage, `movie`);

      movie.imageUrl = key;
    }
    Object.assign(movie, updateMovieDto);

    return this.movieRepository.save(movie);
  }

  async getMovieById(id: string): Promise<MovieEntity> {
    return this.movieRepository.findOneBy({ id });
  }

  async getAllMovies(
    userId: string,
    options: { skip?: number; take?: number },
  ): Promise<{ movies: MovieEntity[]; count: number }> {
    const { skip, take } = options;

    console.log(skip);
    const [movies, count] = await this.movieRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take,
    });

    return { movies, count };
  }
}
