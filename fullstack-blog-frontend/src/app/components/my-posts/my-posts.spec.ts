import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyPostsComponent } from './my-posts';
import { PostService } from '../../services/post';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('MyPostsComponent', () => {
  let component: MyPostsComponent;
  let fixture: ComponentFixture<MyPostsComponent>;
  let postServiceSpy: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PostService', ['getUserPosts']);

    await TestBed.configureTestingModule({
      imports: [MyPostsComponent],
      providers: [
        { provide: PostService, useValue: spy },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    postServiceSpy = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;

    postServiceSpy.getUserPosts.and.returnValue(of({ data: [] }));

    fixture = TestBed.createComponent(MyPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUserPosts on init', () => {
    expect(postServiceSpy.getUserPosts).toHaveBeenCalled();
  });
});
