import { roles } from '@models/User';
import { FormControl } from '@angular/forms';

export default function roleValidator(formControl: FormControl) {
    const role = formControl.value;
    if (!roles.includes(role)) { return role; }
    return null;
}
