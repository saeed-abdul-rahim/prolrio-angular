import { ValidationErrors, FormGroup } from '@angular/forms';

export default function allValidation(form: FormGroup) {
    const errors = [];
    Object.keys(form.controls).forEach(key => {
    const controlErrors: ValidationErrors = form.get(key).errors;
    if (controlErrors != null) {
            Object.keys(controlErrors).forEach(keyError => {
                errors.push({errorKey: key, error: keyError});
            });
        }
    });
    return errors;
}
