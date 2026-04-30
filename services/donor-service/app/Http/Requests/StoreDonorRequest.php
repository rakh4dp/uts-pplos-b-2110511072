<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreDonorRequest extends FormRequest
{
 
    public function authorize(): bool
    {
        return true;
    }

    
    public function rules(): array
    {
        return [
            'name'          => 'required|string|max:255',
            'phone'         => 'required|string|max:15|unique:donors,phone',
            'address'       => 'required|string',
            'blood_type_id' => 'required|exists:blood_types,id', 
        ];
    }

    public function messages(): array
    {
        return [
            'blood_type_id.exists' => 'Golongan darah yang dipilih tidak valid.',
            'phone.unique'         => 'Nomor telepon ini sudah terdaftar sebagai pendonor.',
            'required'             => 'Kolom :attribute wajib diisi.',
        ];
    }

   
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors'  => $validator->errors()
        ], 422)); 
    }
}