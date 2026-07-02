<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class ContactMessageStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => trim((string) $this->input('name')),
            'telephone' => trim((string) $this->input('telephone')),
            'question' => trim((string) $this->input('question')),
        ]);
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:50'],
            'telephone' => ['required', 'string', 'regex:/^[0-9]{7,15}$/'],
            'question' => ['required', 'string', 'min:10', 'max:1000'],
            'website' => ['nullable', 'string', 'max:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'telephone.regex' => 'Enter a telephone number containing 7 to 15 digits.',
            'website.max' => 'The message could not be sent.',
        ];
    }
}
