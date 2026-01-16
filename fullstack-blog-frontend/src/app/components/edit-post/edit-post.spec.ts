import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post';
import { PostService } from '../../services/post';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const pSpy = jasmine.createSpyObj('PostService', [
      'getPostBySlug',
      'getCategories',
      'updatePost',
      'archivePost',
    ]);
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);

    pSpy.getCategories.and.returnValue(of([]));
    pSpy.getPostBySlug.and.returnValue(
      of({
        id: 1,
        title: 'Test',
        content: 'Content',
        category_id: 1,
        thumbnail_url: 'img.jpg',
      } as any)
    );

    await TestBed.configureTestingModule({
      imports: [EditPostComponent, FormsModule],
      providers: [
        { provide: PostService, useValue: pSpy },
        { provide: Router, useValue: rSpy },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: (key: string) => 'test-slug' }) },
        },
      ],
    }).compileComponents();

    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load post data on init', () => {
    expect(postServiceSpy.getPostBySlug).toHaveBeenCalledWith('test-slug');
    expect(component.post.title).toBe('Test');
  });
});
