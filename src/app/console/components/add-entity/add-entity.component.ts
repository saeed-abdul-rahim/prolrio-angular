import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '@services/storage/storage.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '@core/auth.service';
import { User } from '@models/User';
import { EntityInterface, ContentType } from '@models/Entity';
import { ProviderService } from '@services/provider/provider.service';
import snackBarSettings from '@settings/snackBar';
import { MediaService } from '@services/media/media.service';
import Thumbnail from '@services/media/Thumbnail';
import { CommonService } from '@services/common/common.service';
import { LimitExceededComponent } from '@components/limit-exceeded/limit-exceeded.component';

@Component({
  selector: 'app-add-entity',
  templateUrl: './add-entity.component.html',
  styleUrls: ['./add-entity.component.scss']
})
export class AddEntityComponent implements OnInit, OnDestroy {

  subjectId: string;
  subjectName: string;
  faFileUpload = faFileUpload;
  isUploaded = false;
  uploadProgress = 0;
  loading = false;
  invalidFile = false;
  file: File;
  fileType: ContentType;
  previewUrl: string | ArrayBuffer | null;
  previewBlob: Blob | null;
  entityForm: FormGroup;
  user: User;

  uploadProgressSubscription: Subscription;
  downloadURLSubscription: Subscription;
  subjectSubscription: Subscription;

  editorConfig = {
    editable: true,
    placeholder: 'Description',
    toolbarHiddenButtons: [
      ['insertImage'],
      ['insertVideo']
    ]
  };

  constructor(private auth: AuthService, private provider: ProviderService, private storage: StorageService,
              public dialogRef: MatDialogRef<AddEntityComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
              private formBuilder: FormBuilder, private mediaService: MediaService, private commonService: CommonService,
              private matDialog: MatDialog) {
    const { subjectId } = data;
    this.subjectId = subjectId;
    this.auth.getCurrentUserStream().pipe(take(1)).subscribe(user => this.user = user);
    this.subjectSubscription = this.commonService.getCurrentSubject().subscribe(subject => {
      if (subject) {
        const { subjectName } = subject;
        this.subjectName = subjectName;
      } else {
        this.commonService.setCurrentSubject(this.subjectId);
      }
    });
  }

  ngOnInit(): void {
    this.entityForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(10000)]]
    });
  }

  ngOnDestroy(): void {
    if (this.uploadProgressSubscription && !this.uploadProgressSubscription.closed) {
      this.uploadProgressSubscription.unsubscribe();
    }
    if (this.downloadURLSubscription && !this.downloadURLSubscription.closed) {
      this.downloadURLSubscription.unsubscribe();
    }
    if (this.subjectSubscription && !this.subjectSubscription.closed) {
      this.subjectSubscription.unsubscribe();
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  close() {
    this.dialogRef.close();
  }

  get form() { return this.entityForm.controls; }

  async onFileDropped($event) {
    this.file = $event[0];
    this.fileType = this.checkFileType(this.file);
    await this.generateThumbnail(this.file, this.fileType);
  }

  async onFileClicked(fileInput: Event){
    this.file = (fileInput.target as HTMLInputElement).files[0];
    this.fileType = this.checkFileType(this.file);
    await this.generateThumbnail(this.file, this.fileType);
  }

  checkFileType(file: File) {
    const fileTypes = ['image/png', 'image/jpeg', 'video/mp4',  'application/pdf'];
    if (!fileTypes.includes(file.type)) {
      this.invalidFile = true;
      this.openSnackBar('Invalid File');
      this.removeFile();
      return null;
    } else {
      this.invalidFile = false;
      let fileType = file.type.split('/')[0];
      fileType = fileType === 'application' ? 'document' : fileType;
      return fileType as ContentType;
    }
  }

  async generateThumbnail(file: File, fileType: ContentType) {
    let preview: Thumbnail;
    try {
      if (fileType === 'video') {
        preview = await this.mediaService.generateVideoThumbnail(file);
      } else if (fileType === 'image') {
        preview = await this.mediaService.generateImageThumbnail(file);
      } else {
        preview = { url: null, blob: null };
      }
      this.previewUrl = preview.url;
      this.previewBlob = preview.blob;
    } catch (err) {
      this.openSnackBar('Could not generate thumbnail');
    }
  }

  submitResponse(message: string) {
    this.openSnackBar(message);
    this.loading = false;
  }

  removeFile() {
    this.file = null;
    this.fileType = null;
    this.isUploaded = false;
    this.invalidFile = true;
  }

  async onSubmit() {
    this.loading = true;
    const error = this.checkFormErrors();
    if (error) {
      this.loading = false;
      return;
    }
    const { title, description } = this.form;
    if (!this.file) {
      await this.createRecord(title.value, description.value);
      this.submitResponse('Successfully created');
      return;
    }
    this.storage.upload(this.file, this.fileType, this.previewBlob);
    this.uploadProgressSubscription = this.storage.getUploadProgress().subscribe(
      progress => this.uploadProgress = progress,
      () => {
        this.submitResponse('Unable to upload file');
      },
      () => this.downloadURLSubscription = this.storage.getDownloadURL().subscribe(async url => {
          if (this.previewUrl) {
            this.storage.thumbnailDownloadURL$.subscribe(async thumbnailImageUrl => {
              await this.createRecord(title.value, description.value, this.storage.fileName, url,
                this.storage.thumbnailName, thumbnailImageUrl);
            },
            async () => {
              await this.createRecord(title.value, description.value, this.storage.fileName, url);
              this.submitResponse('Unable to create thumbnail');
            });
          } else {
            await this.createRecord(title.value, description.value, this.storage.fileName, url);
            this.submitResponse('Successfully created');
          }
        },
        () => {
          this.submitResponse('Unable to get image Url');
        }
      )
    );
  }

  checkFormErrors() {
    let error = false;
    const { title, description } = this.form;
    if (this.entityForm.invalid) {
      if (title.errors) {
        const { errors } = title;
        if (errors.required) { this.openSnackBar('Title is required'); }
        if (errors.maxlength) { this.openSnackBar('Title: Maximum limit exceeded (100 chars)'); }
      }
      else if (description.errors) {
        const { errors } = description;
        if (errors.maxlength) { this.openSnackBar('Description: Maximum limit exceeded (10,000 chars)'); }
      }
      if (!this.file && !description.value) {
        this.openSnackBar('File / Description required is required');
        error = true;
      }
      error = true;
    }
    return error;
  }

  async createRecord(title: string, description: string, contentName = '', url = '',
                     thumbnailName = '', thumbnailImageUrl = '') {
    try {
      const entity: EntityInterface = {
        subjectId: this.subjectId,
        subjectName: this.subjectName,
        title,
        description,
        author: this.user.name || this.user.email,
        contentName,
        contentUrl: url,
        contentType: this.fileType ? this.fileType : '',
        contentSize: this.file && this.file.size ? this.file.size : 0,
        thumbnailName,
        thumbnailImageUrl
      };
      await this.provider.createEntity(entity);
      this.submitResponse('Successfully created');
      this.close();
    } catch (err) {
      this.loading = false;
      this.openSnackBar(err);
      console.log(err);
      if (err && err.includes('Limit Exceeded')) {
        const { sudo } = await this.auth.getCurrentUser();
        if (sudo) { this.matDialog.open(LimitExceededComponent); }
      } else {
        this.submitResponse('Unable to create content');
      }
    }
  }

}
