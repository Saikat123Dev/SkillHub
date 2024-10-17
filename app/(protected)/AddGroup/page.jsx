'use client';
import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

export default function BlogForm() {
  const [selectedTags, setSelectedTags] = useState([]);
  const router = useRouter();
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm();
  const ref = useRef();

  return (
    <div className="max-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white flex justify-center items-center py-12">
      <div className="min-w-full max-w-lg mx-auto bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-violet-500 mb-8">Create a New Group</h2>
        
        <form ref={ref} handleSubmit={onsubmit} className="space-y-6">
          
          {/* Name Field */}
          <TextField
            id="Name"
            label="Name"
            variant="filled"
            fullWidth
            {...register('title', { required: true })}
            className="text-gray-300 bg-gray-600"
          />

          {/* Description Field */}
          <TextField
            id="description"
            label="Description"
            variant="filled"
            multiline
            rows={4}
            fullWidth
            {...register('description', { required: true })}
            className="text-gray-100 bg-gray-600"
          />

          <Button
            variant="contained"
            color="secondary"
            type="submit"
            fullWidth
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
          >
            Create Group
          </Button>
        </form>
      </div>
    </div>
  );
}
