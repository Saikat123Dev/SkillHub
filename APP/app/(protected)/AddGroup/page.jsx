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
    color: 'rgb(100 116 139)',
  },
  '& label.Mui-focused': {
    color: 'rgb(59 130 246)',
  },
  '& .MuiFilledInput-root': {
    backgroundColor: 'rgb(241 245 249)',
    color: 'rgb(30 41 59)',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgb(226 232 240)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgb(241 245 249)',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  },
});

export default function BlogForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const ref = useRef();
  const router = useRouter();
  const session = useSession();
  const userId = session?.data.user.id;

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('Name', data.Name);
      formData.append('description', data.description);

      const res = await Creategroup(formData);

      if (res && res.id) {
        router.push(`/groupchat/${res.id}/${userId}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.005]">
        <div className="bg-white border-2 border-blue-100 rounded-3xl shadow-lg shadow-blue-50/50 p-8 space-y-8 animate-fade-in-up">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Create New Group
            </h1>
            <p className="text-slate-600 text-lg">Build your community with a fresh, collaborative space</p>
          </div>

          <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <StyledTextField
                id="Name"
                label="Group Name"
                variant="filled"
                fullWidth
                {...register('Name', { required: true })}
                className="group"
                InputProps={{
                  endAdornment: (
                    <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      🏷️
                    </span>
                  ),
                }}
              />
              {errors.Name && (
                <p className="text-red-500 animate-shake pl-2 flex items-center gap-2">
                  <span>⚠️</span>Name is required
                </p>
              )}

              <StyledTextField
                id="description"
                label="Group Description"
                variant="filled"
                multiline
                rows={4}
                fullWidth
                {...register('description', { required: true })}
                className="group"
                InputProps={{
                  endAdornment: (
                    <span className="text-slate-400 group-focus-within:text-blue-500 transition-colors self-start pt-2">
                      📘
                    </span>
                  ),
                }}
              />
              {errors.description && (
                <p className="text-red-500 animate-shake pl-2 flex items-center gap-2">
                  <span>⚠️</span>Description is required
                </p>
              )}
            </div>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.3)]"
              sx={{
                '&:hover': {
                  boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.3)',
                },
              }}
            >
              <span className="relative z-10">Create Group 🌟</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
