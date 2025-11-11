import { Test, TestingModule } from '@nestjs/testing';
import { SongsService } from './songs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../songs/entities/song.entity'; // تأكد من المسار
import { CreateSongDTO } from '../dto/create-song.dto'; // تأكد من المسار

// 1. تعريف نسخة وهمية من Repository
const mockRepository = {
  // Mock findOneBy: نتوقع أن الدالة دي يتم استدعاؤها
  findOneBy: jest.fn(),
  // Mock find: نتوقع أن الدالة دي يتم استدعاؤها
  find: jest.fn(),
  // Mock create: بنخليه يرجع الـ DTO اللي اتبعته
  create: jest.fn((dto) => dto),
  // Mock save: بنخليه يرجع الـ DTO كأنه محفوظ
  save: jest.fn((song) => Promise.resolve(song)),
};

// 2. Mock البيانات
const mockSong: CreateSongDTO = { title: 'Test Song' };

describe('SongsService', () => {
  let service: SongsService;
  let repository: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          // 3. نحقن (Inject) النسخة الوهمية بدلاً من Repository الحقيقي
          provide: getRepositoryToken(Song),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    // 4. الحصول على الـ Repository الوهمي لاختباره
    repository = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // 5. الاختبارات الآن أصبحت async
  it('should call repository.save when creating a song', async () => {
    // نتوقع أن دالة save سيتم استدعائها بالـ DTO
    await service.create(mockSong);
    expect(repository.save).toHaveBeenCalledWith(mockSong);
  });

  it('should call repository.find and return all songs', async () => {
    // نجعل الـ Mock يرجع قائمة وهمية
    jest.spyOn(repository, 'find').mockResolvedValueOnce([mockSong] as Song[]);
    
    // نشغل الدالة
    const result = await service.findAll({ limit: 10, offset: 0 }); 
    
    // نتأكد أن دالة find تم استدعائها
    expect(repository.find).toHaveBeenCalled();
    // نتأكد أن الرد هو الـ Mock اللي جهزناه
    expect(result).toEqual([mockSong]); 
  });
});