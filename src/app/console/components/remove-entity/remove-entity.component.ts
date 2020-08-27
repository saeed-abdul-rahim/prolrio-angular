import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProviderService } from '@services/provider/provider.service';
import snackBarSettings from '@settings/snackBar';

@Component({
  selector: 'app-remove-entity',
  templateUrl: './remove-entity.component.html',
  styleUrls: ['./remove-entity.component.scss']
})
export class RemoveEntityComponent implements OnInit {

  id: string;
  name: string;
  loading = false;

  constructor(public dialogRef: MatDialogRef<RemoveEntityComponent>, @Inject(MAT_DIALOG_DATA) public  data: any,
              private snackBar: MatSnackBar, private provider: ProviderService) {
    const { id, name } = data;
    if (!id || !name) { this.close(false); }
    this.id = id;
    this.name = name;
  }

  ngOnInit(): void {
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', snackBarSettings);
  }

  close(success: boolean) {
    this.dialogRef.close(success);
  }

  async remove() {
    this.loading = true;
    try {
      await this.provider.removeEntity(this.id);
      this.openSnackBar(`Successfully removed ${this.name}`);
      this.close(true);
    } catch (err) {
      this.openSnackBar(`Unable to remove ${this.name}`);
      this.close(false);
    }
    this.loading = false;
  }

}
