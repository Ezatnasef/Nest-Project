import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CreateSongDTO } from '../dto/create-song.dto';
import { AuthGuard } from '../common/guards/auth/auth.guard'; // استدعاء الـ Guard
import { Host } from '../common/decorators/host.decorator'; // استدعاء الـ Decorator

describe('SongsController', () => {
  let controller: SongsController;
  let service: SongsService;

  // 1. Mock الدوال عشان تكون ASYNC
  const mockSongsService = {
    create: jest.fn(dto => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn(() => Promise.resolve([{ id: 1, title: 'Test Song' }])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongsController],
      providers: [
        {
          provide: SongsService,
          useValue: mockSongsService, // Mock the Service
        },
        // 2. Mock الـ Guards عشان منتعبش نفسنا في الـ Unit Test
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn(() => true) } 
        }
      ],
    })
    // 3. Mock الـ Decorator (عشان ندي قيمة لـ @Host())
    .overrideGuard(AuthGuard).useValue({ canActivate: () => true }) 
    .compile();

    controller = module.get<SongsController>(SongsController);
    service = module.get<SongsService>(SongsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // 4. Test Create (لازم async/await)
  it('should call service.create when creating a song', async () => {
    const createSongDto: CreateSongDTO = { title: 'Test Song' };
    
    // نستخدم await هنا
    await controller.create(createSongDto);

    // نتأكد إن السيرفيس نادى عليه صح
    expect(service.create).toHaveBeenCalledWith(createSongDto);
  });

  // 5. Test FindAll (لازم async/await)
  it('should return all songs', async () => {
    // الـ Host Decorator بيحتاج قيمة، فبنبعتله أي حاجة وهمية
    const result = await controller.findAll('localhost');

    // بنتأكد إن الرد هو اللي الـ Mock رجعه
    expect(result).toEqual([{ id: 1, title: 'Test Song' }]);
  });
});