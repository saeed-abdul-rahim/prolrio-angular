import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import callingCodes from '@utils/callingCodes';
import { genders, UserInterface } from '@models/User';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MediaService } from '@services/media/media.service';
import snackBarSettings from '@settings/snackBar';
import Thumbnail from '@services/media/Thumbnail';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from '@services/storage/storage.service';
import { Subscription } from 'rxjs';
import { AuthService } from '@core/auth.service';
import { PublicService } from '@services/public/public.service';
import { GroupService } from '@services/group/group.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  faUser = faUser;
  genders = genders;
  callingCodes = callingCodes;
  countryCode: string;
  profileForm: FormGroup;

  uploadProgress: number;
  loading = false;
  showCropper = false;
  previewUrl: string | ArrayBuffer | null;
  previewBlob: Blob | null;

  image: any = '';

  user: UserInterface;
  userSubscription: Subscription;
  uploadProgressSubscription: Subscription;
  downloadURLSubscription: Subscription;

  @ViewChild('FileSelectInputDialog') FileSelectInputDialog: ElementRef;

  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, private auth: AuthService,
              private mediaService: MediaService, private storage: StorageService,
              private publicService: PublicService, private group: GroupService) { }

  ngOnInit(): void {
    this.getCountry();
    this.auth.getAfsCurrentUser().then(user => {
      const providers = user.providerData.map(p => p.providerId);
      if (providers.includes('password')) {
        this.form.email.setValue(user.email);
        this.form.email.disable();
      }
      if (providers.includes('phone')) {
        this.form.phone.setValue(user.phoneNumber);
        this.form.phone.disable();
        this.form.callCode.disable();
      }
    });
    this.userSubscription = this.auth.getCurrentUserDocument().subscribe(user => {
      this.user = user;
      if (user) {
        const { name, email, phone, photoUrl, dob, gender } = user;
        this.form.email.setValue(email);
        this.form.name.setValue(name);
        this.form.dob.setValue(dob);
        this.form.gender.setValue(gender);
        if (photoUrl) {
          this.previewUrl = photoUrl;
        }
        if (phone) {
          this.form.callCode.setValue(phone.substring(0, phone.length - 10));
          this.form.phone.setValue(phone.substring(phone.length - 10, phone.length));
        }
      }
    });
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.pattern('[a-zA-Z ]*'), Validators.maxLength(100)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      callCode: [''],
      phone: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      gender: [''],
      dob: [{value: '', disabled: true}]
    });
  }

  ngOnDestroy(): void {
    if (this.uploadProgressSubscription && !this.uploadProgressSubscription.closed) {
      this.uploadProgressSubscription.unsubscribe();
    }
    if (this.downloadURLSubscription && !this.downloadURLSubscription.closed) {
      this.downloadURLSubscription.unsubscribe();
    }
    if (this.userSubscription && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
  }

  public OpenAddFilesDialog() {
    const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
    e.click();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  detectNumber($event: string) {}

  fileChangeEvent(event: any): void {
    this.image = event;
  }

  removeFile() {
    this.showCropper = false;
    this.image = '';
    this.previewUrl = '';
    this.previewBlob = null;
  }

  async getCountry() {
    try {
      this.countryCode = await this.publicService.getLocation();
      const country = this.callingCodes.filter(c => c.code === this.countryCode)[0];
      this.form.callCode.setValue(country.callingCode);
    } catch (_) {}
  }

  async imageCropped(event: ImageCroppedEvent) {
    const base64Image = event.base64;
    const blob = await this.mediaService.dataURItoBlob(base64Image).toPromise();
    if (blob.size / 1024 / 1024 > 2) {
      this.openSnackBar('Image should not exceed 2MB');
      return;
    }
    this.generateThumbnail(blob);
  }
  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      this.openSnackBar('Unable to load image');
  }

  async generateThumbnail(file: Blob) {
    let preview: Thumbnail;
    try {
      preview = await this.mediaService.generateImageThumbnail(file);
      this.previewUrl = preview.url;
      this.previewBlob = preview.blob;
    } catch (err) {
      this.openSnackBar('Could not generate thumbnail');
    }
  }

  get form() { return this.profileForm.controls; }

  async onSubmit() {
    this.loading = true;
    const { name, email, callCode, phone, gender, dob } = this.form;
    if (this.profileForm.invalid) {
      if (name.errors) {
        this.openSnackBar('Invalid name');
      } else if (email.errors) {
          this.openSnackBar('Invalid email');
      } else if (phone.errors) {
        this.openSnackBar('Invalid mobile number');
      }
      return;
    }
    let data = {};
    if (name.value) {
      data = { ...data, name: name.value };
    }
    if (email.value) {
      data = { ...data, email: email.value };
    }
    if (phone.value) {
      const phoneNumber = callCode.value + phone.value;
      data = { ...data, phone: phoneNumber };
    }
    if (gender.value) {
      data = { ...data, gender: gender.value };
    }
    if (dob.value) {
      data = { ...data, dob: dob.value };
    }
    if (this.image && this.previewBlob) {
      const file = new File([this.previewBlob], 'profile.png');
      this.storage.upload(file, 'image', null, 'user');
      this.uploadProgressSubscription = this.storage.getUploadProgress().subscribe(
        progress => this.uploadProgress = progress,
        () => {
          this.openSnackBar('Error: Unable to upload file');
          this.loading = false;
          this.uploadProgress = 0;
        },
        () => this.downloadURLSubscription = this.storage.getDownloadURL().subscribe(async url => {
              await this.updateProfile({ ...data, photoUrl: url });
              this.loading = false;
              this.uploadProgress = 0;
          },
          () => {
            this.openSnackBar('Error: Unable to image Url');
            this.loading = false;
            this.uploadProgress = 0;
          }
        )
      );
    } else {
      await this.updateProfile(data);
      this.loading = false;
    }
  }

  async updateProfile(data: UserInterface) {
    try {
      await this.group.updateUser({ ...data});
      this.openSnackBar('Successfully updated');
    } catch (_) {
      this.openSnackBar('Unable to update profile');
    }
  }

}
