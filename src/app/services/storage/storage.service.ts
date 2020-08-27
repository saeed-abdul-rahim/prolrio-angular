import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { User } from '@models/User';
import { AuthService } from '@core/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  user: User;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress$: Observable<number>;
  downloadURL$: Observable<any>;

  thumbnailRef: AngularFireStorageReference;
  thumbnailTask: AngularFireUploadTask;
  thumbnailUploadProgress$: Observable<number>;
  thumbnailDownloadURL$: Observable<any>;
  thumbnailDownloadURL: Observable<any>;

  fileName: string;
  thumbnailName: string;

  constructor(private afStorage: AngularFireStorage, private auth: AuthService) {
    this.auth.getCurrentUserStream().subscribe(user => this.user = user);
  }

  upload(file: File, fileType: string, thumbnailFile: Blob = null) {
    const randomId = Math.random().toString(36).substring(2);
    const { groupId } = this.user;
    const location = `${groupId}/${fileType}/`;
    this.fileName = randomId + file.name;
    this.thumbnailName = `thumb_${this.fileName}.png`;
    const fileLocation = location + this.fileName;
    const thumbnailLocation = location + this.thumbnailName;

    this.ref = this.afStorage.ref(fileLocation);
    this.task = this.ref.put(file);
    this.uploadProgress$ = this.task.percentageChanges();
    this.downloadURL$ = this.ref.getDownloadURL();

    if (thumbnailFile) {
      this.thumbnailRef = this.afStorage.ref(thumbnailLocation);
      this.thumbnailTask = this.thumbnailRef.put(thumbnailFile);
      this.thumbnailUploadProgress$ = this.thumbnailTask.percentageChanges();
      this.thumbnailDownloadURL$ = this.thumbnailRef.getDownloadURL();
    }
  }

  getUploadProgress(): Observable<number> {
    return this.uploadProgress$;
  }

  getDownloadURL(): Observable<string> {
    return this.downloadURL$;
  }
}
