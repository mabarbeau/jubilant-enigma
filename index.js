import { Observable } from 'https://unpkg.com/rxjs?module';
import isEmail from 'https://unpkg.com/validator/es/lib/isEmail?module';


const $form = document.querySelector('form')
const $inputs = document.querySelectorAll('input[name]')
const $submit = document.querySelector('input[type="submit"]')

const validators = {
    email: (value) => isEmail(value),
    password: (value) => value.length,
}

const data = {
    email: undefined,
    password: undefined,
    isValid: () => Object.entries(validators).every(([key, validator]) => validator(data[key])),
}

const observable = new Observable((subscriber) => {
    $inputs.forEach((element) => {
        data[element.name] = element.value
        element.addEventListener('keyup', (event) => subscriber.next(event))
    })
});

observable.subscribe({
    next: ({ target }) => {
        data[target.name] = target.value
    
        target.parentNode.classList[validators[target.name](data[target.name]) ? 'add' : 'remove']('valid')
    },
});

observable.subscribe({
    next: () => {
        const isValid = data.isValid();

        $form.classList[isValid ? 'add' : 'remove']('valid')

        $submit.disabled = !isValid
    },
});


$form.addEventListener('submit', function (event) {
    event.preventDefault()

    const isValid = data.isValid();
    
    if (isValid) {
        $form.classList[isValid ? 'add' : 'remove']('submitting')
    }
})

$form.addEventListener('animationend', () => {
    $form.classList.remove('submitting')
});