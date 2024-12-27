'use client';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Creategroup } from '../../../actions/group';

const StyledTextField = styled(TextField)({
  '& label': {
    color: 'rgb(209 213 219)', // text-gray-300
  },
  '& label.Mui-focused': {
    color: 'rgb(209 213 219)',
  },
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgb(55 65 81)', // bg-gray-700
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgb(75 85 99)', // slightly lighter on hover
    },
    '&.Mui-focused': {
      backgroundColor: 'rgb(55 65 81)',
    },
    '& input': {
      color: 'white',
    },
    '& textarea': {
      color: 'white',
    }
  }
}); // Assuming this function handles the API request

export default function BlogForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const ref = useRef();
  const router = useRouter();
  const session = useSession();
  const userId = session?.data.user.id
  const onSubmit = async (data) => {
    try {
      console.log('Submitted data:', data);

      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('description', data.description);

      const res = await Creategroup(formData);

      if (res && res.id) {
        console.log("Group created successfully with ID:", res.id);
        // Redirect to the newly created group's page
        router.push(`/groupchat/${res.id}/${userId}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-h-screen  text-white flex justify-center items-center py-12">
      <div className="min-w-full max-w-lg mx-auto bg-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-violet-500 mb-8">Create a New Group</h2>

        <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Name Field */}
          <StyledTextField
            id="Name"
            label="Name"
            variant="filled"
            fullWidth

            {...register('Name', { required: true })}
          />
          {errors.Name && <span className="text-red-500">Name is required</span>}

          {/* Description Field */}
          <StyledTextField
            id="description"
            label="Description"
            variant="filled"
            multiline
            rows={4}
            fullWidth

            {...register('description', { required: true })}
          />
          {errors.description && <span className="text-red-500">Description is required</span>}

          {/* Submit Button */}
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
