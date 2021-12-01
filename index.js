import { Observable } from 'https://unpkg.com/rxjs?module';
import isEmail from 'https://unpkg.com/validator/es/lib/isEmail?module';

const $elements = {
    form: document.querySelector('form'),
    inputs: document.querySelectorAll('input[name]'),
    submit: document.querySelector('input[type="submit"]'),
}

const validators = {
    email: (value) => isEmail(value),
    password: (value) => value.length > 2,
}

const data = {
    email: undefined,
    password: undefined,
    isValid: () => Object.entries(validators).every(([key, validator]) => validator(data[key])),
}

const observable = new Observable((subscriber) => {
    $elements.inputs.forEach((element) => {
        data[element.name] = element.value
        element.addEventListener('change', (event) => {
            subscriber.next(event.target);
        });
    })
});

observable.subscribe({
    next: (target) => {
        data[target.name] = target.value
    
        target.parentNode.setAttribute('class', validators[target.name](data[target.name]) ? 'valid' : '')

        const isValid = data.isValid();

        $elements.form.setAttribute('class', isValid ? 'valid' : '')

        $elements.submit.disabled = !isValid
    },
    error: console.error,
});


$elements.form.addEventListener('submit', function (event) {
    event.preventDefault()

    const isValid = data.isValid();
    
    if (isValid) {
        $elements.form.setAttribute('class', isValid ? 'submitting' : '')
    }
});
